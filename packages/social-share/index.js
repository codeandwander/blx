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
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${title}`,
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
      target.setAttribute("target", "_blank");
      target.setAttribute("rel", "noopener noreferrer");
    });
  }

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_SOCIAL_SHARE);
  } else {
    window.BLX_SOCIAL_SHARE();
  }

})();
