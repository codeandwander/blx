# BLX Swiper

A thin, attribute-driven wrapper around [Swiper](https://swiperjs.com/) for Webflow. Configure carousels entirely from `blx-swiper-*` attributes — no custom code per block.

## Features

- 🎛️ Full config via attributes — loop, rewind, autoplay, effects, speed and more
- 📱 Built-in responsive breakpoints (mobile / tablet / desktop)
- 🔢 Optional pagination, navigation arrows and thumbnails
- ♿ Uses Swiper's own A11y module (`slideRole` exposed for CMS), optional keyboard control, and respects reduced motion
- 🔄 Auto-updates on injected slides and hidden-tab reveals; idempotent re-init with a `destroy()` teardown for page transitions
- 🛡️ Safe wiring — pagination/navigation only initialise when their elements exist

## Requirements

Swiper must be loaded **before** this script:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

## Installation

Load via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/swiper/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.0/packages/swiper/index.min.js"></script>
```

## Usage

Mark the block with `blx-el="swiper"` and include a `.swiper` container with the standard Swiper structure inside:

```html
<div blx-el="swiper" blx-swiper-loop="true" blx-swiper-autoplay="true">
  <div class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide one</div>
      <div class="swiper-slide">Slide two</div>
    </div>
  </div>

  <!-- Optional — pagination and arrows are detected by presence -->
  <div blx-el="swiper-pagination"></div>
  <div blx-el="swiper-prev">‹</div>
  <div blx-el="swiper-next">›</div>
</div>
```

### CMS collections

When the slides come from a Webflow Collection List, Webflow renders the list as `role="list"` and items as `role="listitem"`. Set `slide-role` to preserve that pairing — otherwise Swiper overwrites each slide with its default `group` role:

```html
<div blx-el="swiper" blx-swiper-slide-role="listitem"> … </div>
```

## Attributes

Tuning attributes (`blx-swiper-*`) live on the `blx-el="swiper"` element. Pagination and navigation are enabled by placing marker elements inside the block (see those sections).

| Attribute | Default | Description |
|-----------|---------|-------------|
| `blx-el="swiper"` | — | Marks the block (required) |
| `blx-swiper-loop` | `false` | Infinite loop (clones slides) |
| `blx-swiper-rewind` | `false` | Rewind to the first slide instead of looping (ignored if `loop` is on) |
| `blx-swiper-direction` | `horizontal` | `horizontal` or `vertical` |
| `blx-swiper-speed` | `300` | Transition duration in ms (animation length, unrelated to autoplay timing) |
| `blx-swiper-initial-slide` | `0` | Starting slide index |
| `blx-swiper-effect` | `slide` | `slide`, `fade`, `cube`, `coverflow`, `flip`, `creative` |
| `blx-swiper-grab-cursor` | `false` | Show grab cursor |
| `blx-swiper-centered-slides` | `false` | Centre the active slide |
| `blx-swiper-space-between` | `20` | Gap between slides (px) |
| `blx-swiper-slide-role` | `group` | ARIA role applied to each slide |
| `blx-swiper-keyboard` | `false` | Allow arrow-key control when the swiper is in view |

### Autoplay

| Attribute | Default | Description |
|-----------|---------|-------------|
| `blx-swiper-autoplay` | `false` | Enable autoplay |
| `blx-swiper-autoplay-delay` | `3000` | Delay between transitions (ms) |
| `blx-swiper-autoplay-disable-on-interaction` | `false` | Stop autoplay after user interaction |

Autoplay is automatically suppressed for visitors who have **reduced motion** enabled in their OS (WCAG 2.2.2), even when `blx-swiper-autoplay="true"`.

### Pagination

Pagination is enabled automatically when an element marked `blx-el="swiper-pagination"` exists inside the block. The remaining attributes are optional tuning.

| Attribute | Default | Description |
|-----------|---------|-------------|
| `blx-el="swiper-pagination"` | — | Marks the pagination container (enables pagination) |
| `blx-swiper-pagination-clickable` | `false` | Clickable bullets |
| `blx-swiper-pagination-type` | `bullets` | `bullets`, `fraction`, `progressbar` |
| `blx-swiper-pagination-dynamic-bullets` | `false` | Dynamic bullets |
| `blx-swiper-pagination-bullet-class` | `swiper_bullet` | Bullet class (applied by Swiper to generated bullets) |
| `blx-swiper-pagination-bullet-active-class` | `swiper_bullet-active` | Active bullet class |

### Navigation

Navigation is enabled automatically when **both** arrow elements exist inside the block.

| Attribute | Default | Description |
|-----------|---------|-------------|
| `blx-el="swiper-next"` | — | Marks the next arrow |
| `blx-el="swiper-prev"` | — | Marks the previous arrow |
| `blx-swiper-navigation-disabled-class` | `swiper_button-disabled` | Disabled arrow class (toggled by Swiper) |

### Thumbnails

| Attribute | Default | Description |
|-----------|---------|-------------|
| `blx-swiper-thumbs` | — | Class name of the thumbnail Swiper (looked up document-wide) |

### Responsive breakpoints

| Attribute | Default | Breakpoint |
|-----------|---------|------------|
| `blx-swiper-mobile-slides-per-view` | `1` | from 0px |
| `blx-swiper-mobile-space-between` | `10` | from 0px |
| `blx-swiper-tablet-slides-per-view` | `2` | from 768px |
| `blx-swiper-tablet-space-between` | `15` | from 768px |
| `blx-swiper-desktop-slides-per-view` | `3` | from 992px |
| `blx-swiper-desktop-space-between` | `20` | from 992px |

## How It Works

1. Each `[blx-el="swiper"]` block is read for its `blx-swiper-*` attributes.
2. A Swiper config is built, with pagination, navigation and thumbs only added when their elements are present — a missing element means that feature is skipped rather than throwing.
3. Swiper's A11y module is left on; only `slideRole` is overridden so CMS list semantics survive.
4. `observer` and `observeParents` are enabled, so a carousel auto-updates when its slides change or a parent becomes visible. This fixes the common case of a swiper inside a hidden Webflow tab/dropdown initialising at zero width, and picks up CMS-injected slides without intervention.

## Re-initialising (dynamic content)

`window.BLX_SWIPER()` is safe to call again after the page has loaded — for example once a CMS load (Finsweet) or page transition injects new content. On a re-run:

- **New blocks** that aren't yet initialised are set up fresh.
- **Existing blocks** are not re-initialised — they call `swiper.update()` instead, so slides injected into an already-running carousel are picked up without building a duplicate instance.

```js
// After injecting new slides or swiper blocks
window.BLX_SWIPER();
```

Note: `update()` recalculates slides, pagination and navigation. If you change a running carousel's *options* (not just its slides) you'll need to destroy and re-create it manually.

### Tearing down

`window.BLX_SWIPER.destroy()` destroys initialised swipers and cleans up their listeners and timers. Call it before a page transition (Barba, Swup) to avoid leaking instances, then re-initialise after the new content is in:

```js
// Destroy everything on the page
window.BLX_SWIPER.destroy();

// Or limit to a scope (e.g. the outgoing transition container)
window.BLX_SWIPER.destroy(container);
```

After destroying, the blocks can be initialised cleanly again with `window.BLX_SWIPER()`.

## License

Part of the BLX library. See main repository for license information.
