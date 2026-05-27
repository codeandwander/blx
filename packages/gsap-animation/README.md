# BLX Text Animation

Attribute-driven text animations for Webflow, powered by GSAP. Configure in the playground, apply attributes in the Webflow designer — no code required.

## Requirements

GSAP, SplitText, and ScrollTrigger must be loaded before this script. In Webflow these are available natively, or load them via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

ScrambleTextPlugin is only required if using the `scramble` effect:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrambleTextPlugin.min.js"></script>
```

## Installation

Load via jsDelivr after GSAP:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/text-animation/index.min.js"></script>
```

## Usage

Add `blx-anim` to any text element in Webflow. No JavaScript required.

```html
<h1 blx-anim="fade">Hello world</h1>

<h2 blx-anim="blur" blx-prop="inview">Fades in when scrolled into view</h2>

<p blx-anim="slide" blx-prop="inview,repeat" blx-duration="600" blx-stagger="20">
  Replays each time it enters the viewport
</p>
```

## Attributes

| Attribute | Value | Description |
|---|---|---|
| `blx-anim` | `fade` `blur` `slide` `typewriter` `rotate` `scramble` | The animation effect |
| `blx-prop` | `inview` `repeat` | Behavioural flags (comma-separated) |
| `blx-duration` | `800` | Duration in milliseconds. Default: `800` |
| `blx-easing` | `power2.out` | Any GSAP easing string. Default: `power2.out` |
| `blx-delay` | `0` | Delay in milliseconds before animation starts. Default: `0` |
| `blx-stagger` | `30` | Delay in milliseconds between each character. Default: `30` |

### `blx-prop` flags

| Flag | Description |
|---|---|
| `inview` | Triggers when the element scrolls into view (requires ScrollTrigger) |
| `repeat` | Replays each time the element re-enters the viewport. Only applies with `inview` |

## Effects

| Effect | Description |
|---|---|
| `fade` | Characters fade in |
| `blur` | Characters blur in from transparent |
| `slide` | Characters slide up from below, clipped at baseline |
| `typewriter` | Characters reveal left to right |
| `rotate` | Characters flip in on the X axis |
| `scramble` | Text scrambles through random characters before settling (requires ScrambleTextPlugin) |

## Examples

**Hero heading, fades in on load:**
```html
<h1 blx-anim="fade" blx-duration="1000" blx-stagger="40">
  Built for ambitious teams
</h1>
```

**Section heading, slides up on scroll:**
```html
<h2 blx-anim="slide" blx-prop="inview" blx-duration="700" blx-easing="power3.out">
  What we do
</h2>
```

**Scramble on scroll, replays on re-entry:**
```html
<p blx-anim="scramble" blx-prop="inview,repeat" blx-duration="1200">
  Code & Wander
</p>
```
