// BLX Text Animation
// Version: 2.1.0
// Requires: GSAP, SplitText (for text), ScrollTrigger, ScrambleTextPlugin (optional)
//
// Changes from v2.0.0:
// - blx-prop now supports space-separated values in addition to comma-separated
// - Added per-line split mode
// - Added scroll trigger (scrubbed) with sharpness= parameter
// - Fixed gsap.from → gsap.fromTo (only animates selected properties)
// - Blur in scroll mode uses index-offset individual ScrollTriggers (hybrid approach)

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
      const inview    = flags.includes('inview');
      const repeat    = flags.includes('repeat');
      const scroll    = flags.includes('scroll');
      const clip      = flags.includes('clip');
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

      // ── Scramble ──────────────────────────────────────────────────────────────
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

      // ── Scroll scrub mode ─────────────────────────────────────────────────────
      if (scroll && window.ScrollTrigger) {
        if (!window.SplitText) {
          console.warn('[BLX_TEXT_ANIMATION] SplitText not found for scroll animation.');
          return;
        }
        const splitType = perChar ? 'chars' : perWord ? 'words' : 'lines';
        const split     = new SplitText(el, { type: splitType });
        const targets   = split[splitType];

        const startPct = 50 + sharpness;
        const endPct   = 50;

        if (splitType === 'lines') {
          // Per-line: each line gets its own trigger based on its DOM position
          const fromVars = { opacity: 0.15 };
          const toVars   = { opacity: 1, ease: 'none' };
          if (effects.includes('blur'))  { fromVars.filter = 'blur(6px)';  toVars.filter = 'blur(0px)'; }
          if (effects.includes('slide')) {
            const sv = slideVars(distance);
            Object.assign(fromVars, sv);
            if ('y' in sv) toVars.y = 0;
            if ('x' in sv) toVars.x = 0;
          }
          gsap.set(targets, { ...fromVars });
          targets.forEach(target => {
            gsap.fromTo(target, { ...fromVars }, {
              ...toVars,
              scrollTrigger: { trigger: target, start: `top ${startPct}%`, end: `top ${endPct}%`, scrub: true },
            });
          });
        } else {
          // Per-word / per-char:
          // Opacity + slide via timeline stagger (reliable in scrubbed timelines).
          // Blur via individual index-offset triggers on the parent — filter doesn't
          // interpolate correctly in staggered scrubbed timelines.
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
          gsap.set(targets, initVars);

          gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 20%', scrub: true },
          }).fromTo(targets, opFrom, { ...opTo, duration: itemDur, stagger: { each: 0.3 } });

          if (effects.includes('blur')) {
            const staggerRange = Math.min(60, sharpness * 5);
            const perItem = targets.length > 1 ? staggerRange / (targets.length - 1) : 0;
            targets.forEach((target, i) => {
              const bStart = 85 - i * perItem;
              const bEnd   = bStart - sharpness;
              gsap.fromTo(target, { filter: 'blur(6px)' }, {
                filter: 'blur(0px)', ease: 'none',
                scrollTrigger: { trigger: el, start: `top ${bStart}%`, end: `top ${bEnd}%`, scrub: true },
              });
            });
          }
        }
        return;
      }

      // ── Inview scroll trigger (non-scrub) ─────────────────────────────────────
      const scrollTrigger = inview && window.ScrollTrigger ? {
        trigger: el, start: 'top 85%',
        ...(repeat ? { toggleActions: 'play none none reset' } : { once: true }),
      } : undefined;

      // ── Element animation (no split) ──────────────────────────────────────────
      if (!perChar && !perWord && !perLine) {
        el.style.opacity = '1';
        const fromVars = {};
        const toVars   = {};
        if (effects.includes('fade'))  { fromVars.opacity = 0;           toVars.opacity = 1; }
        if (effects.includes('blur'))  { fromVars.filter = 'blur(8px)';  toVars.filter = 'blur(0px)'; }
        if (effects.includes('scale')) { fromVars.scale = 0.85;          toVars.scale = 1; }
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
        const staggerVal = stagger > 0 ? { each: stagger } : 0;
        gsap.fromTo(el, fromVars, { ...toVars, duration, ease, delay, stagger: staggerVal, scrollTrigger });
        return;
      }

      // ── Text animation (per-char / per-word / per-line) ───────────────────────
      if (!window.SplitText) {
        console.warn('[BLX_TEXT_ANIMATION] SplitText not found for text animation.');
        return;
      }

      el.style.opacity = '1';
      const splitType = perChar ? 'chars' : perWord ? 'words' : 'lines';
      const split     = new SplitText(el, { type: splitType });
      const targets   = split[splitType];

      if (effects.includes('rotate')) el.style.perspective = '400px';

      // Clip wrap for slide
      if (effects.includes('slide') && clip) {
        targets.forEach(t => {
          const wrap = document.createElement('span');
          wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom';
          t.parentNode.insertBefore(wrap, t);
          wrap.appendChild(t);
        });
      }

      // ── Typewriter ─────────────────────────────────────────────────────────────
      if (effects.includes('typewriter')) {
        gsap.set(targets, { opacity: 0 });
        gsap.to(targets, {
          opacity: 1, duration: 0,
          stagger: { each: stagger, from: 'start' },
          delay, scrollTrigger,
        });
        return;
      }

      // ── Composable effects ──────────────────────────────────────────────────────
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
      gsap.fromTo(targets, fromVars, { ...toVars, duration, ease, delay, stagger: staggerVal, scrollTrigger });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_TEXT_ANIMATION);
  } else {
    window.BLX_TEXT_ANIMATION();
  }
})();
