// packages/index.js
// BLX Global Loader
// Version: 1.0.4

window.BLX = window.BLX || {};
window.BLX.utils = window.BLX.utils || {};

// Bundled imports (important)
import { BLX_TOC } from './toc/index.js';
import './inline-svg/index.js';

function init() {
  // TOC
  if (document.querySelector('[blx-el="toc"]')) {
    BLX_TOC();
  }

  // Inline SVG
  if (document.querySelector('[blx-el="inline-svg"]')) {
    window.BLX?.inlineSVG?.();
  }

  // Future packages here
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
