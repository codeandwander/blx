# BLX Table of Contents (TOC)

Automatically generates a navigable table of contents from heading elements in your content.

## Features

- 📝 Automatically extracts H2 and H3 headings from rich text blocks
- 🔗 Generates unique IDs for headings without them
- 🎯 Smooth scrolling with automatic header offset
- 🔄 Supports nested structure (H3s nested under H2s)
- 🎨 Uses your custom Webflow component as template
- 🆔 Optional scoping with `blx-id` for multiple TOCs
- ⚡ ~3.5KB minified

## Installation

Load the script via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/toc/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.8/packages/toc/index.min.js"></script>
```

## Usage

### Basic Setup

1. **Create the TOC container** with `blx-el="toc"`:
```html
<div blx-el="toc">
  <ul blx-el="toc-list">
    <li blx-el="toc-item">
      <a href="#">Template Item</a>
    </li>
  </ul>
</div>
```

2. **Mark your content** with `blx-el="toc-rich-text"`:
```html
<div blx-el="toc-rich-text" class="rich-text">
  <h2>First Section</h2>
  <p>Content here...</p>
  
  <h3>Subsection</h3>
  <p>More content...</p>
  
  <h2>Second Section</h2>
  <p>Content here...</p>
</div>
```

### Multiple TOCs (Scoped)

Use `blx-id` to scope TOCs to specific content blocks:

```html
<!-- TOC for Article 1 -->
<div blx-el="toc" blx-id="article-1">
  <ul blx-el="toc-list">
    <li blx-el="toc-item"><a href="#">Item</a></li>
  </ul>
</div>

<!-- Content for Article 1 -->
<div blx-el="toc-rich-text" blx-id="article-1">
  <h2>Article 1 Heading</h2>
  <!-- content -->
</div>

<!-- TOC for Article 2 -->
<div blx-el="toc" blx-id="article-2">
  <ul blx-el="toc-list">
    <li blx-el="toc-item"><a href="#">Item</a></li>
  </ul>
</div>

<!-- Content for Article 2 -->
<div blx-el="toc-rich-text" blx-id="article-2">
  <h2>Article 2 Heading</h2>
  <!-- content -->
</div>
```

## Attributes

| Attribute | Applied To | Required | Description |
|-----------|-----------|----------|-------------|
| `blx-el="toc"` | Container | Yes | Marks the TOC container |
| `blx-el="toc-list"` | List element (ul/ol) | Yes | Container for TOC items |
| `blx-el="toc-item"` | List item (li) | Yes | Template for each TOC entry |
| `blx-el="toc-rich-text"` | Content block | Yes | Marks content to scan for headings |
| `blx-id="[id]"` | TOC & content | No | Links specific TOC to specific content |

## How It Works

1. **Scans content**: Finds all `[blx-el="toc-rich-text"]` blocks (optionally filtered by `blx-id`)
2. **Extracts headings**: Collects all H2 and H3 elements in document order
3. **Generates IDs**: Creates unique IDs for headings that don't have them (based on heading text)
4. **Builds TOC**: Clones your template item for each heading, nesting H3s under H2s
5. **Adds smooth scroll**: Links scroll smoothly with automatic header offset detection

## Styling

The TOC uses your Webflow-designed template item. Style it however you like in the Designer:

- The template `<li>` defines the look of each TOC item
- H3 subsections are nested in a `<ul class="toc-sublist">` under their parent H2
- Style `.toc-sublist` for nested appearance (indentation, etc.)

Example CSS for nested items:
```css
.toc-sublist {
  margin-left: 20px;
  padding-left: 10px;
  border-left: 2px solid #e0e0e0;
}
```

## Header Offset

The script automatically detects common header elements (`.header`, `.navbar`, `.nav-wrapper`) and adjusts scroll position to account for fixed headers. If your header uses different classes, the default offset is 100px.

## Browser Support

Works in all modern browsers. Requires:
- `querySelector` / `querySelectorAll`
- `getBoundingClientRect()`
- Smooth scroll API (gracefully degrades to instant scroll in older browsers)

## Tips

- **Unique heading text**: Since IDs are generated from heading text, avoid duplicate headings
- **Keep structure simple**: Use H2 for main sections, H3 for subsections. Other heading levels are ignored.
- **Style in Webflow**: Design your TOC item template visually, the script will clone it
- **Multiple content blocks**: Use multiple `[blx-el="toc-rich-text"]` blocks if your content is split across sections

## License

Part of the BLX library. See main repository for license information.
