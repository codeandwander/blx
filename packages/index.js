// BLX Global Loader
// Version: 1.0.3

import { BLX_TOC } from './toc/index.js';
import './inline-svg/index.js';
// future imports:
// import { BLX_SLIDER } from './slider/index.js';
// import { BLX_ACCORDION } from './accordion/index.js';

document.addEventListener('DOMContentLoaded', () => {

// TOC
if (document.querySelector('[blx-el="toc"]')) {
  BLX_TOC();
}

// Inline SVG
if (document.querySelector('[blx-el="inline-svg"]')) {
window.BLX?.inlineSVG?.();
}

// SLIDER (example)
// if (document.querySelector('[blx-el="slider"]')) {
//   BLX_SLIDER();
// }

// ACCORDION (example)
// if (document.querySelector('[blx-el="accordion"]')) {
//   BLX_ACCORDION();
// }
});
