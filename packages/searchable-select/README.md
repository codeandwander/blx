# BLX Searchable Select

A searchable dropdown for single-select and multiselect UI patterns in Webflow-style markup. The package keeps the HTML flexible: wire a trigger, panel, search field and options with `blx-el`, then tune behaviour with data attributes.

## Features

- 🔎 Client-side search filtering with optional empty state
- ☑️ Supports both single-select and multiselect blocks
- 🧩 Works with native radio/checkbox inputs or data-driven option elements
- 🔢 Optional selected-count badge, clear button and hidden-value mirror input
- ♿ Accessible defaults with `aria-expanded`, `role="listbox"`, `role="option"`, Escape close and outside-click close

## Installation

Load via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/searchable-select/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.0/packages/searchable-select/index.min.js"></script>
```

## Usage

### Multiselect with search, count and clear

```html
<div
  blx-el="searchable-select"
  data-blx-select-multiple="true"
  data-blx-select-placeholder="Sector"
>
  <button blx-el="searchable-select-trigger" type="button">
    <span blx-el="searchable-select-label">Sector</span>
    <span blx-el="searchable-select-count" hidden></span>
  </button>

  <div blx-el="searchable-select-panel" hidden>
    <div class="select-header">
      <strong>Sector</strong>
      <button blx-el="searchable-select-clear" type="button" hidden>Clear all</button>
    </div>

    <input
      blx-el="searchable-select-search"
      type="search"
      placeholder="Search sector..."
    >

    <div blx-el="searchable-select-options">
      <label blx-el="searchable-select-option" data-value="life-sciences">
        <input type="checkbox" name="sector" value="Life Sciences &amp; Pharma" checked>
        <span>Life Sciences &amp; Pharma</span>
      </label>

      <label blx-el="searchable-select-option" data-value="telecoms">
        <input type="checkbox" name="sector" value="Telecoms &amp; SEP" checked>
        <span>Telecoms &amp; SEP</span>
      </label>

      <label blx-el="searchable-select-option" data-value="software">
        <input type="checkbox" name="sector" value="Software &amp; Digital">
        <span>Software &amp; Digital</span>
      </label>
    </div>

    <div blx-el="searchable-select-empty" hidden>No sectors match that search.</div>
    <input blx-el="searchable-select-input" type="hidden" name="sector-summary">
  </div>
</div>
```

### Single-select with radios

```html
<div
  blx-el="searchable-select"
  data-blx-select-placeholder="Court"
  data-blx-select-summary="labels"
>
  <button blx-el="searchable-select-trigger" type="button">
    <span blx-el="searchable-select-label">Court</span>
  </button>

  <div blx-el="searchable-select-panel" hidden>
    <input blx-el="searchable-select-search" type="search" placeholder="Search court...">

    <div blx-el="searchable-select-options">
      <label blx-el="searchable-select-option">
        <input type="radio" name="court" value="Commercial Court">
        <span>Commercial Court</span>
      </label>

      <label blx-el="searchable-select-option">
        <input type="radio" name="court" value="Technology and Construction Court">
        <span>Technology and Construction Court</span>
      </label>
    </div>
  </div>
</div>
```

### Data-driven options (no native inputs)

```html
<div blx-el="searchable-select" data-blx-select-multiple="true">
  <button blx-el="searchable-select-trigger" type="button">
    <span blx-el="searchable-select-label">Topics</span>
  </button>

  <div blx-el="searchable-select-panel" hidden>
    <input blx-el="searchable-select-search" type="search">

    <div blx-el="searchable-select-options">
      <button blx-el="searchable-select-option" data-value="ai" type="button">AI</button>
      <button blx-el="searchable-select-option" data-value="ops" type="button">Ops</button>
      <button blx-el="searchable-select-option" data-value="design" type="button">Design</button>
    </div>

    <input blx-el="searchable-select-input" type="hidden" name="topics">
  </div>
