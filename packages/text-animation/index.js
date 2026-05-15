// BLX Text Animation
// Version: 1.0.0
// Requires: GSAP, SplitText, ScrollTrigger

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
      const effect   = el.getAttribute('blx-anim');
      const duration = (parseFloat(el.getAttribute('blx-duration')) || 800) / 1000;
      const delay    = (parseFloat(el.getAttribute('blx-delay')) || 0) / 1000;
      const stagger  = (parseFloat(el.getAttribute('blx-stagger')) || 30) / 1000;

      // Parse blx-prop into flags (e.g. "inview") and key=value opts (e.g. "ease=power3.out")
      const rawProps = (el.getAttribute('blx-prop') || '').split(',').map(s => s.trim()).filter(Boolean);
      const flags = rawProps.filter(p => !p.includes('=')).map(p => p.toLowerCase());
      const opts  = Object.fromEntries(
        rawProps.filter(p => p.includes('=')).map(p => {
          const eq = p.indexOf('=');
          return [p.slice(0, eq).trim().toLowerCase(), p.slice(eq + 1).trim()];
        })
      );

      const ease      = opts.ease || 'power2.out';
      const yDistance = parseFloat(opts.y) || 40;
      const inview    = flags.includes('inview');
      const repeat    = flags.includes('repeat');
      const clip      = flags.includes('clip');

      const scrollTrigger = inview && window.ScrollTrigger ? {
        trigger: el,
        start: 'top 85%',
        ...(repeat ? { toggleActions: 'play none none reset' } : { once: true }),
      } : undefined;

      // Scramble animates text content directly — no SplitText needed
      if (effect === 'scramble') {
        if (!window.ScrambleTextPlugin) {
          console.warn('[BLX_TEXT_ANIMATION] ScrambleTextPlugin not found for "scramble" effect.');
          return;
        }
        const text = el.textContent.trim();
        el.style.opacity = '1';
        gsap.to(el, {
          duration,
          ease,
          delay,
          scrambleText: { text, chars: 'upperCase', speed: 0.4 },
          scrollTrigger,
        });
        return;
      }

      if (!window.SplitText) {
        console.warn('[BLX_TEXT_ANIMATION] SplitText not found.');
        return;
      }

      el.style.opacity = '1';
      const split = new SplitText(el, { type: 'chars' });

      if (effect === 'rotate') {
        el.style.perspective = '400px';
      }

      // clip: wrap each char in an overflow:hidden span so slide reveals from below
      const wrappers = [];
      if (effect === 'slide' && clip) {
        split.chars.forEach(char => {
          const wrap = document.createElement('span');
          wrap.style.display = 'inline-block';
          wrap.style.overflow = 'hidden';
          wrap.style.verticalAlign = 'bottom';
          char.parentNode.insertBefore(wrap, char);
          wrap.appendChild(char);
          wrappers.push(wrap);
        });
      }

      if (effect === 'typewriter') {
        gsap.set(split.chars, { opacity: 0 });
        gsap.to(split.chars, {
          opacity: 1,
          duration: 0,
          stagger: { each: stagger, from: 'start' },
          delay,
          scrollTrigger,
        });
      } else {
        const effectVars = {
          fade:   { stagger, opacity: 0 },
          blur:   { stagger, opacity: 0, filter: 'blur(8px)' },
          slide:  { stagger, opacity: 0, y: yDistance },
          rotate: { stagger, opacity: 0, rotationX: 90, transformOrigin: '50% 50% -20px' },
        }[effect];

        if (!effectVars) {
          console.warn(`[BLX_TEXT_ANIMATION] Unknown effect: "${effect}". Options: fade, blur, slide, typewriter, rotate, scramble.`);
          return;
        }

        gsap.from(split.chars, { duration, ease, delay, scrollTrigger, ...effectVars });
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_TEXT_ANIMATION);
  } else {
    window.BLX_TEXT_ANIMATION();
  }
})();
