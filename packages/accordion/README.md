# BLX Accordion

A lightweight JavaScript package that turns Webflow elements into smooth, height-animated accordions — with optional single-open groups and a start-open state.

## Features

- 📐 Smooth height animation (animates to content height, then settles to `auto`)
- 🔗 Optional single-open groups — opening one panel closes its siblings
- 👀 Optional start-open state, applied only on desktop (≥768px)
- 🧩 Pure attribute API — no configuration needed
- 🎯 Tiny footprint

## Installation

Load the script via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/accordion/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.0/packages/accordion/index.min.js"></script>
```

## Usage

### Basic Example

Each accordion needs a head (the clickable trigger) and a body (the collapsible content):

```html
<div blx-el="accordion">
  <div blx-el="accordion-head">Question</div>
  <div blx-el="accordion-body">Answer content goes here.</div>
</div>
```

### Start Open

Add `blx-prop="start-open"` to have a panel open on load. This applies only at viewport widths of 768px and above.

```html
<div blx-el="accordion" blx-prop="start-open">
  <div blx-el="accordion-head">Open by default on desktop</div>
  <div blx-el="accordion-body">Visible on load.</div>
</div>
```

### Single-Open Group

Wrap accordions in a group with `blx-prop="single-open"` so that opening one panel closes the others:

```html
<div blx-el="accordion-group" blx-prop="single-open">
  <div blx-el="accordion">
    <div blx-el="accordion-head">Item one</div>
    <div blx-el="accordion-body">Content one.</div>
  </div>
  <div blx-el="accordion">
    <div blx-el="accordion-head">Item two</div>
    <div blx-el="accordion-body">Content two.</div>
  </div>
</div>
```

## Attributes

| Attribute | Element | Required | Description |
|-----------|---------|----------|-------------|
| `blx-el="accordion"` | Accordion wrapper | Yes | Marks a single accordion |
| `blx-el="accordion-head"` | Inside accordion | Yes | The clickable trigger |
| `blx-el="accordion-body"` | Inside accordion | Yes | The collapsible content |
| `blx-prop="start-open"` | Accordion wrapper | No | Opens the panel on load (≥768px only) |
| `blx-el="accordion-group"` | Group wrapper | No | Groups accordions together |
| `blx-prop="single-open"` | Group wrapper | No | Only one panel open at a time within the group |

## Styling

The script controls `height` and `overflow` on the body, and toggles the `is-open` class on the accordion wrapper. Add a CSS transition on the body to animate the open/close, and use `is-open` to style heads, icons, or rotation:

```css
[blx-el="accordion-body"] {
  transition: height 0.3s ease;
}

[blx-el="accordion"].is-open [blx-el="accordion-head"] {
  /* active head styles */
}
```

## How It Works

1. On load, each body is set to `overflow: hidden` and collapsed to `0px` (or left open if `start-open` applies).
2. Clicking the head toggles the panel: opening animates the body to its content height, then settles to `auto` so it stays responsive; closing animates back to `0px`.
3. Inside a `single-open` group, opening one panel closes any open siblings.

## License

Part of the BLX library. See main repository for license information.