</div>
```

## Attributes

### Required structure

| Attribute | Required | Description |
|-----------|----------|-------------|
| `blx-el="searchable-select"` | Yes | Root wrapper for a single dropdown |
| `blx-el="searchable-select-trigger"` | Yes | Button or clickable trigger that opens the panel |
| `blx-el="searchable-select-panel"` | Yes | Dropdown panel that opens/closes |
| `blx-el="searchable-select-option"` | Yes | Individual option item |

### Optional child elements

| Attribute | Description |
|-----------|-------------|
| `blx-el="searchable-select-label"` | Element inside the trigger that receives the selected summary; recommended whenever the trigger also contains icons or other decorative UI |
| `blx-el="searchable-select-count"` | Count badge; hidden automatically when nothing is selected |
| `blx-el="searchable-select-clear"` | Clear-all button; hidden automatically when nothing is selected |
| `blx-el="searchable-select-search"` | Search field used to filter options |
| `blx-el="searchable-select-options"` | Optional options wrapper that receives `role="listbox"` |
| `blx-el="searchable-select-empty"` | Empty-state element shown when search returns no matches |
| `blx-el="searchable-select-input"` | Hidden or text input that mirrors the selected values |

### Root data attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-blx-select-multiple` | auto-detect | Force multiselect mode (`true` / `false`) |
| `data-blx-select-placeholder` | trigger text | Placeholder shown when nothing is selected |
| `data-blx-select-multi-label` | placeholder | Trigger label used in `count` summary mode |
| `data-blx-select-summary` | `count` when a count badge exists, otherwise `labels` | Multiselect summary mode: `count`, `labels`, or `first`; in `labels` mode `data-blx-select-max-labels` can collapse the summary to `label1, label2 +N` |
| `data-blx-select-separator` | `, ` | Separator for the `labels` summary |
| `data-blx-select-value-separator` | `,` | Separator used when mirroring values into `blx-el="searchable-select-input"` |
| `data-blx-select-search-placeholder` | `Search...` | Search input placeholder |
| `data-blx-select-search-mode` | `contains` | Match mode: `contains` or `starts-with` |
| `data-blx-select-empty-text` | `No results found` | Default empty-state text |
| `data-blx-select-close-on-select` | `true` for single-select, `false` for multiselect | Close the panel after a selection |
| `data-blx-select-keep-search` | `false` | Keep the search term when the panel closes |
| `data-blx-select-max-labels` | `0` | Limit how many labels are shown before collapsing to `+N` |
| `data-blx-select-open-class` | `is-open` | Class toggled on the root while open |
| `data-blx-select-selected-class` | `is-selected` | Class toggled on selected options |
| `data-blx-select-hidden-class` | `is-hidden` | Class toggled on filtered-out options |
| `data-blx-select-disabled-class` | `is-disabled` | Class toggled on disabled options |

### Option data attributes

| Attribute | Description |
|-----------|-------------|
| `data-value` | Value used when no native input exists |
| `data-label` | Label used for the trigger summary |
| `data-selected="true"` | Starts a data-driven option as selected |
| `data-disabled="true"` | Disables a data-driven option |
| `data-blx-select-search-text` | Custom text used for search matching |

## Styling

The script only manages state. Style the component with your own CSS using the default classes or override them with data attributes.

```css
[blx-el="searchable-select-panel"][hidden] {
  display: none;
}

[blx-el="searchable-select"].is-open [blx-el="searchable-select-panel"] {
  display: block;
}

[blx-el="searchable-select-option"].is-selected {
  /* selected option styles */
}

[blx-el="searchable-select-option"].is-hidden {
  display: none;
}
```

## How It Works

1. The root block reads its configuration from `data-blx-select-*` attributes and optional `blx-prop` flags such as `multiple`, `close-on-select`, and `keep-search`.
2. On load, the package inspects each option, infers single vs multiselect mode, and syncs the trigger label, count badge and mirrored input value from the selected items.
3. Typing into `blx-el="searchable-select-search"` filters options in place, while the optional empty-state element is shown only when nothing matches.
4. Selecting an option updates `aria-selected`, state classes, the selected-count attribute on the root, and closes the panel when the configuration says it should.

## License

Part of the BLX library. See main repository for license information.
