//BLOCKS
//v1.0.4

// core/index.js
(function () {
  window.BLX = window.BLX || {};
  window.BLX.utils = window.BLX.utils || {};

  const queries = {
    tablet: window.matchMedia('(max-width: 991px)'), // <= 991px
    mobile: window.matchMedia('(max-width: 767px)')  // <= 767px
  };

  function is(name) {
    return queries[name]?.matches ?? false;
  }

  function on(name, callback) {
    const mql = queries[name];
    if (!mql || typeof callback !== 'function') return;

    // Call once immediately
    callback(mql.matches);

    // Listen for changes
    if (mql.addEventListener) {
      mql.addEventListener('change', e => callback(e.matches));
    } else if (mql.addListener) {
      // Safari fallback
      mql.addListener(e => callback(e.matches));
    }
  }

  window.BLX.utils.breakpoints = {
    is,
    on,
    queries
  };
})();
