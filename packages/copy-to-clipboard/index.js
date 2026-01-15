// BLX Copy to Clipboard
// Version: 1.0.0

(() => {

  // Reusable function — exposed globally
  window.BLX_COPY_TO_CLIPBOARD = function () {
    const elements = document.querySelectorAll('[blx-el="copy-to-clipboard"]');
    if (!elements.length) return;

    elements.forEach(initCopyToClipboard);
  };

  function initCopyToClipboard(el) {
    const urlToCopy = el.dataset.copyUrl || window.location.href;
    const tooltipText = el.dataset.tooltipText || "Copied to clipboard";

    // Handle click event
    el.addEventListener('click', function(e) {
      e.preventDefault();

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(urlToCopy).then(() => {
          showTooltip(el, tooltipText);
        }).catch(err => {
          console.error('Failed to copy to clipboard:', err);
          // Fallback to older method
          fallbackCopyToClipboard(urlToCopy, el, tooltipText);
        });
      } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(urlToCopy, el, tooltipText);
      }
    });
  }

  function fallbackCopyToClipboard(text, el, tooltipText) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showTooltip(el, tooltipText);
      }
    } catch (err) {
      console.error('Fallback: Failed to copy', err);
    }

    document.body.removeChild(textArea);
  }

  function showTooltip(el, text) {
    // Look for existing tooltip element
    let tooltip = el.querySelector('[blx-prop="tooltip"]');
    
    if (!tooltip) {
      // Create tooltip if it doesn't exist
      tooltip = document.createElement('div');
      tooltip.setAttribute('blx-prop', 'tooltip');
      tooltip.style.cssText = 'position: absolute; background: #333; color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 14px; white-space: nowrap; opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 1000; bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-8px);';
      el.style.position = 'relative';
      el.appendChild(tooltip);
    }

    // Set text and show
    tooltip.textContent = text;
    tooltip.style.opacity = '1';

    // Hide after 2 seconds
    setTimeout(() => {
      tooltip.style.opacity = '0';
    }, 2000);
  }

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_COPY_TO_CLIPBOARD);
  } else {
    window.BLX_COPY_TO_CLIPBOARD();
  }

})();
