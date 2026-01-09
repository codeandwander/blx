# BLX Package Structure Guide

This document defines the standard structure and format that all BLX packages should follow to maintain consistency across the library.

## Standard Package Format

Every package in the `packages/` directory should follow this exact structure:

```javascript
// BLX [Package Name]
// Version: X.Y.Z

(() => {

  // Reusable function — exposed globally
  window.BLX_[UPPERCASE_NAME] = function () {
    // Package initialization and logic
  };

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.BLX_[UPPERCASE_NAME]);
  } else {
    window.BLX_[UPPERCASE_NAME]();
  }

})();
```

## Naming Conventions

### File Header
- **Line 1**: `// BLX [Package Name]` - Use proper case for the package name
- **Line 2**: `// Version: X.Y.Z` - Always use "Version:" prefix with semantic versioning

### Global Function Name
- Format: `window.BLX_[UPPERCASE]`
- Examples:
  - TOC → `window.BLX_TOC`
  - Inline SVG → `window.BLX_INLINE_SVG`
  - Modal → `window.BLX_MODAL`

### Function Comment
- Always include: `// Reusable function — exposed globally` before the function definition

## Initialization Pattern

All packages must use the same initialization pattern to ensure they work correctly whether the script is loaded before or after the DOM is ready:

```javascript
// Run once on initial page load (even if script injected late)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.BLX_[FUNCTION_NAME]);
} else {
  window.BLX_[FUNCTION_NAME]();
}
```

### What NOT to do:
- ❌ Don't use initialization guard flags (e.g., `__BLX_MODAL_INITIALISED__`)
- ❌ Don't use only `DOMContentLoaded` without readyState check
- ❌ Don't use nested namespaces (e.g., `window.BLX.packageName`)
- ❌ Don't include file paths in comments

## Directory Structure

Each package should have its own directory under `packages/`:

```
packages/
├── package-name/
│   └── index.js
├── another-package/
│   └── index.js
└── index.js (global loader)
```

## Global Loader Integration

When adding a package to the global loader (`packages/index.js`), follow this pattern:

```javascript
// [Package Name]
if (document.querySelector('[blx-el="package-selector"]')) {
  window.BLX_PACKAGE_NAME?.();
}
```

Key points:
- Add a comment with the package name
- Use optional chaining (`?.()`) for safe function calls
- Check for the package's primary selector before calling

## Checklist for New Packages

When creating a new package, ensure:

- [ ] Header follows format: `// BLX [Name]` + `// Version: X.Y.Z`
- [ ] Function uses `window.BLX_[UPPERCASE]` naming
- [ ] Includes "Reusable function — exposed globally" comment
- [ ] Uses readyState check initialization pattern
- [ ] No initialization guard flags
- [ ] Wrapped in IIFE `(() => { ... })()`
- [ ] Added to global loader with optional chaining
- [ ] Proper indentation (2 spaces)

## Examples

See existing packages for reference:
- `packages/toc/index.js`
- `packages/inline-svg/index.js`
- `packages/modal/index.js`
