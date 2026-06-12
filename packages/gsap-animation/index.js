// BLX GSAP Animation
// Version: 2.4.5
// Requires: GSAP, SplitText (for text), ScrollTrigger, ScrambleTextPlugin (optional)
//
// Changes from v2.4.4:
// - Debounce-refresh ScrollTrigger whenever an image finishes loading, not just on
//   window.load. Lazy/CMS images above a scroll element settle after load, shifting it
//   down and leaving the cached trigger positions stale (animation stuck fully revealed).

(() => {
  window.BLX_TEXT_ANIMATION = function () {
    if (!window.gsap) {
      console.warn('[BLX_TEXT_ANIMATION] GSAP not found. Load GSAP before this script.');
      return;
    }

    const plugins = [window.SplitText, window.ScrollTrigger, window.ScrambleTextPlugin].filter(Boolean);
    if (plugins.length) gsap.registerPlugin(...plugins);

    const elements = document.querySelectorAll('[blx-anim]');
    if (!elements.length) return;

    elements.forEach(el => {
      const effects  = (el.getAttribute('blx-anim') || '').split(/\s+/).map(s => s.trim()).filter(Boolean);
      const duration = (el.hasAttribute('blx-duration') ? parseFloat(el.getAttribute('blx-duration')) : 800) / 1000;
      const delay    = (el.hasAttribute('blx-delay')    ? parseFloat(el.getAttribute('blx-delay'))    : 0)   / 1000;
      const stagger  = (el.hasAttribute('blx-stagger')  ? parseFloat(el.getAttribute('blx-stagger'))  : 0)   / 1000;

      // blx-prop: supports both space-separated and comma-separated flags and key=value pairs
      const rawProps = (el.getAttribute('blx-prop') || '').split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
      const flags = rawProps.filter(p => !p.includes('=')).map(p => p.toLowerCase());
      const opts  = Object.fromEntries(
        rawProps.filter(p => p.includes('=')).map(p => {
          const eq = p.indexOf('=');
          return [p.slice(0, eq).trim().toLowerCase(), p.slice(eq + 1).trim()];
        })
      );

      const ease      = opts.ease      || 'power2.out';
      const distance  = parseFloat(opts.distance)  || 40;
      const sharpness = parseFloat(opts.sharpness) || 8;
      const scrollEnd = parseFloat(opts.end)        || 50;
      const inview    = flags.includes('inview');
      const repeat    = flags.includes('repeat');
      const scroll    = flags.includes('scroll');
      const clip      = flags.includes('clip');
      const children  = flags.includes('children');
      const perChar   = flags.includes('per-char');
      const perWord   = flags.includes('per-word');
      const perLine   = flags.includes('per-line');

      const direction = flags.find(f => ['up', 'down', 'left', 'right'].includes(f)) || 'up';

      function slideVars(dist) {
        switch (direction) {
          case 'down':  return { y: -dist };
          case 'left':  return { x:  dist };
          case 'right': return { x: -dist };
          default:      return { y:  dist };
        }
      }

      // ── Scramble (no SplitText — no resize handling needed) ───────────────────
      if (effects.includes('scramble')) {
        if (!window.ScrambleTextPlugin) {
          console.warn('[BLX_TEXT_ANIMATION] ScrambleTextPlugin not found for "scramble" effect.');
          return;
        }
        const text = el.textContent.trim();
        el.style.opacity = '1';
        const scrollTrigger = inview && window.ScrollTrigger ? {
          trigger: el, start: 'top 85%',
          ...(repeat ? { toggleActions: 'play none none reset' } : { once: true }),
        } : undefined;
        gsap.to(el, { duration, ease, delay, scrambleText: { text, chars: 'upperCase', speed: 0.4 }, scrollTrigger });
        return;
      }

      // ── Element animation (no split — no resize handling needed) ─────────────
      if (!perChar && !perWord && !perLine && !scroll) {
        // `children` flag: animate direct children of el as a group (enables stagger across siblings)
        // Always reveal the parent — [blx-anim] { opacity: 0 } hides it by default to prevent FOUC
        el.style.opacity = '1';
        const targets = children ? Array.from(el.children) : el;
        const fromVars = {};
        const toVars   = {};
        if (effects.includes('fade'))  { fromVars.opacity = 0;          toVars.opacity = 1; }
        if (effects.includes('blur'))  { fromVars.filter = 'blur(8px)'; toVars.filter = 'blur(0px)'; }
        if (effects.includes('scale')) { fromVars.scale = 0.85;         toVars.scale = 1; }
        if (effects.includes('slide')) {
          const sv = slideVars(distance);
          Object.assign(fromVars, sv);
          if ('y' in sv) toVars.y = 0;
          if ('x' in sv) toVars.x = 0;
        }
        if (!Object.keys(fromVars).length) {
          console.warn(`[BLX_TEXT_ANIMATION] No recognised effects for element animation: "${effects.join(' ')}". Add per-char, per-word, or per-line for text animation.`);
          return;
        }
        const scrollTrigger = inview && window.ScrollTrigger ? {
          trigger: el, start: 'top 85%',
          ...(repeat ? { toggleActions: 'play none none reset' } : { once: true }),
        } : undefined;
        const staggerVal = stagger > 0 ? { each: stagger } : 0;
        gsap.fromTo(targets, fromVars, { ...toVars, duration, ease, delay, stagger: staggerVal, scrollTrigger });
        return;
      }

      // ── Split-based animations — all require resize handling ──────────────────
      if (!window.SplitText) {
        console.warn('[BLX_TEXT_ANIMATION] SplitText not found for text animation.');
        return;
      }

      // Per-element state tracked so cleanup() can fully reset before re-running
      let currentSplit    = null;
      let currentTargets  = [];
      let currentWrappers = [];
      let currentSTs      = []; // ScrollTrigger instances

      function cleanup() {
        if (currentTargets.length) gsap.killTweensOf(currentTargets);
        currentSTs.forEach(st => st && st.kill());
        currentSTs = [];
        currentWrappers.forEach(wrap => {
          if (wrap.firstChild && wrap.parentNode) {
            wrap.parentNode.insertBefore(wrap.firstChild, wrap);
            wrap.parentNode.removeChild(wrap);
          }
        });
        currentWrappers = [];
        if (currentSplit) { currentSplit.revert(); currentSplit = null; }
        currentTargets = [];
      }

      function run() {
        cleanup();

        // ── Scroll scrub mode ───────────────────────────────────────────────────
        if (scroll && window.ScrollTrigger) {
          el.style.opacity = '1';
          const splitType = perChar ? 'chars' : perWord ? 'words' : 'lines';
          const splitArg  = perChar ? 'chars,words' : splitType;
          currentSplit    = new SplitText(el, { type: splitArg });
          currentTargets  = currentSplit[splitType];

          const startPct = scrollEnd + sharpness;
          const endPct   = scrollEnd;

          if (splitType === 'lines') {
            const fromVars = { opacity: 0.15 };
            const toVars   = { opacity: 1, ease: 'none' };
            if (effects.includes('blur'))  { fromVars.filter = 'blur(6px)';  toVars.filter = 'blur(0px)'; }
            if (effects.includes('slide')) {
              const sv = slideVars(distance);
              Object.assign(fromVars, sv);
              if ('y' in sv) toVars.y = 0;
              if ('x' in sv) toVars.x = 0;
            }
            gsap.set(currentTargets, { ...fromVars });
            currentTargets.forEach(target => {
              const tw = gsap.fromTo(target, { ...fromVars }, {
                ...toVars,
                scrollTrigger: { trigger: target, start: `top ${startPct}%`, end: `top ${endPct}%`, scrub: true },
              });
              if (tw.scrollTrigger) currentSTs.push(tw.scrollTrigger);
            });
          } else {
            // Per-word / per-char: timeline for opacity/slide, individual triggers for blur
            const itemDur = Math.max(0.05, sharpness / 100);
            const opFrom  = { opacity: 0.15 };
            const opTo    = { opacity: 1, ease: 'none' };
            if (effects.includes('slide')) {
              const sv = slideVars(distance);
              Object.assign(opFrom, sv);
              if ('y' in sv) opTo.y = 0;
              if ('x' in sv) opTo.x = 0;
            }
            const initVars = { ...opFrom };
            if (effects.includes('blur')) initVars.filter = 'blur(6px)';
            gsap.set(currentTargets, initVars);

            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: 'top 85%', end: `bottom ${scrollEnd}%`, scrub: true },
            }).fromTo(currentTargets, opFrom, { ...opTo, duration: itemDur, stagger: { each: 0.3 } });
            if (tl.scrollTrigger) currentSTs.push(tl.scrollTrigger);

            if (effects.includes('blur')) {
              const staggerRange = Math.min(60, sharpness * 5);
              const perItem = currentTargets.length > 1 ? staggerRange / (currentTargets.length - 1) : 0;
              currentTargets.forEach((target, i) => {
                const bStart = 85 - i * perItem;
                const bEnd   = bStart - sharpness;
                const tw = gsap.fromTo(target, { filter: 'blur(6px)' }, {
                  filter: 'blur(0px)', ease: 'none',
                  scrollTrigger: { trigger: el, start: `top ${bStart}%`, end: `top ${bEnd}%`, scrub: true },
                });
                if (tw.scrollTrigger) currentSTs.push(tw.scrollTrigger);
              });
            }
          }
          return;
        }

        // ── Inview scroll trigger (non-scrub) ───────────────────────────────────
        const scrollTrigger = inview && window.ScrollTrigger ? {
          trigger: el, start: 'top 85%',
          ...(repeat ? { toggleActions: 'play none none reset' } : { once: true }),
        } : undefined;

        el.style.opacity = '1';
        const splitType = perChar ? 'chars' : perWord ? 'words' : 'lines';
        const splitArg  = perChar ? 'chars,words' : splitType;
        currentSplit    = new SplitText(el, { type: splitArg });
        currentTargets  = currentSplit[splitType];

        if (effects.includes('rotate')) el.style.perspective = '400px';

        // Clip wrap for slide
        if (effects.includes('slide') && clip) {
          currentTargets.forEach(t => {
            const wrap = document.createElement('span');
            wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom';
            t.parentNode.insertBefore(wrap, t);
            wrap.appendChild(t);
            currentWrappers.push(wrap);
          });
        }

        // ── Typewriter ──────────────────────────────────────────────────────────
        if (effects.includes('typewriter')) {
          gsap.set(currentTargets, { opacity: 0 });
          gsap.to(currentTargets, {
            opacity: 1, duration: 0,
            stagger: { each: stagger, from: 'start' },
            delay, scrollTrigger,
          });
          return;
        }

        // ── Composable effects ──────────────────────────────────────────────────
        const fromVars = {};
        const toVars   = {};
        if (effects.includes('fade'))   { fromVars.opacity = 0;                 toVars.opacity = 1; }
        if (effects.includes('blur'))   { fromVars.filter = 'blur(8px)';        toVars.filter = 'blur(0px)'; }
        if (effects.includes('rotate')) {
          fromVars.rotationX = 90; fromVars.transformOrigin = '50% 50% -20px';
          toVars.rotationX = 0;
        }
        if (effects.includes('slide')) {
          const sv = slideVars(distance);
          Object.assign(fromVars, sv);
          if ('y' in sv) toVars.y = 0;
          if ('x' in sv) toVars.x = 0;
        }
        if (!Object.keys(fromVars).length) return;

        const staggerVal = stagger > 0 ? { each: stagger } : 0;
        gsap.fromTo(currentTargets, fromVars, { ...toVars, duration, ease, delay, stagger: staggerVal, scrollTrigger });
      }

      // Run the animation on page load
      run();

      // ── Resize handling ───────────────────────────────────────────────────────
      // SplitText captures line breaks at split time; text reflows on resize but
      // wrappers don't update. We observe the element width and re-split on change.
      const shouldReanimate = scroll || (inview && repeat);
      let prevWidth = null;
      let resizeTimer;

      const observer = new ResizeObserver(entries => {
        const w = Math.round(entries[0]?.contentRect.width ?? 0);
        if (prevWidth === null) { prevWidth = w; return; } // skip initial measurement
        if (w === prevWidth) return;
        prevWidth = w;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (shouldReanimate) {
            run();
            if (scroll && window.ScrollTrigger) ScrollTrigger.refresh();
          } else {
            cleanup(); // revert split — text reflows at full opacity, no re-animation
          }
        }, 200);
      });
      observer.observe(el);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_TEXT_ANIMATION);
  } else {
    window.BLX_TEXT_ANIMATION();
  }

  // Late-loading images (especially lazy/CMS images) shift layout after ScrollTrigger
  // has measured trigger positions, leaving scroll animations firing at the wrong point —
  // typically stuck fully revealed. Debounce-refresh on window.load and whenever any
  // image finishes loading.
  if (window.ScrollTrigger) {
    let refreshTimer;
    const refresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('load', refresh);
    // 'load' doesn't bubble, so listen in the capture phase to catch every <img>
    document.addEventListener('load', e => {
      if (e.target && e.target.tagName === 'IMG') refresh();
    }, true);
  }
})();
