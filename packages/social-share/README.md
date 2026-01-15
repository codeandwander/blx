# BLX Social Share

Generate share links for LinkedIn, Twitter, Facebook, and Email with popup windows for a better user experience.

## Features

- 🔗 Pre-built share URLs for major platforms
- 🪟 Opens in popup window (not new tab)
- 📧 Email sharing with subject and body
- 🎯 Customizable URL, title, and description
- 🔒 Adds `rel="noopener noreferrer"` for security
- ⚡ ~1.5KB minified

## Installation

Load the script via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/social-share/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.8/packages/social-share/index.min.js"></script>
```

## Usage

### Basic Setup - Container with Multiple Links

```html
<div blx-el="social-share">
  <a blx-prop="linkedin">Share on LinkedIn</a>
  <a blx-prop="twitter">Share on Twitter</a>
  <a blx-prop="facebook">Share on Facebook</a>
  <a blx-prop="email">Share via Email</a>
</div>
```

### Single Link

```html
<a blx-el="social-share" blx-prop="linkedin">
  Share on LinkedIn
</a>
```

### Custom Content

```html
<div blx-el="social-share" 
     data-share-url="https://example.com/article" 
     data-share-title="Check out this article!"
     data-share-desc="This is an amazing article about...">
  <a blx-prop="linkedin">LinkedIn</a>
  <a blx-prop="twitter">Twitter</a>
  <a blx-prop="facebook">Facebook</a>
  <a blx-prop="email">Email</a>
</div>
```

## Attributes

### Container Attributes

| Attribute | Applied To | Required | Default | Description |
|-----------|-----------|----------|---------|-------------|
| `blx-el="social-share"` | Container or link | Yes | - | Enables social share functionality |
| `data-share-url` | Container | No | Current page URL | URL to share |
| `data-share-title` | Container | No | Page title | Title for social posts |
| `data-share-desc` | Container | No | Empty | Description (used for email body) |

### Link Attributes

| Attribute | Applied To | Required | Values | Description |
|-----------|-----------|----------|--------|-------------|
| `blx-prop` | Link (`<a>`) | Yes | `linkedin`, `twitter`, `facebook`, `email` | Platform to share to |

## Supported Platforms

### LinkedIn
```html
<a blx-prop="linkedin">Share on LinkedIn</a>
```
- Opens LinkedIn share dialog
- Includes URL and title

### Twitter
```html
<a blx-prop="twitter">Share on Twitter</a>
```
- Opens Twitter compose dialog
- Includes title and URL

### Facebook
```html
<a blx-prop="facebook">Share on Facebook</a>
```
- Opens Facebook share dialog
- Includes URL

### Email
```html
<a blx-prop="email">Share via Email</a>
```
- Opens default email client
- Subject: title
- Body: description + URL
- **Note**: Opens directly (not in popup)

## Popup Behavior

Social share links (LinkedIn, Twitter, Facebook) open in a centered popup window:
- Size: 600×600 pixels
- Centered on screen
- No menu bar, toolbar, or status bar
- Email links open in the default email client (no popup)

## Examples

### Blog Article Share Buttons
```html
<div blx-el="social-share" 
     data-share-url="https://myblog.com/article-slug"
     data-share-title="My Amazing Blog Post"
     data-share-desc="Read about how I solved this problem...">
  
  <a blx-prop="linkedin" class="share-btn">
    <img src="linkedin-icon.svg" alt="LinkedIn">
  </a>
  
  <a blx-prop="twitter" class="share-btn">
    <img src="twitter-icon.svg" alt="Twitter">
  </a>
  
  <a blx-prop="facebook" class="share-btn">
    <img src="facebook-icon.svg" alt="Facebook">
  </a>
  
  <a blx-prop="email" class="share-btn">
    <img src="email-icon.svg" alt="Email">
  </a>
</div>
```

### Single Platform Share
```html
<!-- Just LinkedIn -->
<a blx-el="social-share" 
   blx-prop="linkedin"
   data-share-url="https://example.com"
   data-share-title="Check this out!">
  Share on LinkedIn
</a>
```

### Default (Current Page)
```html
<!-- Shares current page with its title -->
<div blx-el="social-share">
  <a blx-prop="linkedin">LinkedIn</a>
  <a blx-prop="twitter">Twitter</a>
</div>
```

## Styling

Style your share buttons with CSS as you would any links:

```css
.share-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 4px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.share-btn:hover {
  opacity: 0.8;
}

/* Platform-specific colors */
[blx-prop="linkedin"] { background: #0077b5; color: white; }
[blx-prop="twitter"] { background: #1da1f2; color: white; }
[blx-prop="facebook"] { background: #1877f2; color: white; }
[blx-prop="email"] { background: #666; color: white; }
```

## URL Encoding

All data attributes (`data-share-url`, `data-share-title`, `data-share-desc`) are automatically URL-encoded, so you don't need to encode special characters.

## Security

The script automatically adds `rel="noopener noreferrer"` to all share links to prevent security vulnerabilities when opening new windows.

## Browser Support

Works in all modern browsers. Requires:
- `window.open()` for popup windows
- `mailto:` protocol support for email

## Tips

- **Use icons**: Add icon images or icon fonts inside the links for better visual design
- **Track shares**: Add analytics event listeners to track when users share
- **Mobile friendly**: Popup windows work well on desktop; on mobile they open in new tabs
- **Email descriptions**: Make `data-share-desc` compelling—it appears in the email body

## Common Use Cases

- Blog article sharing
- Product page sharing
- Landing page viral features
- Portfolio project sharing
- News article distribution

## License

Part of the BLX library. See main repository for license information.
