BLX — A lightweight collection of Webflow-friendly enhancements

BLX is a set of small, focused JavaScript packages designed to add useful behaviour to Webflow and similar no-code setups. Each package is self-contained, easy to integrate, and built with real-world Webflow constraints in mind.

The repository is structured so you can:

- load only the packages you use
- or load everything through a single global loader
- keep clean versioning through GitHub Releases + jsDelivr CDN
- scale the library as more packages are added

📚 At the moment, BLX includes: 
- TOC (Table of Contents) package
- Inline SVG package
- Modal package

## 🚀 Usage

### Loading via jsDelivr CDN

All packages are automatically minified and available via jsDelivr. You can load them individually or all together.

**Load individual packages (recommended):**
```html
<!-- Core utilities (required for modal package) -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/dist/core/index.min.js"></script>

<!-- TOC package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/dist/packages/toc/index.min.js"></script>

<!-- Inline SVG package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/dist/packages/inline-svg/index.min.js"></script>

<!-- Modal package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/dist/packages/modal/index.min.js"></script>
```

**Or pin to a specific version:**
```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.5/dist/packages/toc/index.min.js"></script>
```

### File Sizes
The minified packages are optimized for fast loading:
- Core utilities: ~446 bytes
- TOC package: ~1.6KB
- Inline SVG package: ~1.1KB
- Modal package: ~3.2KB

💡 Roadmap
More packages will be introduced soon.
The structure is designed so each feature comes as a clean, independent module with:

- its own folder
- its own initialiser
- auto-detection through the global loader
