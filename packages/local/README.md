# BLX Local

Localises time and place for the visitor: a live clock, their country, and fixed event times converted into their own time zone. Reads from the visitor's own device and from Cloudflare — no permission prompts, no third-party APIs.

## Features

- 🕒 Live ticking clock, set from the visitor's device (updates every second)
- 🌍 Country detected via Cloudflare's `/cdn-cgi/trace` endpoint, which every Webflow-hosted site is proxied through
- 🔁 Converts a fixed event date/time (e.g. from a Webflow CMS Date field) into the visitor's local time zone
- 🎯 Show the full default output, or target individual parts (`hours`, `min`, `sec`, `country`, `date`, `time`) with `blx-prop`
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

### Event time — convert to visitor's local time

Put the event's date/time as the element's visible text — typically a Webflow CMS Date field bound directly to the text, using a format that includes both date and time (e.g. "June 11, 2026 6:00 PM"). It's replaced in place once the conversion runs:

```html
<div blx-el="local-convert">June 11, 2026 6:00 PM</div>
```

Renders as e.g. `June 11, 2026 at 02:00 PM EDT` for a visitor in New York.

The source text is assumed to be **GMT** by default. If a particular block's source is in a different time zone, override it with `blx-tz`:

```html
<div blx-el="local-convert" blx-tz="EST">June 11, 2026 6:00 PM</div>
```

Unlike `local-time`/`local-location`, `blx-prop` here goes directly on the same element — it controls which part of *that* converted value is shown, not a separate child:

```html
<!-- Date only -->
<div blx-el="local-convert" blx-prop="date">June 11, 2026 6:00 PM</div>

<!-- Time only -->
<div blx-el="local-convert" blx-prop="time">June 11, 2026 6:00 PM</div>
```

If the text is empty or can't be parsed as a date, it's left untouched rather than showing "Invalid Date".

## Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `blx-el="local-time"` | Yes (for time) | Marks a live clock block |
| `blx-el="local-location"` | Yes (for location) | Marks a country block |
| `blx-el="local-convert"` | Yes (for event time) | Marks a fixed date/time (in its visible text) to convert to the visitor's time zone |
| `blx-prop="hours"` | No | Targets the hours part within a `local-time` block |
| `blx-prop="min"` | No | Targets the minutes part within a `local-time` block |
| `blx-prop="sec"` | No | Targets the seconds part within a `local-time` block |
| `blx-prop="country"` | No | Targets the country text within a `local-location` block |
| `blx-prop="date"` | No | On a `local-convert` element, shows the date only |
| `blx-prop="time"` | No | On a `local-convert` element, shows the time only |
| `blx-tz` | No | Time zone the `local-convert` source text is written in. Default: `GMT` |

If no `blx-prop` children are found inside a `local-time`/`local-location` block, the block's own text is set directly with the full default output. On a `local-convert` element, omitting `blx-prop` shows the full date and time together.

## How It Works

1. **Time**: `new Date()` reads the visitor's local time straight from their device — no network request. A `setInterval` ticks every second and updates either the matched `blx-prop` children, or the block's own text if none exist.
2. **Location**: a `fetch('/cdn-cgi/trace')` call reads Cloudflare's own edge trace data (same-origin, no CORS, no API key), which includes a `loc=` field with a 2-letter country code. `Intl.DisplayNames` turns that into a full country name client-side.
3. **Event time**: reads the element's own visible text, appends the assumed source time zone (`blx-tz`, default `GMT`) so the browser's date parser resolves it unambiguously, then formats the result with `Intl.DateTimeFormat` using the visitor's own detected time zone.

## License

Part of the BLX library. See main repository for license information.
