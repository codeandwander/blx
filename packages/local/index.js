// BLX Local
// Version: 1.2.0

(() => {

  // Reusable function — exposed globally
  window.BLX_LOCAL = function () {
    initTime();
    initLocation();
    initConvert();
  };

  // Live clock — set from the visitor's own device, so no network request is needed
  function initTime() {
    const blocks = document.querySelectorAll('[blx-el="local-time"]');
    if (!blocks.length) return;

    const PARTS = ['hours', 'min', 'sec'];

    const tick = () => {
      const now = new Date();
      const values = {
        hours: String(now.getHours()).padStart(2, '0'),
        min: String(now.getMinutes()).padStart(2, '0'),
        sec: String(now.getSeconds()).padStart(2, '0'),
      };

      blocks.forEach(block => {
        const prop = block.getAttribute('blx-prop');
        const requested = prop ? prop.trim().split(/\s+/) : PARTS;
        const parts = PARTS.filter(part => requested.includes(part));

        block.textContent = (parts.length ? parts : PARTS)
          .map(part => values[part])
          .join(':');
      });
    };

    tick();
    setInterval(tick, 1000);
  }

  // Country — read from Cloudflare's trace endpoint, which every Webflow-hosted
  // site is proxied through. Only a country code is available this way (city
  // requires a Cloudflare Worker), so this package deliberately shows country only.
  function initLocation() {
    const blocks = document.querySelectorAll('[blx-el="local-location"]');
    if (!blocks.length) return;

    fetch('/cdn-cgi/trace')
      .then(res => res.text())
      .then(text => {
        const match = text.match(/^loc=([A-Z]{2})$/m);
        if (!match) return;

        const code = match[1];
        let country = code;
        try {
          country = new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
        } catch (e) {
          // Intl.DisplayNames unsupported — fall back to the raw country code
        }

        blocks.forEach(block => {
          const countryEl = block.querySelector('[blx-prop="country"]');
          (countryEl || block).textContent = country;
        });
      })
      .catch(() => {
        // Site isn't proxied through Cloudflare, or the request failed — leave markup untouched
      });
  }

  // Event time conversion — reads a fixed date/time from the element's own
  // text (e.g. a Webflow CMS-bound Date field) and renders it in the
  // visitor's local time zone. The source is assumed to be GMT unless
  // overridden with blx-tz (e.g. blx-tz="EST").
  function initConvert() {
    const blocks = document.querySelectorAll('[blx-el="local-convert"]');
    if (!blocks.length) return;

    blocks.forEach(block => {
      const raw = block.textContent.trim();
      if (!raw) return;

      const tz = block.getAttribute('blx-tz') || 'GMT';
      const date = new Date(`${raw} ${tz}`);
      if (Number.isNaN(date.getTime())) return;

      const prop = block.getAttribute('blx-prop');
      let options;

      if (prop === 'date') {
        options = { year: 'numeric', month: 'long', day: 'numeric' };
      } else if (prop === 'time') {
        options = { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
      } else {
        options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        };
      }

      block.textContent = new Intl.DateTimeFormat(undefined, options).format(date);
    });
  }

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_LOCAL);
  } else {
    window.BLX_LOCAL();
  }

})();
