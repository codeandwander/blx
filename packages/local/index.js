// BLX Local
// Version: 1.0.0

(() => {

  // Reusable function — exposed globally
  window.BLX_LOCAL = function () {
    initTime();
    initLocation();
  };

  // Live clock — set from the visitor's own device, so no network request is needed
  function initTime() {
    const blocks = document.querySelectorAll('[blx-el="local-time"]');
    if (!blocks.length) return;

    const tick = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const sec = String(now.getSeconds()).padStart(2, '0');

      blocks.forEach(block => {
        const hoursEl = block.querySelector('[blx-prop="hours"]');
        const minEl = block.querySelector('[blx-prop="min"]');
        const secEl = block.querySelector('[blx-prop="sec"]');

        if (hoursEl || minEl || secEl) {
          if (hoursEl) hoursEl.textContent = hours;
          if (minEl) minEl.textContent = min;
          if (secEl) secEl.textContent = sec;
        } else {
          block.textContent = `${hours}:${min}:${sec}`;
        }
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

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_LOCAL);
  } else {
    window.BLX_LOCAL();
  }

})();
