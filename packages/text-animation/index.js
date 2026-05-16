// BLX Text Animation
// Version: 2.0.0
// Requires: GSAP, SplitText (for text), ScrollTrigger, ScrambleTextPlugin (optional)
//
// Breaking changes from v1.x:
// - blx-anim now accepts space-separated effects: blx-anim="fade slide"
// - Add per-char or per-word to blx-prop to enable text (SplitText) mode
// - Without per-char/per-word, element is animated directly (no SplitText)
// - Direction is now a flag in blx-prop: up, down, left, right (replaces y=)
// - distance= replaces y= in blx-prop

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

      // Parse blx-prop into flags and key=value options
      const rawProps = (el.getAttribute('blx-prop') || '').split(',').map(s => s.trim()).filter(Boolean);
      const flags = rawProps.filter(p => !p.includes('=')).map(p => p.toLowerCase());
      const opts  = Object.fromEntries(
        rawProps.filter(p => p.includes('=')).map(p => {
          const eq = p.indexOf('=');
          return [p.slice(0, eq).trim().toLowerCase(), p.slice(eq + 1).trim()];
        })
      );

      const ease     = opts.ease || 'power2.out';
      const distance = parseFloat(opts.distance) || 40;
      const inview   = flags.includes('inview');
      const repeat   = flags.includes('repeat');
      const clip     = flags.includes('clip');
      const perChar  = flags.includes('per-char');
      const perWord  = flags.includes('per-word');

      const direction = flags.find(f => ['up', 'down', 'left', 'right'].includes(f)) || 'up';

      function slideVars(dist) {
        switch (direction) {
          case 'down':  return { y: -dist };
          case 'left':  return { x:  dist };
          case 'right': return { x: -dist };
          default:      return { y:  dist };
        }
      }

      const scrollTrigger = inview && window.ScrollTrigger ? {
        trigger: el,
        start: 'top 85%',
        ...(repeat ? { toggleActions: 'play none none reset' } : { once: true }),
      } : undefined;

      // ── Scramble (no SplitText needed) ──────────────────────────────────────
      if (effects.includes('scramble')) {
        if (!window.ScrambleTextPlugin) {
          console.warn('[BLX_TEXT_ANIMATION] ScrambleTextPlugin not found for "scramble" effect.');
          return;
        }
        const text = el.textContent.trim();
        el.style.opacity = '1';
        gsap.to(el, {
          duration, ease, delay,
          scrambleText: { text, chars: 'upperCase', speed: 0.4 },
          scrollTrigger,
        });
        return;
      }

      // ── Element animation (no per-char / per-word) ───────────────────────────
      if (!perChar && !perWord) {
        el.style.opacity = '1';
        const fromVars = {};
        if (effects.includes('fade'))  fromVars.opacity = 0;
        if (effects.includes('scale')) fromVars.scale = 0.85;
        if (effects.includes('slide')) Object.assign(fromVars, slideVars(distance));

        if (!Object.keys(fromVars).length) {
          console.warn(`[BLX_TEXT_ANIMATION] No recognised effects for element animation: "${effects.join(' ')}". Add per-char or per-word for text animation.`);
          return;
        }

        const staggerVal = stagger > 0 ? { each: stagger } : 0;
        gsap.from(el, { ...fromVars, duration, ease, delay, stagger: staggerVal, scrollTrigger });
        return;
      }

      // ── Text animation (per-char or per-word) ────────────────────────────────
      if (!window.SplitText) {
        console.warn('[BLX_TEXT_ANIMATION] SplitText not found for text animation.');
        return;
      }

      el.style.opacity = '1';
      const type    = perWord ? 'words' : 'chars';
      const split   = new SplitText(el, { type });
      const targets = perWord ? split.words : split.chars;

      if (effects.includes('rotate')) el.style.perspective = '400px';

      // Clip wrap for slide effects
      const wrappers = [];
      if (effects.includes('slide') && clip) {
        targets.forEach(t => {
          const wrap = document.createElement('span');
          wrap.style.display = 'inline-block';
          wrap.style.overflow = 'hidden';
          wrap.style.verticalAlign = 'bottom';
          t.parentNode.insertBefore(wrap, t);
          wrap.appendChild(t);
          wrappers.push(wrap);
        });
      }

      // ── Typewriter ───────────────────────────────────────────────────────────
      if (effects.includes('typewriter')) {
        gsap.set(targets, { opacity: 0 });
        gsap.to(targets, {
          opacity: 1, duration: 0,
          stagger: { each: stagger, from: 'start' },
          delay, scrollTrigger,
        });
        return;
      }

      // ── Composable text effects ───────────────────────────────────────────────
      const staggerMode = opts['stagger-mode'] === 'amount' ? 'amount' : 'each';
      const staggerVal  = stagger > 0 ? { [staggerMode]: stagger } : 0;
      const fromVars    = { stagger: staggerVal };

      if (effects.includes('fade'))   fromVars.opacity = 0;
      if (effects.includes('blur'))   fromVars.filter = 'blur(8px)';
      if (effects.includes('rotate')) Object.assign(fromVars, { rotationX: 90, transformOrigin: '50% 50% -20px' });
      if (effects.includes('slide'))  Object.assign(fromVars, slideVars(distance));

      gsap.from(targets, { duration, ease, delay, scrollTrigger, ...fromVars });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_TEXT_ANIMATION);
  } else {
    window.BLX_TEXT_ANIMATION();
  }
})();
