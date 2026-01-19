// BLX Mapbox
// Version: 1.0.0

(() => {

  // Reusable function — exposed globally
  window.BLX_MAPBOX = function () {
    const mapContainers = document.querySelectorAll('[blx-el="mapbox"]');
    if (!mapContainers.length) return;

    // Check if Mapbox GL JS is loaded
    if (typeof mapboxgl === 'undefined') {
      console.error('[BLX_MAPBOX] Mapbox GL JS is not loaded. Please include: <script src="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"></script>');
      return;
    }

    mapContainers.forEach(container => {
      const mapId = container.getAttribute('blx-id') || 'default';
      
      // Get configuration from data attributes
      const accessToken = container.getAttribute('data-mapbox-token');
      const styleUrl = container.getAttribute('data-mapbox-style') || 'mapbox://styles/mapbox/streets-v12';
      const projection = container.getAttribute('data-mapbox-projection') || 'mercator'; // 'mercator' or 'globe'
      const minZoom = parseFloat(container.getAttribute('data-mapbox-min-zoom')) || 0;
      const maxZoom = parseFloat(container.getAttribute('data-mapbox-max-zoom')) || 22;
      const defaultZoom = parseFloat(container.getAttribute('data-mapbox-zoom')) || 2;
      const defaultLat = parseFloat(container.getAttribute('data-mapbox-lat')) || 0;
      const defaultLng = parseFloat(container.getAttribute('data-mapbox-lng')) || 0;
      const hideCityNames = container.hasAttribute('data-mapbox-hide-cities');
      const hideBorders = container.hasAttribute('data-mapbox-hide-borders');

      if (!accessToken) {
        console.error('[BLX_MAPBOX] Missing data-mapbox-token attribute');
        return;
      }

      mapboxgl.accessToken = accessToken;

      // Initialize map
      const map = new mapboxgl.Map({
        container: container,
        style: styleUrl,
        projection: projection,
        center: [defaultLng, defaultLat],
        zoom: defaultZoom,
        minZoom: minZoom,
        maxZoom: maxZoom
      });

      // Store map instance for later access
      container._blxMapInstance = map;

      // Apply custom style modifications after map loads
      map.on('load', () => {
        
        // Hide city names
        if (hideCityNames) {
          const layers = map.getStyle().layers;
          layers.forEach(layer => {
            if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
              // Check if it's a place label (city, town, village, etc.)
              if (layer.id.includes('place') || layer.id.includes('settlement') || layer.id.includes('label')) {
                map.setLayoutProperty(layer.id, 'visibility', 'none');
              }
            }
          });
        }

        // Hide borders
        if (hideBorders) {
          const layers = map.getStyle().layers;
          layers.forEach(layer => {
            if (layer.id.includes('admin') || layer.id.includes('boundary') || layer.id.includes('border')) {
              map.setLayoutProperty(layer.id, 'visibility', 'none');
            }
          });
        }

        // Process collection items
        processCollectionItems(map, container, mapId);
      });

      // Add navigation controls
      const showControls = !container.hasAttribute('data-mapbox-no-controls');
      if (showControls) {
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
    });

    // Helper function to create click handler for marker elements
    function createMarkerClickHandler(marker) {
      return () => {
        if (marker.getPopup()) {
          marker.togglePopup();
        }
      };
    }

    // Process Webflow collection items for the map
    function processCollectionItems(map, container, mapId) {
      // Find collection items associated with this map
      const collectionSelector = mapId === 'default' 
        ? '[blx-el="mapbox-item"]'
        : `[blx-el="mapbox-item"][blx-id="${mapId}"]`;
      
      const items = document.querySelectorAll(collectionSelector);
      
      if (!items.length) return;

      const markers = [];
      let activeMarker = null;

      items.forEach((item, index) => {
        const lat = parseFloat(item.getAttribute('data-lat'));
        const lng = parseFloat(item.getAttribute('data-lng'));

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('[BLX_MAPBOX] Invalid coordinates for item:', item);
          return;
        }

        // Get custom marker content
        const markerContent = item.querySelector('[blx-el="mapbox-marker"]');
        const popupContent = item.querySelector('[blx-el="mapbox-popup"]');
        const activeMarkerContent = item.querySelector('[blx-el="mapbox-marker-active"]');

        // Create marker element
        let markerEl;
        if (markerContent) {
          markerEl = markerContent.cloneNode(true);
          markerEl.style.cursor = 'pointer';
        } else {
          // Default marker
          markerEl = document.createElement('div');
          markerEl.className = 'blx-mapbox-default-marker';
          markerEl.innerHTML = '<div style="background: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>';
          markerEl.style.cursor = 'pointer';
        }

        // Create marker
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom'
        })
          .setLngLat([lng, lat])
          .addTo(map);

        // Store marker data
        marker._blxData = {
          item: item,
          defaultContent: markerContent ? markerContent.cloneNode(true) : markerEl.cloneNode(true),
          activeContent: activeMarkerContent ? activeMarkerContent.cloneNode(true) : null,
          isActive: false,
          currentElement: markerEl
        };

        markers.push(marker);

        // Create popup if content exists
        if (popupContent) {
          const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            offset: 25,
            maxWidth: '300px'
          }).setHTML(popupContent.innerHTML);

          marker.setPopup(popup);

          // Handle popup open/close for active state
          popup.on('open', () => {
            setActiveMarker(marker, markers);
          });

          popup.on('close', () => {
            clearActiveMarker(marker);
          });
        }

        // Click handler for marker
        const clickHandler = () => {
          if (marker.getPopup()) {
            marker.togglePopup();
          }
          setActiveMarker(marker, markers);
        };
        markerEl.addEventListener('click', clickHandler);
      });

      // Fit map to show all markers
      if (markers.length > 0 && !container.hasAttribute('data-mapbox-no-fit')) {
        const bounds = new mapboxgl.LngLatBounds();
        markers.forEach(marker => {
          bounds.extend(marker.getLngLat());
        });
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    }

    // Set active marker state
    function setActiveMarker(marker, allMarkers) {
      // Clear other active markers
      allMarkers.forEach(m => {
        if (m !== marker && m._blxData.isActive) {
          clearActiveMarker(m);
        }
      });

      // Set this marker as active
      if (!marker._blxData.isActive) {
        marker._blxData.isActive = true;
        
        // Replace marker element with active content if available
        if (marker._blxData.activeContent) {
          const activeEl = marker._blxData.activeContent.cloneNode(true);
          activeEl.style.cursor = 'pointer';
          
          // Re-add click handler
          activeEl.addEventListener('click', createMarkerClickHandler(marker));

          const currentEl = marker._blxData.currentElement;
          currentEl.replaceWith(activeEl);
          marker._blxData.currentElement = activeEl;
        } else {
          // Add active class to current marker
          marker._blxData.currentElement.classList.add('blx-mapbox-marker-active');
        }

        // Dispatch custom event
        const event = new CustomEvent('blx-mapbox-marker-active', {
          detail: { marker, item: marker._blxData.item }
        });
        document.dispatchEvent(event);
      }
    }

    // Clear active marker state
    function clearActiveMarker(marker) {
      if (marker._blxData.isActive) {
        marker._blxData.isActive = false;

        // Replace with default content
        const defaultEl = marker._blxData.defaultContent.cloneNode(true);
        defaultEl.style.cursor = 'pointer';

        // Re-add click handler
        defaultEl.addEventListener('click', createMarkerClickHandler(marker));

        const currentEl = marker._blxData.currentElement;
        currentEl.replaceWith(defaultEl);
        marker._blxData.currentElement = defaultEl;

        // Dispatch custom event
        const event = new CustomEvent('blx-mapbox-marker-inactive', {
          detail: { marker, item: marker._blxData.item }
        });
        document.dispatchEvent(event);
      }
    }
  };

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_MAPBOX);
  } else {
    window.BLX_MAPBOX();
  }

})();
