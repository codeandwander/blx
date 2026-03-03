// BLX Modal
// Version: 1.1.0

(() => {

  // Reusable function — exposed globally
  window.BLX_MODAL = function () {

    if (!window.BLX || !window.BLX.utils || !window.BLX.utils.breakpoints) {
      console.warn('[BLX_MODAL] BLX utils.breakpoints not found');
      return;
    }

    const { breakpoints } = window.BLX.utils;

    const OPEN_CLASS     = 'is-open';
    const ENTERING_CLASS = 'is-entering';
    const LEAVING_CLASS  = 'is-leaving';
    const LOCK_CLASS     = 'blx-scroll-lock';

    /* -------------------------
       HELPERS
    -------------------------- */

    function getProps(el) {
      return (el?.getAttribute('blx-prop') || '')
        .split(',')
        .map(p => p.trim().toLowerCase())
        .filter(Boolean);
    }

    // Overlay rules:
    // - no prop → overlay everywhere
    // - tablet → overlay on tablet + mobile
    // - mobile → overlay on mobile only
    function overlayAllowed(props) {
      if (!props.length) return true;

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

    function getFocusableElements(container) {
      return Array.from(
        container.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled'));
    }

    // Calls callback immediately if no CSS animation/transition is detected,
    // otherwise waits for the first animationend or transitionend event.
    // A timeout fallback ensures the callback always fires even if events are missed.
    function waitForAnimation(el, callback) {
      const style = getComputedStyle(el);

      // CSS allows multiple comma-separated durations; use the longest
      function maxDuration(str) {
        return Math.max(0, ...(str || '').split(',').map(s => parseFloat(s) || 0));
      }

      const animDuration  = maxDuration(style.animationDuration);
      const transDuration = maxDuration(style.transitionDuration);

      if (!animDuration && !transDuration) {
        callback();
        return;
      }

      let called = false;
      function done() {
        if (called) return;
        called = true;
        callback();
      }

      if (animDuration)  el.addEventListener('animationend',  done, { once: true });
      if (transDuration) el.addEventListener('transitionend', done, { once: true });

      // Fallback: fire after the longest declared duration in case events don't fire
      const maxMs = Math.max(animDuration, transDuration) * 1000 + 50;
      setTimeout(done, maxMs);
    }

    /* -------------------------
       ELEMENTS
    -------------------------- */

    const triggers = document.querySelectorAll('[blx-el="modal-trigger"]');
    const modals   = document.querySelectorAll('[blx-el="modal-popup"]');

    /* -------------------------
       STORE ORIGINAL POSITIONS
    -------------------------- */

    const originalPosition = new WeakMap();

    modals.forEach((modal, i) => {
      if (!modal.id) {
        modal.id = `blx-modal-${i + 1}`;
      }

      originalPosition.set(modal, {
        parent: modal.parentElement,
        next: modal.nextElementSibling
      });

      // Default hidden for a11y
      modal.setAttribute('aria-hidden', 'true');
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
        return document.querySelector(
          `[blx-el="modal-popup"][blx-id="${id}"]`
        );
      }

      // 3. next modal in DOM
      let next = trigger.nextElementSibling;
      while (next) {
        if (next.matches('[blx-el="modal-popup"]')) return next;
        next = next.nextElementSibling;
      }

      return null;
    }

    /* -------------------------
       FOCUS TRAP STATE
    -------------------------- */

    let lastFocusedElement = null;
    let activeTrapHandler = null;

    /* -------------------------
       OPEN (overlay only)
    -------------------------- */

    triggers.forEach(trigger => {
      const modal = findModal(trigger);
      if (!modal) return;

      trigger.setAttribute('aria-controls', modal.id);
      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', () => {
        const props = getProps(trigger);

        // Overlay not allowed → noop (desktop inline layout)
        if (!overlayAllowed(props)) return;

        // Portal on demand
        if (modal.parentElement !== document.body) {
          document.body.appendChild(modal);
        }

        /* ---- Dialog semantics (overlay only) ---- */
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'false');

        modal.classList.add(OPEN_CLASS);
        modal.classList.add(ENTERING_CLASS);
        trigger.setAttribute('aria-expanded', 'true');

        // Wait for enter animation/transition, then remove entering class
        requestAnimationFrame(() => {
          waitForAnimation(modal, () => {
            modal.classList.remove(ENTERING_CLASS);
          });
        });

        if (props.includes('scroll-lock')) {
          lockScroll();
        }

        /* ---- Focus trap ---- */

        lastFocusedElement = trigger;

        const focusable = getFocusableElements(modal);
        if (focusable.length) {
          focusable[0].focus();
        }

        activeTrapHandler = (e) => {
          if (e.key !== 'Tab') return;

          const elements = getFocusableElements(modal);
          if (!elements.length) return;

          const first = elements[0];
          const last  = elements[elements.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        };

        document.addEventListener('keydown', activeTrapHandler);
      });
    });

    /* -------------------------
       CLOSE
    -------------------------- */

    function closeModal(modal) {
      // Cancel any in-progress enter animation
      modal.classList.remove(ENTERING_CLASS);
      modal.classList.add(LEAVING_CLASS);

      // Wait for leave animation/transition before tearing down
      requestAnimationFrame(() => {
        waitForAnimation(modal, () => {
          modal.classList.remove(OPEN_CLASS);
          modal.classList.remove(LEAVING_CLASS);
          unlockScroll();

          /* ---- Remove dialog semantics ---- */
          modal.removeAttribute('role');
          modal.removeAttribute('aria-modal');
          modal.setAttribute('aria-hidden', 'true');

          /* ---- Remove focus trap ---- */
          if (activeTrapHandler) {
            document.removeEventListener('keydown', activeTrapHandler);
            activeTrapHandler = null;
          }

          /* ---- Restore focus ---- */
          if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
          }

          /* ---- Restore original DOM position ---- */
          const pos = originalPosition.get(modal);
          if (pos?.parent) {
            pos.parent.insertBefore(modal, pos.next || null);
          }

          document
            .querySelectorAll(`[aria-controls="${modal.id}"]`)
            .forEach(t => t.setAttribute('aria-expanded', 'false'));
        });
      });
    }

    document.querySelectorAll('[blx-el="modal-close"]').forEach(closeEl => {
      closeEl.addEventListener('click', () => {
        const modal = closeEl.closest('[blx-el="modal-popup"]');
        if (!modal) return;
        closeModal(modal);
      });
    });

    /* -------------------------
       ESC KEY (overlay only)
    -------------------------- */

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;

      const modal = document.querySelector(
        '[blx-el="modal-popup"].' + OPEN_CLASS
      );
      if (!modal) return;

      closeModal(modal);
    });

    /* -------------------------
       CLOSE WHEN LEAVING OVERLAY
    -------------------------- */

    function closeIfOverlayNoLongerAllowed() {
      const modal = document.querySelector(
        '[blx-el="modal-popup"].' + OPEN_CLASS
      );
      if (!modal) return;

      const trigger = document.querySelector(
        `[aria-controls="${modal.id}"]`
      );
      if (!trigger) return;

      const props = getProps(trigger);
      if (!overlayAllowed(props)) {
        closeModal(modal);
      }
    }

    breakpoints.on('tablet', closeIfOverlayNoLongerAllowed);
    breakpoints.on('mobile', closeIfOverlayNoLongerAllowed);
  };

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_MODAL);
  } else {
    window.BLX_MODAL();
  }

})();
