// BLX Accordion
// Version: 1.0.0

(() => {

  // Configuration
  const ACCORDION_BREAKPOINT = 768; // px — start-open only applies at or above this width

  // Reusable function — exposed globally
  window.BLX_ACCORDION = function () {
    const accordions = document.querySelectorAll('[blx-el="accordion"]');
    if (!accordions.length) return;

    accordions.forEach(initAccordion);
  };

  function initAccordion(accordion) {
    const head = accordion.querySelector('[blx-el="accordion-head"]');
    const body = accordion.querySelector('[blx-el="accordion-body"]');
    if (!head || !body) return;

    const startOpen =
      accordion.getAttribute('blx-prop') === 'start-open' &&
      window.innerWidth >= ACCORDION_BREAKPOINT;

    body.style.overflow = 'hidden';
    body.style.height = startOpen ? 'auto' : '0px';
    if (startOpen) accordion.classList.add('is-open');

    head.addEventListener('click', () => toggle(accordion, body));
  }

  function toggle(accordion, body) {
    const isOpen = accordion.classList.contains('is-open');
    const group = accordion.closest('[blx-el="accordion-group"]');
    const singleOpen = group?.getAttribute('blx-prop') === 'single-open';

    if (singleOpen && !isOpen) {
      group.querySelectorAll('[blx-el="accordion"]').forEach((sibling) => {
        if (sibling !== accordion && sibling.classList.contains('is-open')) {
          close(sibling, sibling.querySelector('[blx-el="accordion-body"]'));
        }
      });
    }

    isOpen ? close(accordion, body) : open(accordion, body);
  }

  function open(accordion, body) {
    accordion.classList.add('is-open');
    body.style.height = body.scrollHeight + 'px';
    body.addEventListener(
      'transitionend',
      () => {
        body.style.height = 'auto';
      },
      { once: true },
    );
  }

  function close(accordion, body) {
    accordion.classList.remove('is-open');
    body.style.height = body.scrollHeight + 'px';
    requestAnimationFrame(() => {
      body.style.height = '0px';
    });
  }

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_ACCORDION);
  } else {
    window.BLX_ACCORDION();
  }

})();
