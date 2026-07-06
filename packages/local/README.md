# BLX Local

Displays the visitor's local time and country, read from their own device and from Cloudflare — no permission prompts, no third-party APIs.

## Features

- 🕒 Live ticking clock, set from the visitor's device (updates every second)
- 🌍 Country detected via Cloudflare's `/cdn-cgi/trace` endpoint, which every Webflow-hosted site is proxied through
- 🎯 Show the full default output, or target individual parts (`hours`, `min`, `sec`, `country`) with `blx-prop`
- 🪶 No dependencies, no API keys, no permission popups

## Limitations

Cloudflare's trace endpoint only exposes a country code — not a city. Getting city would require a Cloudflare Worker (separate infrastructure, not something a drop-in script can do), so this package deliberately shows country only.

The location feature also only works once the site is live behind Cloudflare (e.g. published on a `.webflow.io` domain or a custom domain pointed at Webflow) — it won't resolve on `localhost` or any origin that isn't Cloudflare-proxied.

## Installation

Load via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/local/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.0/packages/local/index.min.js"></script>
```

## Usage

### Time — default output

Renders as `HH:MM:SS`, updating every second:

```html
<div blx-el="local-time"></div>
```

### Time — individual parts

Only sub-elements with a matching `blx-prop` are updated, so you can show any combination:

```html
<div blx-el="local-time">
  <span blx-prop="hours"></span>:<span blx-prop="min"></span>:<span blx-prop="sec"></span>
</div>
```

Hours only:

```html
<div blx-el="local-time">
  <span blx-prop="hours"></span>
</div>
```

### Location — default output

Renders the visitor's country name (e.g. "United Kingdom"):

```html
<div blx-el="local-location"></div>
```

### Location — targeted prop

```html
<p>
  Visiting from <span blx-el="local-location" blx-prop="country"></span>
</p>
```

Note: `blx-el` must sit on the ancestor block being searched for `blx-prop`; put `blx-el="local-location"` on a wrapping element if `blx-prop="country"` is on a different element than the one you want auto-filled directly.

## Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `blx-el="local-time"` | Yes (for time) | Marks a live clock block |
| `blx-el="local-location"` | Yes (for location) | Marks a country block |
| `blx-prop="hours"` | No | Targets the hours part within a `local-time` block |
| `blx-prop="min"` | No | Targets the minutes part within a `local-time` block |
| `blx-prop="sec"` | No | Targets the seconds part within a `local-time` block |
| `blx-prop="country"` | No | Targets the country text within a `local-location` block |

If no `blx-prop` children are found inside a block, the block's own text is set directly with the full default output.

## How It Works

1. **Time**: `new Date()` reads the visitor's local time straight from their device — no network request. A `setInterval` ticks every second and updates either the matched `blx-prop` children, or the block's own text if none exist.
2. **Location**: a `fetch('/cdn-cgi/trace')` call reads Cloudflare's own edge trace data (same-origin, no CORS, no API key), which includes a `loc=` field with a 2-letter country code. `Intl.DisplayNames` turns that into a full country name client-side.

## License

Part of the BLX library. See main repository for license information.
