# BLX Copy to Clipboard

A lightweight JavaScript package that enables users to copy URLs to their clipboard with visual tooltip feedback.

## Features

- 📋 Modern Clipboard API with fallback for older browsers
- 🎨 Customizable tooltip message and styling
- ⚡ Auto-generated tooltip with smooth fade transition
- 🔧 Works with both `<button>` and `<a>` elements
- 🎯 ~2.9KB minified

## Installation

Load the script via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/copy-to-clipboard/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.8/packages/copy-to-clipboard/index.min.js"></script>
```

## Usage

### Basic Example

Copies the current page URL with default tooltip:

```html
<button blx-el="copy-to-clipboard">Copy URL</button>
```

### Custom URL

Copy a specific URL instead of the current page:

```html
<button blx-el="copy-to-clipboard" data-copy-url="https://example.com">
  Copy Link
</button>
```

### Custom Tooltip Message

Customize the tooltip text that appears on copy:

```html
<button blx-el="copy-to-clipboard" data-tooltip-text="Link copied! 🎉">
  Share
</button>
```

### Complete Example

```html
<button blx-el="copy-to-clipboard" 
        data-copy-url="https://example.com/article" 
        data-tooltip-text="Article link copied!">
  Share this article
</button>
```

## Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `blx-el="copy-to-clipboard"` | Yes | - | Enables the copy-to-clipboard functionality |
| `data-copy-url` | No | Current page URL | URL to copy to clipboard |
| `data-tooltip-text` | No | "Copied to clipboard" | Custom tooltip message |

## Customizing Tooltip Styles

### Option 1: Using CSS (Recommended)

Target the tooltip with CSS to override the default styles:

```css
[blx-prop="copy-tooltip"] {
  background: #007bff !important;
  color: #fff !important;
  padding: 8px 16px !important;
  border-radius: 8px !important;
  font-size: 16px !important;
  /* Add any custom styles */
}
```

### Option 2: Pre-styled Element in Webflow

Create a hidden div inside your button with `blx-prop="copy-tooltip"` and style it directly in Webflow Designer. The script will detect and use your existing element instead of creating a new one:

```html
<button blx-el="copy-to-clipboard">
  Copy URL
  <div blx-prop="copy-tooltip" style="display: none; /* your custom styles */">
    Copied!
  </div>
</button>
```

## Browser Support

- Modern browsers: Uses [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- Older browsers: Falls back to `document.execCommand('copy')`

## How It Works

1. When the element is clicked, the URL (from `data-copy-url` or current page) is copied to the clipboard
2. A tooltip appears above the button with the message (from `data-tooltip-text` or default)
3. The tooltip automatically fades out after 2 seconds

## Integration with Other Packages

This package follows the BLX package structure and can be used alongside other BLX packages. It's particularly useful with the Social Share package for blog articles and content pages.

## License

Part of the BLX library. See main repository for license information.
