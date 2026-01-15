# BLX Inline SVG

Replaces `<img>` tags with inline SVG elements, enabling CSS styling of SVG internals (fill, stroke, etc.).

## Features

- 🎨 Style SVGs with CSS (color, fill, stroke)
- ⚡ Automatic caching for repeated SVGs
- 🔧 Preserves IDs, classes, and alt text
- 🎯 Optional fill/stroke mode control
- 📦 Fetches and inlines SVGs automatically
- 🌐 Works with external SVG files
- ⚡ ~2.5KB minified

## Installation

Load the script via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/inline-svg/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.8/packages/inline-svg/index.min.js"></script>
```

## Usage

### Basic Example

Simply add `blx-el="inline-svg"` to any `<img>` tag that references an SVG:

```html
<img src="icon.svg" blx-el="inline-svg" alt="My Icon">
```

This will be replaced with:
```html
<svg data-alt="My Icon">
  <!-- SVG contents -->
</svg>
```

### Control Fill/Stroke Behavior

Use `blx-prop` to specify how colors should be applied:

```html
<!-- Default: preserves original colors, removes hard-coded fills/strokes -->
<img src="icon.svg" blx-el="inline-svg">

<!-- Fill mode: sets fill="currentColor" -->
<img src="icon.svg" blx-el="inline-svg" blx-prop="fill">

<!-- Stroke mode: sets stroke="currentColor" -->
<img src="icon.svg" blx-el="inline-svg" blx-prop="stroke">
```

### Style with CSS

Once inlined, you can style SVGs with CSS:

```css
/* Style all inlined SVGs */
svg[data-alt] {
  fill: blue;
}

/* Using currentColor for theme integration */
.icon {
  color: #007bff;
}

.icon svg {
  fill: currentColor;
}

/* Target specific parts */
svg path {
  fill: red;
  stroke: blue;
  stroke-width: 2px;
}
```

## Attributes

| Attribute | Required | Values | Description |
|-----------|----------|--------|-------------|
| `blx-el="inline-svg"` | Yes | - | Enables SVG inlining |
| `blx-prop` | No | `fill`, `stroke` | Sets color mode |
| `src` | Yes | SVG file path | Must point to an `.svg` file |
| `alt` | No | Text | Preserved as `data-alt` attribute |

## How It Works

1. **Finds images**: Locates all `<img>` tags with `blx-el="inline-svg"` and `.svg` source
2. **Fetches SVG**: Downloads the SVG file (with caching for duplicates)
3. **Cleans colors**: Removes hard-coded fill/stroke attributes (preserves `fill="none"`)
4. **Applies mode**: Sets `fill` or `stroke` to `currentColor` if mode specified
5. **Replaces image**: Swaps the `<img>` with the inline `<svg>` element
6. **Preserves attributes**: Maintains ID, classes, and alt text

## Color Handling

The script automatically:
- ✅ Removes hard-coded `fill` attributes (except `fill="none"`)
- ✅ Removes hard-coded `stroke` attributes
- ✅ Preserves `fill="none"` (important for stroke-only icons)
- ✅ Removes fixed width/height (lets CSS control sizing)

### Mode Options

**No mode (default):**
- Cleans colors but doesn't add new ones
- Best for SVGs that should inherit styles naturally

**Fill mode (`blx-prop="fill"`):**
- Sets `fill="currentColor"` on the SVG root
- Best for solid icons that inherit text color

**Stroke mode (`blx-prop="stroke"`):**
- Sets `stroke="currentColor"` on the SVG root
- Best for outline/stroke-based icons

## Examples

### Icon with Color Inheritance
```html
<div style="color: red;">
  <img src="heart.svg" blx-el="inline-svg" blx-prop="fill">
  <!-- SVG will be red -->
</div>
```

### Multiple Instances (Cached)
```html
<!-- First instance fetches the SVG -->
<img src="logo.svg" blx-el="inline-svg" class="logo-header">

<!-- Second instance uses cached version -->
<img src="logo.svg" blx-el="inline-svg" class="logo-footer">
```

### Preserving ID and Classes
```html
<img src="icon.svg" 
     blx-el="inline-svg" 
     id="my-icon" 
     class="icon icon-large"
     alt="Settings">
     
<!-- Becomes: -->
<svg id="my-icon" class="icon icon-large" data-alt="Settings">
  <!-- SVG contents -->
</svg>
```

## Browser Support

- Modern browsers: Native fetch API
- Requires: `DOMParser`, `fetch`, `Promise`

## Tips

- **Use `currentColor`**: Design SVGs to work with the `currentColor` value for easy theming
- **Remove inline colors in SVG**: For best results, export SVGs without fill/stroke attributes
- **Test caching**: The same SVG path will only be fetched once
- **Alt text**: Always include alt text for accessibility (preserved as `data-alt`)

## Common Issues

**SVG not appearing?**
- Check console for CORS errors
- Ensure the SVG file is accessible
- Verify the `src` path is correct and ends in `.svg`

**Colors not changing?**
- Use `blx-prop="fill"` or `blx-prop="stroke"` mode
- Check if the SVG has hard-coded colors that need cleaning
- Ensure your CSS targets the SVG correctly

## License

Part of the BLX library. See main repository for license information.
