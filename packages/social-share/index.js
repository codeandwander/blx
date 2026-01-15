// BLX Social Share
// Version: 1.0.0

(() => {

  // Reusable function — exposed globally
  window.BLX_SOCIAL_SHARE = function () {
    const elements = document.querySelectorAll('[blx-el="social-share"]');
    if (!elements.length) return;

    elements.forEach(initSocialShare);
  };

  function initSocialShare(el) {
    const pageUrl = encodeURIComponent(
      el.dataset.shareUrl || window.location.href
    );

    const title = encodeURIComponent(
      el.dataset.shareTitle || document.title
    );

    const description = encodeURIComponent(
      el.dataset.shareDesc || ""
    );

    const shareMap = {
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${title}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${pageUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      email: `mailto:?subject=${title}&body=${description}%0A${pageUrl}`,
    };

    const targets =
      el.tagName === "A"
        ? [el]
        : Array.from(el.querySelectorAll("[blx-prop]"));

    targets.forEach(target => {
      const prop = target.getAttribute("blx-prop");
      if (!prop || !shareMap[prop]) return;

      target.href = shareMap[prop];
      target.setAttribute("rel", "noopener noreferrer");
      
      // Open share links in popup window instead of new tab (except email)
      if (prop !== 'email') {
        target.addEventListener('click', function(e) {
          e.preventDefault();
          const width = 600;
          const height = 600;
          const left = (window.screen.width - width) / 2;
          const top = (window.screen.height - height) / 2;
          window.open(
            this.href,
            `share-${prop}`,
            `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
          );
        });
      }
    });
  }

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_SOCIAL_SHARE);
  } else {
    window.BLX_SOCIAL_SHARE();
  }

})();
