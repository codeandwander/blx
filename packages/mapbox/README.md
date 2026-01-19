# BLX Mapbox

Create interactive Mapbox maps and globes with custom styles, markers, and Webflow collection integration.

## Features

- 🗺️ Full Mapbox GL JS integration (2D maps and 3D globes)
- 🎨 Custom map styles with control over labels and borders
- 🔍 Configurable zoom limits (min/max)
- 📍 Custom markers with HTML content
- 💬 Custom popups that appear on marker click
- ✨ Active marker states with custom styling
- 🔄 Webflow collection integration (automatic marker generation)
- 📱 Responsive and mobile-friendly
- 🎯 Multiple maps per page supported
- ⚡ ~9KB minified

## Installation

**Important**: You need to include Mapbox GL JS library before loading this package.

```html
<!-- Mapbox GL JS (required) -->
<link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"></script>

<!-- BLX Mapbox package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/mapbox/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.1.0/packages/mapbox/index.min.js"></script>
```

## Quick Start

### Basic Map

```html
<div blx-el="mapbox" 
     data-mapbox-token="YOUR_MAPBOX_TOKEN"
     data-mapbox-lat="40.7128"
     data-mapbox-lng="-74.0060"
     data-mapbox-zoom="10"
     style="width: 100%; height: 500px;">
</div>
```

### Globe Projection

```html
<div blx-el="mapbox" 
     data-mapbox-token="YOUR_MAPBOX_TOKEN"
     data-mapbox-projection="globe"
     data-mapbox-zoom="1"
     style="width: 100%; height: 500px;">
</div>
```

### Custom Style with Hidden Labels

```html
<div blx-el="mapbox" 
     data-mapbox-token="YOUR_MAPBOX_TOKEN"
     data-mapbox-style="mapbox://styles/mapbox/dark-v11"
     data-mapbox-hide-cities
     data-mapbox-hide-borders
     data-mapbox-min-zoom="2"
     data-mapbox-max-zoom="15"
     style="width: 100%; height: 500px;">
</div>
```

## Map Configuration

### Required Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `blx-el="mapbox"` | Identifies the map container | - |
| `data-mapbox-token` | Your Mapbox access token | `pk.eyJ1...` |

### Optional Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-mapbox-style` | `mapbox://styles/mapbox/streets-v12` | Mapbox style URL |
| `data-mapbox-projection` | `mercator` | Map projection: `mercator` or `globe` |
| `data-mapbox-lat` | `0` | Initial latitude |
| `data-mapbox-lng` | `0` | Initial longitude |
| `data-mapbox-zoom` | `2` | Initial zoom level |
| `data-mapbox-min-zoom` | `0` | Minimum zoom level |
| `data-mapbox-max-zoom` | `22` | Maximum zoom level |
| `data-mapbox-hide-cities` | - | Hide city and place labels |
| `data-mapbox-hide-borders` | - | Hide country borders |
| `data-mapbox-no-controls` | - | Hide navigation controls |
| `data-mapbox-no-fit` | - | Don't auto-fit to markers |
| `blx-id` | `default` | ID to link map with collection items |

### Map Styles

Mapbox provides several built-in styles:

- `mapbox://styles/mapbox/streets-v12` (default)
- `mapbox://styles/mapbox/outdoors-v12`
- `mapbox://styles/mapbox/light-v11`
- `mapbox://styles/mapbox/dark-v11`
- `mapbox://styles/mapbox/satellite-v9`
- `mapbox://styles/mapbox/satellite-streets-v12`
- `mapbox://styles/mapbox/navigation-day-v1`
- `mapbox://styles/mapbox/navigation-night-v1`

