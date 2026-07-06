# BLX Local

Localises time and place for the visitor: a live clock, their country, and fixed event times converted into their own time zone. Reads from the visitor's own device and from Cloudflare — no permission prompts, no third-party APIs.

## Features

- 🕒 Live ticking clock, set from the visitor's device by default, or pinned to a fixed city/zone (e.g. an office-hours footer)
- 🌍 Country detected via Cloudflare's `/cdn-cgi/trace` endpoint, which every Webflow-hosted site is proxied through
- 🔁 Converts a fixed event date/time (e.g. from a Webflow CMS Date field) into the visitor's local time zone
- 🎯 Show the full default output, or narrow it down with `blx-prop` (combine values, e.g. `blx-prop="hours min"`)
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

`blx-prop` goes directly on the `local-time` element and picks which part(s) to show, always rendered in `hours:min:sec` order:

```html
<!-- Hours only -->
<div blx-el="local-time" blx-prop="hours"></div>

<!-- Hours and minutes, no seconds -->
<div blx-el="local-time" blx-prop="hours min"></div>
```

### Time — fixed to a specific city/zone

By default `local-time` shows the visitor's own device time. Set `blx-tz` to a [IANA time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) to pin it instead — useful for something like an office-hours footer that should read the same for every visitor:

```html
<div>London <span blx-el="local-time" blx-tz="Europe/London"></span></div>
<div>Düsseldorf <span blx-el="local-time" blx-tz="Europe/Berlin"></span></div>
<div>Stockholm <span blx-el="local-time" blx-tz="Europe/Stockholm"></span></div>
<div>Denver <span blx-el="local-time" blx-tz="America/Denver"></span></div>
```

Renders e.g. `17:38:45 BST`, `18:38:45 CEST`, `18:38:45 CEST`, `10:38:45 MDT` — DST is handled automatically, since it's resolved by the browser against the real IANA zone rather than a fixed offset.

The zone abbreviation is included automatically when `blx-tz` is set and `blx-prop` is omitted. Combine it explicitly with `blx-prop` if you want it alongside specific parts, or leave it out to suppress it:

```html
<!-- Hours and minutes only, no zone label -->
<div blx-el="local-time" blx-tz="Europe/London" blx-prop="hours min"></div>

<!-- Hours and minutes with the zone label -->
<div blx-el="local-time" blx-tz="Europe/London" blx-prop="hours min zone"></div>
```

An invalid `blx-tz` value leaves that block's markup untouched rather than breaking the clock for other blocks on the page.

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
| `blx-prop="hours"` | No | On a `local-time` element, shows hours only |
| `blx-prop="min"` | No | On a `local-time` element, shows minutes only |
| `blx-prop="sec"` | No | On a `local-time` element, shows seconds only |
| `blx-prop="zone"` | No | On a `local-time` element, includes the zone abbreviation (e.g. `BST`) |
| `blx-prop="country"` | No | Targets the country text within a `local-location` block |
| `blx-prop="date"` | No | On a `local-convert` element, shows the date only |
| `blx-prop="time"` | No | On a `local-convert` element, shows the time only |
| `blx-tz` (on `local-time`) | No | Pins the clock to a fixed [IANA zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), e.g. `Europe/London`. Default: visitor's own device zone |
| `blx-tz` (on `local-convert`) | No | Zone the source text is written in — a loose abbreviation like `EST` is fine here. Default: `GMT` |

On `local-time` and `local-convert`, `blx-prop` values can be combined space-separated (e.g. `blx-prop="hours min"`), and omitting it shows the full default output. On `local-time`, `zone` is included automatically when `blx-tz` is set and `blx-prop` is omitted. `local-location` works differently — see the targeted prop example above.

Note: `blx-tz` means slightly different things on the two elements — `local-time` needs a real IANA zone name (for correct DST handling on an ongoing clock), while `local-convert` just needs something the browser's date parser recognises as a zone suffix (used once, for a fixed date).

## How It Works

1. **Time**: reads the visitor's local time straight from their device by default, or a fixed zone if `blx-tz` is set — no network request either way. A `setInterval` ticks every second and rebuilds the text from whichever parts `blx-prop` requests (or the full default).
2. **Location**: a `fetch('/cdn-cgi/trace')` call reads Cloudflare's own edge trace data (same-origin, no CORS, no API key), which includes a `loc=` field with a 2-letter country code. `Intl.DisplayNames` turns that into a full country name client-side.
3. **Event time**: reads the element's own visible text, appends the assumed source time zone (`blx-tz`, default `GMT`) so the browser's date parser resolves it unambiguously, then formats the result with `Intl.DateTimeFormat` using the visitor's own detected time zone.

## License

Part of the BLX library. See main repository for license information.
