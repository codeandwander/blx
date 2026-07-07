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
- Copy to Clipboard package
- Mapbox package
- GSAP Animation package
- Accordion package
- Swiper package
- Local package

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

<!-- Copy to Clipboard package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/copy-to-clipboard/index.min.js"></script>

<!-- Mapbox package (requires Mapbox GL JS) -->
<link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"></script>
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/mapbox/index.min.js"></script>

<!-- GSAP Animation package (requires GSAP, SplitText, and ScrollTrigger) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/gsap-animation/index.min.js"></script>

<!-- Accordion package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/accordion/index.min.js"></script>

<!-- Swiper package (requires Swiper) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/swiper/index.min.js"></script>

<!-- Local package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/local/index.min.js"></script>
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
- Copy to Clipboard package: ~2.9KB
- Mapbox package: ~9KB
- GSAP Animation package: ~6KB (excludes GSAP)
- Accordion package: ~1.5KB
- Swiper package: ~2.5KB (excludes Swiper)
- Local package: ~1.3KB

## 📦 Packages

Each package has its own detailed documentation. Click the links below to learn more:

- **[TOC (Table of Contents)](packages/toc/)** - Automatically generate navigable table of contents from headings
- **[Inline SVG](packages/inline-svg/)** - Replace img tags with inline SVG for CSS styling
- **[Modal](packages/modal/)** - Accessible modal overlays with focus trapping and scroll locking
- **[Social Share](packages/social-share/)** - Share links for LinkedIn, Twitter, Facebook, and Email
- **[Copy to Clipboard](packages/copy-to-clipboard/)** - Copy URLs to clipboard with tooltip feedback
- **[Mapbox](packages/mapbox/)** - Interactive maps and globes with custom markers and Webflow collection integration
- **[GSAP Animation](packages/gsap-animation/)** - Attribute-driven text animations powered by GSAP
- **[Accordion](packages/accordion/)** - Height-animated accordions with single-open groups and start-open support
- **[Swiper](packages/swiper/)** - Attribute-driven Swiper carousels with pagination, navigation, thumbnails and CMS-friendly a11y
- **[Local](packages/local/)** - Displays the visitor's live local time and Cloudflare-detected country

💡 Roadmap
More packages will be introduced soon.
The structure is designed so each feature comes as a clean, independent module with:

- its own folder
- its own initialiser
- auto-detection through the global loader
