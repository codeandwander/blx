# BLX Modal

Create accessible modal overlays with focus trapping, scroll locking, responsive behavior, and CSS animation hooks.

## Features

- ♿ Fully accessible (ARIA attributes, focus management)
- 📱 Responsive behavior (overlay on mobile/tablet, inline on desktop)
- 🔒 Optional scroll locking
- ⌨️ Keyboard navigation (Tab trap, Esc to close)
- 🎯 Flexible pairing (group, ID, or proximity-based)
- 🔙 Restores focus on close
- 🪟 Multiple modals supported
- 🎬 CSS animation hooks for enter/leave transitions
- ⚡ ~7.8KB minified

## Installation

**Important**: Modal requires the BLX core utilities.

```html
<!-- Load core utilities first -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/core/index.min.js"></script>

<!-- Then load modal package -->
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@latest/packages/modal/index.min.js"></script>
```

Or pin to a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.8/core/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/codeandwander/blx@v1.0.8/packages/modal/index.min.js"></script>
```

## Usage

### Basic Modal (Group Pattern)

Wrap trigger and modal in a group:

```html
<div blx-el="modal-group">
  <!-- Trigger button -->
  <button blx-el="modal-trigger">Open Modal</button>
  
  <!-- Modal popup -->
  <div blx-el="modal-popup">
    <div class="modal-content">
      <h2>Modal Title</h2>
      <p>Modal content here...</p>
      <button blx-el="modal-close">Close</button>
    </div>
  </div>
</div>
```

### Using IDs (For Distant Elements)

Link trigger to modal with `blx-id`:

```html
<!-- Trigger anywhere -->
<button blx-el="modal-trigger" blx-id="signup-modal">
  Sign Up
</button>

<!-- Modal anywhere else -->
<div blx-el="modal-popup" blx-id="signup-modal">
  <div class="modal-content">
    <h2>Sign Up Form</h2>
    <!-- form here -->
    <button blx-el="modal-close">Close</button>
  </div>
</div>
```

### Responsive Overlay Control

Control when modal shows as overlay vs. inline:

```html
<!-- Overlay everywhere (default) -->
<button blx-el="modal-trigger">Open Modal</button>

<!-- Overlay on tablet and mobile only -->
<button blx-el="modal-trigger" blx-prop="tablet">Open</button>

<!-- Overlay on mobile only -->
<button blx-el="modal-trigger" blx-prop="mobile">Open</button>
```

### Scroll Locking

Prevent background scrolling when modal is open:

```html
<button blx-el="modal-trigger" blx-prop="scroll-lock">
  Open Modal
</button>
```

Combine with responsive control:

```html
<!-- Scroll lock on tablet and mobile -->
<button blx-el="modal-trigger" blx-prop="tablet, scroll-lock">
  Open Modal
</button>
```

## Attributes

### Trigger Attributes

| Attribute | Required | Values | Description |
|-----------|----------|--------|-------------|
| `blx-el="modal-trigger"` | Yes | - | Marks the trigger button |
| `blx-id="[id]"` | No | Any string | Links to modal with matching `blx-id` |
| `blx-prop` | No | `mobile`, `tablet`, `scroll-lock` | Behavior modifiers (comma-separated) |

### Modal Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `blx-el="modal-popup"` | Yes | Marks the modal container |
| `blx-id="[id]"` | No | Links to trigger with matching `blx-id` |

### Close Button

| Attribute | Required | Description |
|-----------|----------|-------------|
| `blx-el="modal-close"` | Yes | Marks close button inside modal |

### Container (Optional)

| Attribute | Required | Description |
|-----------|----------|-------------|
| `blx-el="modal-group"` | No | Groups trigger and modal together |

## Behavior Modifiers (`blx-prop`)

Use comma-separated values on the trigger:

- **`mobile`** - Show as overlay on mobile only (≤767px)
- **`tablet`** - Show as overlay on tablet and mobile (≤991px)
- **`scroll-lock`** - Lock background scrolling when open
- No prop - Show as overlay on all screen sizes

Examples:
```html
<!-- Mobile overlay only -->
<button blx-el="modal-trigger" blx-prop="mobile">Open</button>

<!-- Tablet overlay with scroll lock -->
<button blx-el="modal-trigger" blx-prop="tablet, scroll-lock">Open</button>
```

## Animations

The modal adds CSS class hooks at each stage of the open/close lifecycle so you can define enter and leave animations entirely in CSS — no configuration required.

### Animation Classes

| Class | Applied to | When |
|-------|------------|------|
| `is-entering` | `[blx-el="modal-popup"]` | Added with `is-open` on open; removed when the animation/transition ends |
| `is-leaving` | `[blx-el="modal-popup"]` | Added on close; `is-open` is removed once the animation/transition ends |

The JS detects whether a CSS animation (`animation-duration`) or transition (`transition-duration`) is defined on the modal element. If neither is found it falls back to instant open/close, so existing setups without animations are unaffected.

### CSS Animation Examples

#### Fade backdrop + slide dialog (enter & leave)

```css
/* --- Backdrop --- */
[blx-el="modal-popup"].is-entering {
  animation: blx-backdrop-in 0.25s ease forwards;
}
[blx-el="modal-popup"].is-leaving {
  animation: blx-backdrop-out 0.2s ease forwards;
}

@keyframes blx-backdrop-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes blx-backdrop-out { from { opacity: 1; } to { opacity: 0; } }

