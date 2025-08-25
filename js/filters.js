// js/filters.js

// Hilfsfunktion: Minuten → hh:mm
function minutesToHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
}

// Globale Funktion
function initFilters(source, layer) {
  const filterContainer = document.getElementById('filters');
  if (!filterContainer) return;

  source.once('change', () => {
    if (source.getState() !== 'ready') return;

    const features = source.getFeatures();
    if (!features.length) return;

    filterContainer.innerHTML = ''; // Clear previous content

    // ---- Config für alle Filter ----
    const filtersConfig = [
      { attr: 'category', type: 'checkbox', options: [...new Set(features.map(f => f.get('category')))] },
      { attr: 'physical_demand', type: 'checkbox', options: [...new Set(features.map(f => f.get('physical_demand')))] },
      { attr: 'active', type: 'boolean' },
      { attr: 'listed', type: 'boolean' },
      { attr: 'hiking_time', type: 'range' },
      { attr: 'distance', type: 'range' }
    ];

    const inputs = {};

    filtersConfig.forEach(cfg => {
      const label = document.createElement('label');
      label.textContent = cfg.attr;
      label.style.display = 'block';
      label.style.marginTop = '10px';
      filterContainer.appendChild(label);

      let inputContainer;

      if (cfg.type === 'checkbox') {
        inputContainer = document.createElement('div');
        inputContainer.className = 'filter-options';
        cfg.options.forEach(opt => {
          const optLabel = document.createElement('label');
          optLabel.style.marginRight = '10px';
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.value = opt;
          cb.addEventListener('change', () => applyFilters(source, layer, inputs, filtersConfig));
          optLabel.appendChild(cb);
          optLabel.appendChild(document.createTextNode(opt));
          inputContainer.appendChild(optLabel);
        });
      } else if (cfg.type === 'boolean') {
        inputContainer = document.createElement('div');
        const trueLabel = document.createElement('label');
        trueLabel.style.marginRight = '10px';
        const cbTrue = document.createElement('input');
        cbTrue.type = 'checkbox';
        cbTrue.value = '1';
        cbTrue.addEventListener('change', () => applyFilters(source, layer, inputs, filtersConfig));
        trueLabel.appendChild(cbTrue);
        trueLabel.appendChild(document.createTextNode('true'));
        const falseLabel = document.createElement('label');
        const cbFalse = document.createElement('input');
        cbFalse.type = 'checkbox';
        cbFalse.value = '0';
        cbFalse.addEventListener('change', () => applyFilters(source, layer, inputs, filtersConfig));
        falseLabel.appendChild(cbFalse);
        falseLabel.appendChild(document.createTextNode('false'));
        inputContainer.appendChild(trueLabel);
        inputContainer.appendChild(falseLabel);
        inputs[cfg.attr] = { true: cbTrue, false: cbFalse };
      } else if (cfg.type === 'range') {
        const values = features.map(f => f.get(cfg.attr)).filter(v => v != null);
        const min = Math.min(...values);
        const max = Math.max(...values);

        const minInput = document.createElement('input');
        minInput.type = 'range';
        minInput.min = min;
        minInput.max = max;
        minInput.value = min;
        minInput.style.width = '45%';

        const maxInput = document.createElement('input');
        maxInput.type = 'range';
        maxInput.min = min;
        maxInput.max = max;
        maxInput.value = max;
        maxInput.style.width = '45%';
        maxInput.style.marginLeft = '5%';

        const minLabel = document.createElement('span');
        const maxLabel = document.createElement('span');

        if (cfg.attr === 'hiking_time') {
          minLabel.textContent = minutesToHHMM(minInput.value);
          maxLabel.textContent = minutesToHHMM(maxInput.value);
        } else {
          minLabel.textContent = minInput.value;
          maxLabel.textContent = maxInput.value;
        }

        minInput.addEventListener('input', () => {
          minLabel.textContent = cfg.attr === 'hiking_time' ? minutesToHHMM(minInput.value) : minInput.value;
          applyFilters(source, layer, inputs, filtersConfig);
        });
        maxInput.addEventListener('input', () => {
          maxLabel.textContent = cfg.attr === 'hiking_time' ? minutesToHHMM(maxInput.value) : maxInput.value;
          applyFilters(source, layer, inputs, filtersConfig);
        });

        const rangeContainer = document.createElement('div');
        rangeContainer.appendChild(minInput);
        rangeContainer.appendChild(maxInput);
        rangeContainer.appendChild(document.createElement('br'));
        rangeContainer.appendChild(minLabel);
        rangeContainer.appendChild(document.createTextNode(' - '));
        rangeContainer.appendChild(maxLabel);

        inputContainer = rangeContainer;
        inputs[cfg.attr] = { min: minInput, max: maxInput };
      }

      filterContainer.appendChild(inputContainer);
      if (cfg.type === 'checkbox') inputs[cfg.attr] = inputContainer.querySelectorAll('input[type=checkbox]');
    });

    // ---- Reset Button ----
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.marginTop = '10px';
    resetBtn.addEventListener('click', () => {
      // Checkboxen zurücksetzen
      Object.keys(inputs).forEach(attr => {
        if (inputs[attr] instanceof NodeList) {
          inputs[attr].forEach(cb => cb.checked = false);
        } else if (inputs[attr].true && inputs[attr].false) {
          inputs[attr].true.checked = false;
          inputs[attr].false.checked = false;
        } else if (inputs[attr].min && inputs[attr].max) {
          const min = Number(inputs[attr].min.min);
          const max = Number(inputs[attr].max.max);
          inputs[attr].min.value = min;
          inputs[attr].max.value = max;
          if (attr === 'hiking_time') {
            inputs[attr].min.nextSibling.textContent = minutesToHHMM(min);
            inputs[attr].max.nextSibling.textContent = minutesToHHMM(max);
          } else {
            inputs[attr].min.nextSibling.textContent = min;
            inputs[attr].max.nextSibling.textContent = max;
          }
        }
      });
      applyFilters(source, layer, inputs, filtersConfig);
    });
    filterContainer.appendChild(resetBtn);
  });
}

// ---- Filter anwenden ----
function applyFilters(source, layer, inputs, config) {
  const features = source.getFeatures();

  features.forEach(f => {
    let visible = true;

    config.forEach(cfg => {
      const featureVal = f.get(cfg.attr);

      if (cfg.type === 'checkbox') {
        const checkedBoxes = Array.from(inputs[cfg.attr]).filter(cb => cb.checked).map(cb => cb.value);
        if (checkedBoxes.length > 0 && !checkedBoxes.includes(featureVal)) visible = false;
      }

      if (cfg.type === 'boolean') {
        const checkedTrue = inputs[cfg.attr].true.checked;
        const checkedFalse = inputs[cfg.attr].false.checked;

        if (!checkedTrue && !checkedFalse) return; // keine Auswahl = alles sichtbar

        if (featureVal === 1 && !checkedTrue) visible = false;
        if (featureVal === 0 && !checkedFalse) visible = false;
      }

      if (cfg.type === 'range') {
        const min = Number(inputs[cfg.attr].min.value);
        const max = Number(inputs[cfg.attr].max.value);
        if (featureVal == null || featureVal < min || featureVal > max) visible = false;
      }
    });

    f.setStyle(visible ? layer.getStyle() : null);
  });
}

// global verfügbar machen
window.initFilters = initFilters;