You can also create custom styles in [Mapbox Studio](https://studio.mapbox.com/).

## Webflow Collection Integration

### Basic Collection Setup

Add collection items with latitude and longitude data:

```html
<!-- Map container -->
<div blx-el="mapbox" 
     blx-id="locations"
     data-mapbox-token="YOUR_TOKEN"
     style="width: 100%; height: 500px;">
</div>

<!-- Collection list (can be anywhere on the page) -->
<div class="collection-list">
  <!-- Collection item (automatically hidden with CSS) -->
  <div blx-el="mapbox-item" 
       blx-id="locations"
       data-lat="40.7128"
       data-lng="-74.0060">
    
    <!-- Custom marker (optional) -->
    <div blx-el="mapbox-marker" class="custom-marker">
      📍 Location
    </div>
    
    <!-- Active marker state (optional) -->
    <div blx-el="mapbox-marker-active" class="custom-marker-active">
      📍 Location (Active)
    </div>
    
    <!-- Popup content (optional) -->
    <div blx-el="mapbox-popup">
      <h3>Location Name</h3>
      <p>Description here</p>
    </div>
  </div>
</div>
```

### Collection Item Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `blx-el="mapbox-item"` | Yes | Identifies a collection item |
| `data-lat` | Yes | Latitude coordinate |
| `data-lng` | Yes | Longitude coordinate |
| `blx-id` | No | Links to specific map (matches map's `blx-id`) |

### Marker Elements

| Element | Description |
|---------|-------------|
| `[blx-el="mapbox-marker"]` | Custom marker HTML (default state) |
| `[blx-el="mapbox-marker-active"]` | Custom marker HTML (active/clicked state) |
| `[blx-el="mapbox-popup"]` | Popup content shown when marker is clicked |

## Custom Markers and Popups

### Default Markers

If you don't provide custom markers, the package uses a default blue pin:

```html
<div blx-el="mapbox-item" data-lat="40.7128" data-lng="-74.0060">
  <!-- No marker = default blue pin -->
</div>
```

### Custom Marker HTML

Create custom markers with any HTML:

```html
<div blx-el="mapbox-item" data-lat="40.7128" data-lng="-74.0060">
  <div blx-el="mapbox-marker">
    <img src="custom-pin.png" alt="marker" width="40">
  </div>
</div>
```

### Custom Marker with Webflow CMS

Use Webflow's dynamic content:

```html
<div blx-el="mapbox-item" 
     data-lat="[Latitude Field]" 
     data-lng="[Longitude Field]">
  
  <div blx-el="mapbox-marker" class="marker">
    <img src="[Marker Image]" alt="marker">
    <div class="marker-label">[Location Name]</div>
  </div>
  
  <div blx-el="mapbox-popup">
    <h3>[Location Name]</h3>
    <img src="[Thumbnail]" alt="thumbnail">
    <p>[Description]</p>
    <a href="[Link]">Learn More</a>
  </div>
</div>
```

## Active Marker States

### Basic Active State

Without custom active marker, the package adds `blx-mapbox-marker-active` class:

```css
.blx-mapbox-marker-active {
  transform: scale(1.2);
  z-index: 100;
}
```

### Custom Active Marker

Provide different HTML for active state:

```html
<div blx-el="mapbox-item" data-lat="40.7128" data-lng="-74.0060">
  <!-- Default state -->
  <div blx-el="mapbox-marker">
    <div class="marker">📍</div>
  </div>
  
  <!-- Active state (shown when clicked) -->
  <div blx-el="mapbox-marker-active">
    <div class="marker-active">📍✨</div>
  </div>
</div>
```

### Active State Events

Listen for marker activation:

```javascript
document.addEventListener('blx-mapbox-marker-active', (e) => {
  console.log('Marker activated:', e.detail.marker);
  console.log('Collection item:', e.detail.item);
});

document.addEventListener('blx-mapbox-marker-inactive', (e) => {
  console.log('Marker deactivated:', e.detail.marker);
});
```

## Styling

### Hide Collection Items

Collection items should be hidden with CSS (they're only used as data sources):

```css
[blx-el="mapbox-item"] {
  display: none;
}
```

### Style Markers

```css
[blx-el="mapbox-marker"] {
  transition: all 0.3s ease;
}

[blx-el="mapbox-marker"]:hover {
  transform: translateY(-5px);
}

.blx-mapbox-marker-active {
  transform: scale(1.2);
  z-index: 100;
}
```

### Style Popups

```css
.mapboxgl-popup-content {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.mapboxgl-popup-content h3 {
  margin-top: 0;
}

.mapboxgl-popup-close-button {
  font-size: 24px;
  padding: 8px;
}
```

## Multiple Maps

You can have multiple maps on the same page using `blx-id`:

```html
<!-- Map 1 -->
<div blx-el="mapbox" 
     blx-id="offices"
     data-mapbox-token="YOUR_TOKEN"
     style="height: 400px;">
</div>

<!-- Collection for Map 1 -->
<div blx-el="mapbox-item" blx-id="offices" data-lat="40.7128" data-lng="-74.0060">
  <div blx-el="mapbox-popup"><h3>NYC Office</h3></div>
</div>

<!-- Map 2 -->
<div blx-el="mapbox" 
     blx-id="stores"
     data-mapbox-token="YOUR_TOKEN"
     style="height: 400px;">
</div>

<!-- Collection for Map 2 -->
<div blx-el="mapbox-item" blx-id="stores" data-lat="34.0522" data-lng="-118.2437">
  <div blx-el="mapbox-popup"><h3>LA Store</h3></div>
</div>
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
  <style>
    /* Hide collection items */
    [blx-el="mapbox-item"] {
      display: none;
    }
    
    /* Custom marker styling */
    .custom-marker {
      background: white;
      padding: 8px 12px;
      border-radius: 20px;
      border: 2px solid #3b82f6;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .custom-marker-active {
      background: #3b82f6;
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      border: 2px solid #1d4ed8;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <!-- Map -->
  <div blx-el="mapbox" 
       blx-id="locations"
       data-mapbox-token="YOUR_MAPBOX_TOKEN"
       data-mapbox-style="mapbox://styles/mapbox/light-v11"
       data-mapbox-projection="globe"
       data-mapbox-hide-cities
       data-mapbox-min-zoom="1"
       data-mapbox-max-zoom="15"
       style="width: 100%; height: 600px;">
  </div>

  <!-- Collection Items -->
  <div blx-el="mapbox-item" 
       blx-id="locations"
       data-lat="40.7128" 
       data-lng="-74.0060">
    <div blx-el="mapbox-marker" class="custom-marker">
      NYC
    </div>
    <div blx-el="mapbox-marker-active" class="custom-marker-active">
      NYC ✓
    </div>
    <div blx-el="mapbox-popup">
      <h3>New York City</h3>
      <p>Our headquarters location</p>
    </div>
  </div>

  <div blx-el="mapbox-item" 
       blx-id="locations"
       data-lat="51.5074" 
       data-lng="-0.1278">
    <div blx-el="mapbox-marker" class="custom-marker">
      LON
    </div>
    <div blx-el="mapbox-marker-active" class="custom-marker-active">
      LON ✓
    </div>
    <div blx-el="mapbox-popup">
      <h3>London</h3>
      <p>European office</p>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/mapbox/index.min.js"></script>
</body>
</html>
```

## Webflow Integration Guide

### Step 1: Add Mapbox Scripts

In Webflow Project Settings → Custom Code → Footer Code:

```html
<link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"></script>
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/mapbox/index.min.js"></script>
```

### Step 2: Create Map Container

Add a div block and set custom attributes:
- `blx-el` = `mapbox`
- `blx-id` = `my-map` (or any identifier)
- `data-mapbox-token` = Your Mapbox token
- Set height in style panel (e.g., 500px)

### Step 3: Set Up CMS Collection

Add fields to your collection:
- `Latitude` (Number field)
- `Longitude` (Number field)
- Any other fields for popup content

### Step 4: Add Collection List

1. Add a Collection List
2. Set custom attribute on Collection Item:
   - `blx-el` = `mapbox-item`
   - `blx-id` = `my-map` (must match map's blx-id)

3. Bind data attributes to CMS fields:
   - `data-lat` = [Latitude]
   - `data-lng` = [Longitude]

### Step 5: Design Marker and Popup

Inside the Collection Item:
1. Add a div for the marker with `blx-el="mapbox-marker"`
2. Add a div for the popup with `blx-el="mapbox-popup"`
3. Optionally add `blx-el="mapbox-marker-active"` for active state
4. Use CMS fields to populate content dynamically

### Step 6: Hide Collection List

In the Designer or with CSS:
```css
[blx-el="mapbox-item"] {
  display: none;
}
```

## Getting Your Mapbox Token

1. Sign up at [mapbox.com](https://www.mapbox.com/)
2. Go to [Account → Tokens](https://account.mapbox.com/access-tokens/)
3. Create a new token or copy your default public token
4. Token should start with `pk.`

## Browser Support

Works in all modern browsers that support:
- Mapbox GL JS v3.x
- ES6 features
- Custom Elements

## Common Issues

**Map not showing?**
- Check that Mapbox GL JS is loaded before BLX Mapbox
- Verify your access token is valid
- Ensure container has explicit height in CSS
- Check browser console for errors

**Markers not appearing?**
- Verify `data-lat` and `data-lng` have valid numbers
- Check that `blx-id` matches between map and items
- Ensure collection items are in the DOM when script runs

**Custom markers not working?**
- Check that marker elements are inside `[blx-el="mapbox-item"]`
- Verify marker elements have correct `blx-el` attributes

## API Access

Access map instances programmatically:

```javascript
// Get map container
const container = document.querySelector('[blx-el="mapbox"]');

// Access Mapbox map instance
const map = container._blxMapInstance;

// Use Mapbox API
map.flyTo({ center: [-74.006, 40.7128], zoom: 12 });
```

## Advanced Customization

### Custom Map Events

```javascript
const container = document.querySelector('[blx-el="mapbox"]');
const map = container._blxMapInstance;

map.on('click', (e) => {
  console.log('Map clicked:', e.lngLat);
});
```

### Dynamic Marker Updates

```javascript
// Re-initialize to process new collection items
window.BLX_MAPBOX();
```

## License

Part of the BLX library. See main repository for license information.
