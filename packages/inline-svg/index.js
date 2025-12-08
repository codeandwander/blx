// BLX Inline SVG
// Version: 1.0.6

(() => {
  window.BLX = window.BLX || {};

  window.BLX.inlineSVG = function () {
    const targets = document.querySelectorAll('[blx-el="inline-svg"]');
    if (!targets.length) return;

    const cache = {};

    targets.forEach(img => {
      const src = img.getAttribute('src');
      if (!src || !src.endsWith('.svg')) return;

      const mode = img.getAttribute('blx-prop'); // "fill" | "stroke" | null

      if (cache[src]) {
        replaceImg(img, cache[src].cloneNode(true));
        return;
      }

      fetch(src)
        .then(res => res.text())
        .then(svgText => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgEl = svgDoc.querySelector('svg');
          if (!svgEl) return;

          // Let CSS control sizing
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');

          // --- CLEAN COLOURS, PRESERVE INTENT ---

          // Remove hard-coded fills, but keep fill="none"
          svgEl.querySelectorAll('[fill]').forEach(el => {
            if (el.getAttribute('fill') !== 'none') {
              el.removeAttribute('fill');
            }
          });

          // Remove hard-coded strokes
          svgEl.querySelectorAll('[stroke]').forEach(el => {
            el.removeAttribute('stroke');
          });

          // Apply optional override
          if (mode === 'stroke') {
            svgEl.setAttribute('stroke', 'currentColor');
          } else if (mode === 'fill') {
            svgEl.setAttribute('fill', 'currentColor');
          }
          // no mode → preserve original fill / stroke behaviour

          cache[src] = svgEl;
          replaceImg(img, svgEl.cloneNode(true));
        })
        .catch(err =>
          console.error('BLX inlineSVG error:', err)
        );
    });

    function replaceImg(img, svg) {
      // Preserve ID + classes
      if (img.id) svg.id = img.id;
      if (img.className) svg.setAttribute('class', img.className);

      // Preserve alt (SVGs can’t have true alt)
      const alt = img.getAttribute('alt');
      if (alt) svg.setAttribute('data-alt', alt);

      img.replaceWith(svg);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.BLX.inlineSVG();
  });
})();
