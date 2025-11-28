// BLX TOC
// Version: 1.0.1

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

      // Keep a master template clone we can clone from
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

      if (!headings.length) return;

      let lastH2Item = null;

      headings.forEach((heading, index) => {

        // Assign ID if missing, ensuring uniqueness
        if (!heading.id) {
          let slug = heading.textContent
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || `section-${index + 1}`;

          // Ensure ID is unique on the page
          let uniqueSlug = slug;
          let counter = 2;
          while (document.getElementById(uniqueSlug)) {
            uniqueSlug = `${slug}-${counter++}`;
          }

          heading.id = uniqueSlug;
        }

        // Build TOC item from template
        const item = templateClone.cloneNode(true);

        // Find or create a link
        let link = item.querySelector('a');
        if (!link) {
          link = document.createElement('a');
          item.appendChild(link);
        }

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
          // h3: nest under last h2 if available, else top-level
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

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_TOC);
  } else {
    window.BLX_TOC();
  }

})();
