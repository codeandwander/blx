// packages/modal/index.js
// BLX Modal 
// v.1.0.4

(() => {

  window.BLX_MODAL = function () {

    if (!window.BLX || !window.BLX.utils || !window.BLX.utils.breakpoints) {
      console.warn('[BLX_MODAL] BLX utils.breakpoints not found');
      return;
    }

    const { breakpoints } = window.BLX.utils;

    /* -------------------------
       HELPERS
    -------------------------- */

    function getProps(el) {
      return (el.getAttribute('blx-prop') || '')
        .split(',')
        .map(p => p.trim().toLowerCase())
        .filter(Boolean);
    }

    function breakpointAllows(props) {
      if (props.includes('mobile')) {
        return breakpoints.is('mobile');
      }

      if (props.includes('tablet')) {
        return breakpoints.is('tablet');
      }

      return true; // default: all breakpoints
    }

    /* -------------------------
       CACHE ELEMENTS
    -------------------------- */

    const triggers = document.querySelectorAll('[blx-el="modal-trigger"]');
    const modals   = document.querySelectorAll('[blx-el="modal-popup"]');

    /* -------------------------
       MOVE MODALS TO BODY
       + ASSIGN UNIQUE IDS
    -------------------------- */

    modals.forEach((modal, index) => {
      const id = `blx-modal-${index + 1}`;
      modal.setAttribute('id', id);

      const parentItem = modal.closest('.w-dyn-item');
      const trigger = parentItem?.querySelector('[blx-el="modal-trigger"]');

      if (trigger) {
        trigger.setAttribute('aria-controls', id);
        trigger.setAttribute('aria-expanded', 'false');
      }

      document.body.appendChild(modal);
    });

    /* -------------------------
       OPEN MODAL
    -------------------------- */

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const props = getProps(trigger);
        if (!breakpointAllows(props)) return;

        const modalId = trigger.getAttribute('aria-controls');
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });
    });

    /* -------------------------
       CLOSE MODAL (BUTTON)
    -------------------------- */

    document.querySelectorAll('[blx-el="modal-close"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('[blx-el="modal-popup"]');
        if (!modal) return;

        modal.classList.remove('is-open');

        const id = modal.getAttribute('id');
        document
          .querySelectorAll(`[aria-controls="${id}"]`)
          .forEach(t => t.setAttribute('aria-expanded', 'false'));
      });
    });

    /* -------------------------
       CLOSE MODAL (OVERLAY)
    -------------------------- */

    document.querySelectorAll('[blx-el="modal-overlay"]').forEach(overlay => {
      overlay.addEventListener('click', () => {
        const modal = overlay.closest('[blx-el="modal-popup"]');
        if (!modal) return;

        modal.classList.remove('is-open');

        const id = modal.getAttribute('id');
        document
          .querySelectorAll(`[aria-controls="${id}"]`)
          .forEach(t => t.setAttribute('aria-expanded', 'false'));
      });
    });
  };

})();
