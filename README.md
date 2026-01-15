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
- Social Share package

## 🚀 Usage

### Loading via jsDelivr CDN

All packages are available via jsDelivr CDN, which automatically minifies them when you use the `.min.js` extension. You can load them individually or all together.

**Load individual packages (recommended):**
```html
<!-- Core utilities (required for modal package) -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/core/index.min.js"></script>

<!-- TOC package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/toc/index.min.js"></script>

<!-- Inline SVG package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/inline-svg/index.min.js"></script>

<!-- Modal package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/modal/index.min.js"></script>

<!-- Social Share package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/social-share/index.min.js"></script>
```

**Or pin to a specific version:**
```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.5/packages/toc/index.min.js"></script>
```

### File Sizes
The source packages are lightweight and automatically minified by jsDelivr on delivery:
- Core utilities: ~849 bytes
- TOC package: ~3.5KB
- Inline SVG package: ~2.5KB
- Modal package: ~7.4KB
- Social Share package: ~1.5KB

💡 Roadmap
More packages will be introduced soon.
The structure is designed so each feature comes as a clean, independent module with:

- its own folder
- its own initialiser
- auto-detection through the global loader
