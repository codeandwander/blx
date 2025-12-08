// packages/modal/index.js
// BLX Modal
// v1.0.4

(() => {

  window.BLX_MODAL = function () {

    if (!window.BLX || !window.BLX.utils || !window.BLX.utils.breakpoints) {
      console.warn('[BLX_MODAL] BLX utils.breakpoints not found');
      return;
    }

    const { breakpoints } = window.BLX.utils;
    const OPEN_CLASS = 'is-open';
    const LOCK_CLASS = 'blx-scroll-lock';

    /* -------------------------
       HELPERS
    -------------------------- */

    function getProps(el) {
      return (el?.getAttribute('blx-prop') || '')
        .split(',')
        .map(p => p.trim().toLowerCase())
        .filter(Boolean);
    }

    function breakpointAllows(props) {
      if (props.includes('mobile')) return breakpoints.is('mobile');
      if (props.includes('tablet')) return breakpoints.is('tablet');
      return true;
    }

    function lockScroll() {
      document.documentElement.classList.add(LOCK_CLASS);
      document.documentElement.style.overflow = 'hidden';
    }

    function unlockScroll() {
      document.documentElement.classList.remove(LOCK_CLASS);
      document.documentElement.style.overflow = '';
    }

    /* -------------------------
       ELEMENTS
    -------------------------- */

    const triggers = document.querySelectorAll('[blx-el="modal-trigger"]');
    const modals   = document.querySelectorAll('[blx-el="modal-popup"]');

    /* -------------------------
       MOVE MODALS TO BODY
       + IDS
    -------------------------- */

    modals.forEach((modal, i) => {
      if (!modal.id) modal.id = `blx-modal-${i + 1}`;
      document.body.appendChild(modal);
    });

    /* -------------------------
       PAIRING
    -------------------------- */

    function findModal(trigger) {
      // 1. modal-group
      const group = trigger.closest('[blx-el="modal-group"]');
      if (group) {
        return group.querySelector('[blx-el="modal-popup"]');
      }

      // 2. blx-id
      const id = trigger.getAttribute('blx-id');
      if (id) {
        return document.querySelector(`[blx-el="modal-popup"][blx-id="${id}"]`);
      }

      // 3. next in DOM
      let next = trigger.nextElementSibling;
      while (next) {
        if (next.matches('[blx-el="modal-popup"]')) return next;
        next = next.nextElementSibling;
      }

      return null;
    }

    /* -------------------------
       OPEN
    -------------------------- */

    triggers.forEach(trigger => {
      const modal = findModal(trigger);
      if (!modal) return;

      trigger.setAttribute('aria-controls', modal.id);
      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', () => {
        const props = getProps(trigger);
        if (!breakpointAllows(props)) return;

        modal.classList.add(OPEN_CLASS);
        trigger.setAttribute('aria-expanded', 'true');

        if (props.includes('scroll-lock')) {
          lockScroll();
        }
      });
    });

    /* -------------------------
       CLOSE
    -------------------------- */

    document.querySelectorAll('[blx-el="modal-close"]').forEach(closeEl => {
      closeEl.addEventListener('click', () => {
        const modal = closeEl.closest('[blx-el="modal-popup"]');
        if (!modal) return;

        modal.classList.remove(OPEN_CLASS);

        document
          .querySelectorAll(`[aria-controls="${modal.id}"]`)
          .forEach(t => t.setAttribute('aria-expanded', 'false'));

        unlockScroll();
      });
    });

    /* -------------------------
       ESC
    -------------------------- */

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;

      const modal = document.querySelector('[blx-el="modal-popup"].is-open');
      if (!modal) return;

      modal.classList.remove(OPEN_CLASS);
      unlockScroll();

      document
        .querySelectorAll(`[aria-controls="${modal.id}"]`)
        .forEach(t => t.setAttribute('aria-expanded', 'false'));
    });
  };

})();
