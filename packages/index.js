// BLX Global Loader
// Version: 1.0.0

import { BLX_TOC } from './toc/index.js';
// future imports:
// import { BLX_SLIDER } from './slider/index.js';
// import { BLX_ACCORDION } from './accordion/index.js';

document.addEventListener('DOMContentLoaded', () => {

  // TOC
  if (document.querySelector('[blx-el="toc"]')) {
    BLX_TOC();
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
