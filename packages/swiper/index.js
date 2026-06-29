// BLX Swiper
// Version: 1.0.0

(() => {

  // Reusable function — exposed globally
  window.BLX_SWIPER = function () {
    const swipers = document.querySelectorAll('[blx-el="swiper"]');
    if (!swipers.length) return;

    if (typeof Swiper === 'undefined') {
      console.warn('[BLX Swiper] Swiper library not found — load Swiper before this script.');
      return;
    }

    swipers.forEach(initSwiper);
  };

  function initSwiper(el) {
    const root = el.querySelector('.swiper');
    if (!root) return;

    const config = {
      loop: bool(el, 'loop'),
      rewind: bool(el, 'rewind'),
      direction: str(el, 'direction', 'horizontal'),
      speed: int(el, 'speed', 300),
      initialSlide: int(el, 'initial-slide', 0),
      effect: str(el, 'effect', 'slide'),
      grabCursor: bool(el, 'grab-cursor'),
      centeredSlides: bool(el, 'centered-slides'),
      spaceBetween: int(el, 'space-between', 20),

      // Let Swiper's own A11y module run. Only slideRole is exposed so CMS
      // collections (Webflow renders these as role="list" / "listitem") can
      // keep their semantics instead of being overwritten with the default.
      a11y: {
        enabled: true,
        slideRole: str(el, 'slide-role', 'group'),
      },

      breakpoints: {
        0: {
          slidesPerView: int(el, 'mobile-slides-per-view', 1),
          spaceBetween: int(el, 'mobile-space-between', 10),
        },
        767: {
          slidesPerView: int(el, 'tablet-slides-per-view', 2),
          spaceBetween: int(el, 'tablet-space-between', 15),
        },
        988: {
          slidesPerView: int(el, 'desktop-slides-per-view', 3),
          spaceBetween: int(el, 'desktop-space-between', 20),
        },
      },
    };

    // Autoplay
    if (bool(el, 'autoplay')) {
      config.autoplay = {
        delay: int(el, 'autoplay-delay', 3000),
        disableOnInteraction: bool(el, 'autoplay-disable-on-interaction'),
      };
    }

    // Pagination — only wire up if the target element actually exists
    if (bool(el, 'pagination')) {
      const paginationEl = byClass(el, str(el, 'pagination-el', ''));
      if (paginationEl) {
        config.pagination = {
          el: paginationEl,
          clickable: bool(el, 'pagination-clickable'),
          type: str(el, 'pagination-type', 'bullets'),
          dynamicBullets: bool(el, 'pagination-dynamic-bullets'),
          bulletClass: str(el, 'pagination-bullet-class', 'swiper_bullet'),
          bulletActiveClass: str(el, 'pagination-bullet-active-class', 'swiper_bullet-active'),
        };
      }
    }

    // Navigation — only wire up if both arrows exist
    const nextEl = byClass(el, str(el, 'navigation-next-el', ''));
    const prevEl = byClass(el, str(el, 'navigation-prev-el', ''));
    if (nextEl && prevEl) {
      config.navigation = {
        nextEl,
        prevEl,
        disabledClass: str(el, 'navigation-disabled-class', 'swiper_button-disabled'),
      };
    }

    // Thumbs — looked up document-wide, as the thumbs swiper is a separate element
    const thumbsClass = str(el, 'thumbs', '');
    if (thumbsClass) {
      const thumbsEl = document.querySelector(`.${thumbsClass}`);
      if (thumbsEl) config.thumbs = { swiper: thumbsEl };
    }

    new Swiper(root, config);
  }

  // Helpers — all config is read from blx-swiper-* attributes
  function str(el, name, fallback) {
    const value = el.getAttribute(`blx-swiper-${name}`);
    return value !== null && value !== '' ? value : fallback;
  }

  function bool(el, name) {
    return el.getAttribute(`blx-swiper-${name}`) === 'true';
  }

  function int(el, name, fallback) {
    const value = parseInt(el.getAttribute(`blx-swiper-${name}`), 10);
    return Number.isNaN(value) ? fallback : value;
  }

  function byClass(el, className) {
    return className ? el.querySelector(`.${className}`) : null;
  }

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_SWIPER);
  } else {
    window.BLX_SWIPER();
  }

})();
