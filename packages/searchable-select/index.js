// BLX Searchable Select
// Version: 1.0.0

(() => {

  let panelCount = 0;
  const roots = new Set();
  const openRoots = new Set();
  const instances = new WeakMap();
  let hasDocumentClickListener = false;
  let hasInitialised = false;
  let hasScheduledBootstrap = false;

  // Reusable function — exposed globally
  window.BLX_SEARCHABLE_SELECT = function () {
    hasInitialised = true;

    const selects = Array.from(document.querySelectorAll('[blx-el="searchable-select"]'));
    const standalonePanels = Array.from(document.querySelectorAll('[blx-el="searchable-select-panel"]'))
      .filter((panel) => !panel.closest('[blx-el="searchable-select"]'));
    if (!selects.length && !standalonePanels.length) return;

    bindDocumentClickListener();
    selects.forEach((select) => initSelect(select));
    standalonePanels.forEach((panel) => initSelect(panel, true));
  };

  function initSelect(container, standalone) {
    if (instances.has(container)) {
      instances.get(container).sync();
      return;
    }

    const root = standalone ? null : container;
    const panel = standalone
      ? container
      : container.querySelector('[blx-el="searchable-select-panel"]');
    const trigger = standalone
      ? null
      : container.querySelector('[blx-el="searchable-select-trigger"]');
    const scope = standalone ? panel : container;
    const options = Array.from(panel?.querySelectorAll('[blx-el="searchable-select-option"]') || []);
    if ((!standalone && (!trigger || !panel)) || !options.length) return;

    const labelEl = standalone
      ? scope.querySelector('[blx-el="searchable-select-label"]')
      : getLabelElement(container, trigger);
    if (labelEl && !container.dataset.blxSelectInitialLabel) {
      container.dataset.blxSelectInitialLabel = labelEl.textContent.trim() || 'Select option';
    }
    const countEl = scope.querySelector('[blx-el="searchable-select-count"]');
    const clearEl = scope.querySelector('[blx-el="searchable-select-clear"]');
    const searchInput = scope.querySelector('[blx-el="searchable-select-search"]');
    const emptyEl = scope.querySelector('[blx-el="searchable-select-empty"]');
    const valueInput = scope.querySelector('[blx-el="searchable-select-input"]');
    const listbox = panel.querySelector('[blx-el="searchable-select-options"]') || panel;
    const config = getConfig(container, labelEl, searchInput, countEl, options, standalone);

    if (!panel.id) {
      panel.id = `blx-searchable-select-panel-${++panelCount}`;
    }

    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', 'false');
    }
    listbox.setAttribute('role', 'listbox');
    if (config.multiple) {
      listbox.setAttribute('aria-multiselectable', 'true');
    } else {
      listbox.removeAttribute('aria-multiselectable');
    }

    if (!searchInput?.getAttribute('placeholder')) {
      searchInput?.setAttribute('placeholder', config.searchPlaceholder);
    }
    if (emptyEl && !emptyEl.textContent.trim()) {
      emptyEl.textContent = config.emptyText;
    }

    if (!standalone) {
      panel.hidden = true;
      root.classList.remove(config.openClass);
    }

    const sync = () => {
      syncState(container, config, options, labelEl, countEl, clearEl, emptyEl, valueInput, searchInput);
    };
    const close = () => {
      closePanel(root, trigger, panel, searchInput, config);
    };

    if (root) {
      roots.add(root);
    }
    instances.set(container, { sync, close });

    options.forEach((option) => setupOption(option, config, options, sync, close));
    sync();

    if (trigger) {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        if (isOpen(root, config)) {
          close();
          return;
        }

        sync();
        openPanel(root, trigger, panel, searchInput, config, options);
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (!isOpen(root, config)) {
          sync();
          openPanel(root, trigger, panel, searchInput, config, options);
        }
        focusFirstOption(options, searchInput);
      });
    }

    searchInput?.addEventListener('input', () => {
      filterOptions(options, searchInput.value, config, emptyEl);
    });

    clearEl?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearSelection(options);
      sync();
    });

    options.forEach((option) => {
      const input = getOptionInput(option);

      if (input) {
        input.addEventListener('change', () => {
          if (isDisabled(option)) return;

          if (!config.multiple && input.checked) {
            options.forEach((candidate) => {
              if (candidate !== option) setOptionSelected(candidate, false);
            });
          }

          sync();
          if (input.checked && config.closeOnSelect) {
            close();
          }
        });
      }
    });

    if (trigger) {
      panel.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (!isEscapeSurface(event.target, panel, searchInput, options)) return;
        close();
        trigger.focus();
      });
    }
  }

  function getConfig(container, labelEl, searchInput, countEl, options, standalone) {
    const props = getProps(container);
    const initialLabel = container.dataset.blxSelectInitialLabel || labelEl?.textContent.trim() || '';
    const explicitMultiple = container.dataset.blxSelectMultiple;
    const hasCheckboxes = options.some((option) => getOptionInput(option)?.type === 'checkbox');
    const multiple = explicitMultiple
      ? explicitMultiple === 'true'
      : props.includes('multiple') || hasCheckboxes;

    return {
      multiple,
      placeholder: container.dataset.blxSelectPlaceholder || initialLabel,
      multipleLabel: container.dataset.blxSelectMultiLabel || container.dataset.blxSelectPlaceholder || initialLabel,
      summary: container.dataset.blxSelectSummary || (countEl ? 'count' : 'labels'),
      separator: container.dataset.blxSelectSeparator || ', ',
      valueSeparator: container.dataset.blxSelectValueSeparator || ',',
      searchPlaceholder: container.dataset.blxSelectSearchPlaceholder || searchInput?.getAttribute('placeholder') || 'Search...',
      searchMode: container.dataset.blxSelectSearchMode === 'starts-with' ? 'starts-with' : 'contains',
      emptyText: container.dataset.blxSelectEmptyText || 'No results found',
      closeOnSelect: container.dataset.blxSelectCloseOnSelect
        ? container.dataset.blxSelectCloseOnSelect === 'true'
        : !multiple || props.includes('close-on-select'),
      keepSearch: standalone || container.dataset.blxSelectKeepSearch === 'true' || props.includes('keep-search'),
      maxLabels: int(container.dataset.blxSelectMaxLabels, 0),
      openClass: container.dataset.blxSelectOpenClass || 'is-open',
      selectedClass: container.dataset.blxSelectSelectedClass || 'is-selected',
      hiddenClass: container.dataset.blxSelectHiddenClass || 'is-hidden',
      disabledClass: container.dataset.blxSelectDisabledClass || 'is-disabled',
    };
  }

  function setupOption(option, config, options, sync, close) {
    const input = getOptionInput(option);

    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', String(isOptionSelected(option)));
    option.classList.toggle(config.selectedClass, isOptionSelected(option));
    option.classList.toggle(config.disabledClass, isDisabled(option));

    if (!input && !option.hasAttribute('tabindex')) {
      option.tabIndex = 0;
    }

    if (!input) {
      option.addEventListener('click', (event) => {
        if (!isNativeInteractive(option)) {
          event.preventDefault();
        }
        activateOption(option, config, options, sync, close);
      });
    }

    const keyTarget = input || option;
    keyTarget.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        focusRelativeOption(options, option, event.key === 'ArrowDown' ? 1 : -1);
      }
    });

    if (!input && !isNativeInteractive(option)) {
      option.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activateOption(option, config, options, sync, close);
      });
    }
  }

  function activateOption(option, config, options, sync, close) {
    if (isDisabled(option)) return;

    if (config.multiple) {
      setOptionSelected(option, !isOptionSelected(option));
    } else {
      options.forEach((candidate) => {
        setOptionSelected(candidate, candidate === option);
      });
    }

    sync();
    if (!config.multiple && config.closeOnSelect) {
      close();
    }
  }

  function syncState(root, config, options, labelEl, countEl, clearEl, emptyEl, valueInput, searchInput) {
    const selected = options.filter(isOptionSelected);
    const labels = selected.map(getOptionLabel);
    const values = selected.map(getOptionValue);

    if (labelEl) {
      labelEl.textContent = getSummaryLabel(config, labels);
    }

    if (countEl) {
      countEl.textContent = String(selected.length);
      countEl.hidden = selected.length === 0;
    }

    clearEl?.toggleAttribute('hidden', selected.length === 0);

    if (valueInput) {
      valueInput.value = config.multiple ? values.join(config.valueSeparator) : (values[0] || '');
    }

    options.forEach((option) => {
      const selectedState = isOptionSelected(option);
      option.classList.toggle(config.selectedClass, selectedState);
      option.classList.toggle(config.disabledClass, isDisabled(option));
      option.setAttribute('aria-selected', String(selectedState));
    });

    filterOptions(options, searchInput?.value || '', config, emptyEl);
    root.setAttribute('data-blx-select-selected-count', String(selected.length));
  }

  function getSummaryLabel(config, labels) {
    if (!labels.length) return config.placeholder;
    if (!config.multiple) return labels[0];

    if (config.summary === 'count') {
      return config.multipleLabel;
    }

    if (config.summary === 'first') {
      return labels.length === 1 ? labels[0] : `${labels[0]} +${labels.length - 1}`;
    }

    if (config.maxLabels > 0 && labels.length > config.maxLabels) {
      return `${labels.slice(0, config.maxLabels).join(config.separator)} +${labels.length - config.maxLabels}`;
    }

    return labels.join(config.separator);
  }

  function filterOptions(options, query, config, emptyEl) {
    const term = query.trim().toLowerCase();
    let visibleCount = 0;

    options.forEach((option) => {
      const haystack = (option.dataset.blxSelectSearchText || getOptionLabel(option)).toLowerCase();
      const match = !term || (config.searchMode === 'starts-with' ? haystack.startsWith(term) : haystack.includes(term));

      option.hidden = !match;
      option.classList.toggle(config.hiddenClass, !match);
      if (match) visibleCount += 1;
    });

    if (emptyEl) {
      emptyEl.hidden = visibleCount !== 0;
      if (!emptyEl.textContent.trim()) emptyEl.textContent = config.emptyText;
    }
  }

  function openPanel(root, trigger, panel, searchInput, config, options) {
    root.classList.add(config.openClass);
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openRoots.add(root);

    const nextFrame = window.requestAnimationFrame || function (callback) {
      setTimeout(callback, 0);
    };
    nextFrame(() => {
      if (searchInput) {
        searchInput.focus();
      } else {
        focusFirstOption(options);
      }
    });
  }

  function closePanel(root, trigger, panel, searchInput, config) {
    if (!isOpen(root, config) && panel.hidden) return;

    root.classList.remove(config.openClass);
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    openRoots.delete(root);

    if (searchInput && !config.keepSearch && searchInput.value) {
      searchInput.value = '';
      filterOptions(Array.from(root.querySelectorAll('[blx-el="searchable-select-option"]')), '', config, root.querySelector('[blx-el="searchable-select-empty"]'));
    }
  }

  function clearSelection(options) {
    options.forEach((option) => setOptionSelected(option, false));
  }

  function focusFirstOption(options, searchInput) {
    const firstVisible = options.find((option) => !option.hidden && !isDisabled(option));
    if (!firstVisible) {
      searchInput?.focus();
      return;
    }

    const input = getOptionInput(firstVisible);
    if (input && !input.disabled) {
      input.focus();
    } else {
      firstVisible.focus();
    }
  }

  function focusRelativeOption(options, currentOption, direction) {
    const visible = options.filter((option) => !option.hidden && !isDisabled(option));
    if (!visible.length) return;

    const index = visible.indexOf(currentOption);
    const nextIndex = index === -1
      ? 0
      : (index + direction + visible.length) % visible.length;
    const target = visible[nextIndex];
    const input = getOptionInput(target);

    if (input && !input.disabled) {
      input.focus();
    } else {
      target.focus();
    }
  }

  function getOptionInput(option) {
    return option.querySelector('input[type="checkbox"], input[type="radio"]');
  }

  function getLabelElement(root, trigger) {
    const existing = root.querySelector('[blx-el="searchable-select-label"]');
    if (existing) return existing;

    const label = document.createElement('span');
    label.setAttribute('blx-el', 'searchable-select-label');

    const textNode = Array.from(trigger.childNodes).find((node) => {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
    });

    label.textContent = root.dataset.blxSelectPlaceholder || textNode?.textContent.trim() || 'Select option';
    if (textNode) textNode.textContent = '';

    trigger.insertBefore(label, trigger.firstChild);
    return label;
  }

  function getOptionLabel(option) {
    if (option.dataset.label) return option.dataset.label;

    const explicitLabel = option.querySelector('[blx-el="searchable-select-option-label"], [data-blx-select-label]');
    if (explicitLabel) {
      return explicitLabel.textContent.trim().replace(/\s+/g, ' ');
    }

    const clone = option.cloneNode(true);
    clone.querySelectorAll('input').forEach((input) => input.remove());
    return clone.textContent.trim().replace(/\s+/g, ' ');
  }

  function getOptionValue(option) {
    const input = getOptionInput(option);
    return option.dataset.value || input?.value || getOptionLabel(option);
  }

  function isOptionSelected(option) {
    const input = getOptionInput(option);
    if (input) return input.checked;
    return option.dataset.selected === 'true' || option.getAttribute('aria-selected') === 'true';
  }

  function setOptionSelected(option, selected) {
    if (isDisabled(option)) return;

    const input = getOptionInput(option);
    if (input) {
      input.checked = selected;
      return;
    }

    option.dataset.selected = String(selected);
    option.setAttribute('aria-selected', String(selected));
  }

  function isDisabled(option) {
    const input = getOptionInput(option);
    return !!(input?.disabled || option.dataset.disabled === 'true' || option.getAttribute('aria-disabled') === 'true');
  }

  function isNativeInteractive(option) {
    return ['A', 'BUTTON', 'INPUT', 'LABEL'].includes(option.tagName);
  }

  function bindDocumentClickListener() {
    if (hasDocumentClickListener) return;
    hasDocumentClickListener = true;

    document.addEventListener('click', (event) => {
      const activeRoot = event.target.closest?.('[blx-el="searchable-select"]') || null;

      openRoots.forEach((root) => {
        if (!root.isConnected) {
          roots.delete(root);
          openRoots.delete(root);
          instances.delete(root);
          return;
        }

        if (root !== activeRoot) {
          instances.get(root)?.close();
        }
      });
    });
  }

  function getProps(el) {
    return (el.getAttribute('blx-prop') || '')
      .split(/[\s,]+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
  }

  function int(value, fallback) {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  function isOpen(root, config) {
    return root.classList.contains(config.openClass);
  }

  function isEscapeSurface(target, panel, searchInput, options) {
    if (target === panel || target === searchInput) return true;
    return options.some((option) => option === target || option.contains(target));
  }

  function bootstrap() {
    if (hasInitialised || hasScheduledBootstrap) return;
    hasScheduledBootstrap = true;

    setTimeout(() => {
      hasScheduledBootstrap = false;
      if (hasInitialised) return;
      window.BLX_SEARCHABLE_SELECT();
    }, 0);
  }

  // Run once on initial page load (even if script injected late)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
