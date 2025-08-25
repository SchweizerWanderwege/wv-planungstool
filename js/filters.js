// js/filters.js

export function initFilters(source, layer) {
  // HTML-Container für Filter
  const filterContainer = document.getElementById('filters');
  if (!filterContainer) return;

  source.once('change', () => {
    if (source.getState() !== 'ready') return;

    const features = source.getFeatures();
    if (!features.length) return;

    // ---- Attribute definieren ----
    const filtersConfig = [
      { attr: 'category', type: 'string', options: [...new Set(features.map(f => f.get('category')))] },
      { attr: 'year_of_publication', type: 'string', options: [...new Set(features.map(f => f.get('year_of_publication')))].sort() },
      { attr: 'physical_demand', type: 'string', options: [...new Set(features.map(f => f.get('physical_demand')))] },
      { attr: 'active', type: 'boolean' },
      { attr: 'listed', type: 'boolean' },
      { attr: 'hiking_time', type: 'number' },
      { attr: 'distance', type: 'number' }
    ];

    const inputs = {};

    filtersConfig.forEach(cfg => {
      const label = document.createElement('label');
      label.textContent = cfg.attr;
      label.style.display = 'block';
      label.style.marginTop = '10px';
      filterContainer.appendChild(label);

      let input;

      if (cfg.type === 'string') {
        input = document.createElement('select');
        input.innerHTML = `<option value="">Alle</option>` +
          cfg.options.map(v => `<option value="${v}">${v}</option>`).join('');
      } else if (cfg.type === 'boolean') {
        input = document.createElement('input');
        input.type = 'checkbox';
      } else if (cfg.type === 'number') {
        const values = features.map(f => f.get(cfg.attr)).filter(v => v != null);
        const min = Math.min(...values);
        const max = Math.max(...values);

        input = document.createElement('input');
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.value = max;
        input.style.width = '100%';

        // Anzeige für aktuellen Wert
        const valLabel = document.createElement('span');
        valLabel.textContent = max;
        input.addEventListener('input', () => valLabel.textContent = input.value);
        label.appendChild(document.createElement('br'));
        label.appendChild(valLabel);
      }

      input.addEventListener('change', () => applyFilters(source, layer, inputs, filtersConfig));
      filterContainer.appendChild(input);
      inputs[cfg.attr] = input;
    });
  });
}

function applyFilters(source, layer, inputs, config) {
  const features = source.getFeatures();

  features.forEach(f => {
    let visible = true;

    config.forEach(cfg => {
      const val = inputs[cfg.attr].value;
      const featureVal = f.get(cfg.attr);

      if (cfg.type === 'string' && val && featureVal !== val) visible = false;
      if (cfg.type === 'boolean') {
        const checked = inputs[cfg.attr].checked;
        if (checked && !featureVal) visible = false;
      }
      if (cfg.type === 'number' && val && featureVal > Number(val)) visible = false;
    });

    f.setStyle(visible ? layer.getStyle() : null);
  });
}
