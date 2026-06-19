// packages/index.js
// BLX Global Loader
// Version: 1.0.7

window.BLX = window.BLX || {};
window.BLX.utils = window.BLX.utils || {};

// Bundled imports
import './toc/index.js';
import './inline-svg/index.js';
import './modal/index.js';
import './social-share/index.js';
import './copy-to-clipboard/index.js';
import './mapbox/index.js';
import './accordion/index.js';

function init() {
  // TOC
  if (document.querySelector('[blx-el="toc"]')) {
    window.BLX_TOC?.();
  }

  // Inline SVG
  if (document.querySelector('[blx-el="inline-svg"]')) {
    window.BLX_INLINE_SVG?.();
  }

  // Modal
  if (document.querySelector('[blx-el="modal-trigger"]')) {
    window.BLX_MODAL?.();
  }

  // Social Share
  if (document.querySelector('[blx-el="social-share"]')) {
    window.BLX_SOCIAL_SHARE?.();
  }

  // Copy to Clipboard
  if (document.querySelector('[blx-el="copy-to-clipboard"]')) {
    window.BLX_COPY_TO_CLIPBOARD?.();
  }

  // Mapbox
  if (document.querySelector('[blx-el="mapbox"]')) {
    window.BLX_MAPBOX?.();
  }

  // Accordion
  if (document.querySelector('[blx-el="accordion"]')) {
    window.BLX_ACCORDION?.();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
