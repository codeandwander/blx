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
      const props    = (el.getAttribute('blx-prop') || '').split(',').map(s => s.trim()).filter(Boolean);
      const duration = (parseFloat(el.getAttribute('blx-duration')) || 800) / 1000;
      const ease     = el.getAttribute('blx-easing') || 'power2.out';
      const delay    = (parseFloat(el.getAttribute('blx-delay')) || 0) / 1000;
      const stagger  = (parseFloat(el.getAttribute('blx-stagger')) || 30) / 1000;
      const inview   = props.includes('inview');
      const repeat   = props.includes('repeat');

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

      const split = new SplitText(el, { type: 'chars' });

      if (effect === 'rotate') {
        el.style.perspective = '400px';
      }

      // clip: wrap each char in an overflow:hidden span so slide reveals from below
      const wrappers = [];
      if (effect === 'slide' && props.includes('clip')) {
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

      const effectVars = {
        fade:       { stagger, opacity: 0 },
        blur:       { stagger, opacity: 0, filter: 'blur(8px)' },
        slide:      { stagger, opacity: 0, y: '105%' },
        typewriter: { stagger: { each: stagger, from: 'start' }, opacity: 0 },
        rotate:     { stagger, opacity: 0, rotationX: 90, transformOrigin: '50% 50% -20px' },
      }[effect];

      if (!effectVars) {
        console.warn(`[BLX_TEXT_ANIMATION] Unknown effect: "${effect}". Options: fade, blur, slide, typewriter, rotate, scramble.`);
        return;
      }

      gsap.from(split.chars, { duration, ease, delay, scrollTrigger, ...effectVars });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_TEXT_ANIMATION);
  } else {
    window.BLX_TEXT_ANIMATION();
  }
})();
