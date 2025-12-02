<script>
  window.BLX = window.BLX || {};
  window.BLX.inlineSVG = function () {
    const targets = document.querySelectorAll('[blx-el="inline-svg"]');
    if (!targets.length) return;

    const cache = {};

    targets.forEach(img => {
      const src = img.getAttribute('src');
      if (!src || !src.endsWith('.svg')) return;

      if (cache[src]) {
        replaceImg(img, cache[src].cloneNode(true));
      } else {
        fetch(src)
          .then(res => res.text())
          .then(svgText => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            const svgEl = svgDoc.querySelector('svg');
            if (!svgEl) return;

            // Remove width/height so CSS controls size
            svgEl.removeAttribute('width');
            svgEl.removeAttribute('height');

            // Force colour inheritance for both fill and stroke
            svgEl.setAttribute('fill', 'currentColor');
            svgEl.setAttribute('stroke', 'currentColor');

            // Remove *all* inline fill + stroke overrides
            svgEl.querySelectorAll('[fill]').forEach(el => el.removeAttribute('fill'));
            svgEl.querySelectorAll('[stroke]').forEach(el => el.removeAttribute('stroke'));

            // Cache processed version
            cache[src] = svgEl;

            replaceImg(img, svgEl.cloneNode(true));
          })
          .catch(err => console.error("BLX inlineSVG error:", err));
      }
    });

    function replaceImg(img, svg) {
      // Keep ID + classes
      if (img.id) svg.id = img.id;
      if (img.className) svg.setAttribute('class', img.className);

      // Alt → data-alt
      const alt = img.getAttribute('alt');
      if (alt) svg.setAttribute('data-alt', alt);

      img.replaceWith(svg);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.BLX.inlineSVG();
  });
</script>