/* --- Dialog (inner content box) --- */
[blx-el="modal-popup"].is-entering .modal-content {
  animation: blx-dialog-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
[blx-el="modal-popup"].is-leaving .modal-content {
  animation: blx-dialog-out 0.2s ease forwards;
}

@keyframes blx-dialog-in  { from { opacity: 0; transform: translateY(-20px) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes blx-dialog-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(10px) scale(0.97); } }
```

#### CSS Transition (fade)

```css
[blx-el="modal-popup"] {
  transition: opacity 0.25s ease;
  opacity: 0;
}
[blx-el="modal-popup"].is-open {
  opacity: 1;
}
[blx-el="modal-popup"].is-leaving {
  opacity: 0;
}
```

> **Note**: When using CSS transitions for the **enter** direction, set the default (`is-open`) state as the destination and use the `is-leaving` class to reverse it. The backdrop will fade in automatically as `is-entering` is removed. For full bidirectional control, CSS animations (`@keyframes`) are recommended.

## Pairing Methods

The script pairs triggers with modals in this priority order:

1. **Modal Group**: Trigger finds modal within same `[blx-el="modal-group"]`
2. **ID Matching**: Trigger with `blx-id="x"` finds modal with `blx-id="x"`
3. **Proximity**: Trigger finds next `[blx-el="modal-popup"]` sibling in DOM

## Accessibility Features

### ARIA Attributes
- `role="dialog"` and `aria-modal="true"` added when open
- `aria-hidden` managed automatically
- `aria-controls` links trigger to modal
- `aria-expanded` reflects modal state

### Focus Management
- **On open**: Focus moves to first focusable element in modal
- **On close**: Focus returns to trigger button
- **Tab trap**: Tab key cycles through modal elements only

### Keyboard Support
- **Esc**: Closes modal
- **Tab**: Cycles forward through focusable elements
- **Shift+Tab**: Cycles backward through focusable elements

## Styling

Style your modal with CSS. Common approach:

```css
/* Modal overlay */
[blx-el="modal-popup"] {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Show when open */
[blx-el="modal-popup"].is-open {
  display: flex;
}

/* Modal content box */
.modal-content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

/* Close button */
[blx-el="modal-close"] {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

/* Scroll lock */
html.blx-scroll-lock {
  overflow: hidden;
}
```

## Closing Modals

### Via Close Button
```html
<button blx-el="modal-close">×</button>
```

### Via JavaScript
```javascript
// Find the modal element
const modal = document.querySelector('[blx-el="modal-popup"]');

// Remove the is-open class
modal.classList.remove('is-open');

// Clean up scroll lock if used
document.documentElement.classList.remove('blx-scroll-lock');
document.documentElement.style.overflow = '';
```

### Via Escape Key
Users can press `Esc` to close (built-in).

## Examples

### Login Modal
```html
<div blx-el="modal-group">
  <button blx-el="modal-trigger" blx-prop="scroll-lock">
    Log In
  </button>
  
  <div blx-el="modal-popup">
    <div class="modal-content">
      <button blx-el="modal-close">×</button>
      <h2>Log In</h2>
      <form>
        <input type="email" placeholder="Email">
        <input type="password" placeholder="Password">
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</div>
```

### Video Modal (Mobile Only)
```html
<button blx-el="modal-trigger" blx-id="video" blx-prop="mobile">
  Watch Video
</button>

<div blx-el="modal-popup" blx-id="video">
  <div class="modal-content">
    <button blx-el="modal-close">Close</button>
    <iframe src="https://youtube.com/embed/..." width="100%"></iframe>
  </div>
</div>
```

### Multiple Modals
```html
<!-- Modal 1 -->
<div blx-el="modal-group">
  <button blx-el="modal-trigger">Modal 1</button>
  <div blx-el="modal-popup">
    <div class="modal-content">
      <button blx-el="modal-close">×</button>
      <p>First modal content</p>
    </div>
  </div>
</div>

<!-- Modal 2 -->
<div blx-el="modal-group">
  <button blx-el="modal-trigger">Modal 2</button>
  <div blx-el="modal-popup">
    <div class="modal-content">
      <button blx-el="modal-close">×</button>
      <p>Second modal content</p>
    </div>
  </div>
</div>
```

## Browser Support

Works in all modern browsers. Requires:
- `WeakMap`
- `closest()`, `matches()`
- `classList` API
- BLX core utilities for breakpoint detection

## Tips

- **Use scroll-lock carefully**: Only on modals that should block interaction
- **Design for focus**: Ensure your modal has focusable elements (buttons, links, inputs)
- **Test keyboard**: Navigate using only Tab and Esc to verify accessibility
- **Mobile design**: Consider using `blx-prop="mobile"` or `blx-prop="tablet"` for responsive behavior
- **Backdrop clicks**: Add your own backdrop close handler if desired

## Common Issues

**Modal not opening?**
- Check that core utilities are loaded first
- Verify trigger and modal are properly paired (group, ID, or proximity)
- Check console for warnings

**Focus issues?**
- Ensure modal contains focusable elements
- Check that modal is visible when opened (CSS)

**Scroll lock not working?**
- Add `blx-prop="scroll-lock"` to trigger
- Ensure CSS includes `.blx-scroll-lock` styles

## License

Part of the BLX library. See main repository for license information.
