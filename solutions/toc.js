// BLX TOC
// Version: 1.0.2

(() => {

  // Reusable function — exposed globally
  window.BLX_TOC = function () {
    const tocs = document.querySelectorAll('[blx-el="toc"]');
    if (!tocs.length) return;

    tocs.forEach(toc => {
      const tocId = toc.getAttribute('blx-id');
      const list = toc.querySelector('[blx-el="toc-list"]');
      const template = list?.querySelector('[blx-el="toc-item"]');

      if (!list || !template) return;

      const templateClone = template.cloneNode(true);
      list.innerHTML = '';

      // Relevant rich text blocks
      const richTexts = tocId
        ? document.querySelectorAll(`[blx-el="toc-rich-text"][blx-id="${tocId}"]`)
        : document.querySelectorAll('[blx-el="toc-rich-text"]');

      // Collect H2 + H3 in order
      const headings = [];
      richTexts.forEach(rt => {
        rt.querySelectorAll('h2, h3').forEach(h => headings.push(h));
      });

      let lastH2Item = null;

      headings.forEach((heading, index) => {

        // Assign ID if missing
        if (!heading.id) {
          const slug = heading.textContent
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          heading.id = slug || `section-${index + 1}`;
        }

        // Build TOC item
        const item = templateClone.cloneNode(true);
        const link = item.querySelector('a') || document.createElement('a');

        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();

        // Smooth scroll with header offset
        link.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === 'function') {
            e.stopImmediatePropagation();
          }

          const target = document.getElementById(heading.id);
          if (!target) return;

          const header = document.querySelector('.header, .navbar, .nav-wrapper');
          const offset = header ? header.offsetHeight : 100;
          const targetY =
            target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }, true);

        // Nesting behaviour
        if (heading.tagName.toLowerCase() === 'h2') {
          list.appendChild(item);
          lastH2Item = item;
        } else {
          if (lastH2Item) {
            let subList = lastH2Item.querySelector('ul');

            if (!subList) {
              subList = document.createElement('ul');
              subList.classList.add('toc-sublist');
              lastH2Item.appendChild(subList);
            }

            subList.appendChild(item);
          } else {
            list.appendChild(item);
          }
        }
      });
    });
  };

  // Run once on initial page load
  document.addEventListener('DOMContentLoaded', window.BLX_TOC);

})();
