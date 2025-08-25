// js/filters.js

function initFilters(source, vectorLayer) {
  const filtersDiv = document.getElementById("filters");

  // Hilfsfunktion: Doppel-Slider erzeugen
  function createRangeSlider(container, label, min, max, step, onChange) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <h4>${label}</h4>
      <div class="range-slider">
        <div class="track"></div>
        <div class="range"></div>
        <input type="range" class="minSlider" min="${min}" max="${max}" value="${min}" step="${step}">
        <input type="range" class="maxSlider" min="${min}" max="${max}" value="${max}" step="${step}">
      </div>
      <div class="range-output">${min} – ${max}</div>
    `;
    container.appendChild(wrapper);

    const minSlider = wrapper.querySelector(".minSlider");
    const maxSlider = wrapper.querySelector(".maxSlider");
    const range = wrapper.querySelector(".range");
    const output = wrapper.querySelector(".range-output");

    function updateRange() {
      let minVal = parseInt(minSlider.value);
      let maxVal = parseInt(maxSlider.value);

      if (minVal > maxVal - step) {
        minVal = maxVal - step;
        minSlider.value = minVal;
      }
      if (maxVal < minVal + step) {
        maxVal = minVal + step;
        maxSlider.value = maxVal;
      }

      const percentMin = (minVal - min) / (max - min) * 100;
      const percentMax = (maxVal - min) / (max - min) * 100;

      range.style.left = percentMin + "%";
      range.style.width = (percentMax - percentMin) + "%";

      if (label.includes("Time")) {
        output.textContent = `${formatTime(minVal)} – ${formatTime(maxVal)}`;
      } else {
        output.textContent = `${minVal} – ${maxVal}`;
      }

      onChange({ min: minVal, max: maxVal });
      applyFilters();
    }

    minSlider.addEventListener("input", updateRange);
    maxSlider.addEventListener("input", updateRange);

    updateRange();
  }

  // Hilfsfunktion: Minuten → hh:mm
  function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  // Filterstatus
  const activeFilters = {
    category: new Set(),
    physical_demand: new Set(),
    active: new Set(),
    listed: new Set(),
    distance: { min: 0, max: 9999 },
    hiking_time: { min: 0, max: 9999 }
  };

  // Checkbox-Gruppe
  function createCheckboxGroup(container, label, field, values) {
    const group = document.createElement("div");
    group.innerHTML = `<h4>${label}</h4>`;
    values.forEach(v => {
      const id = `${field}-${v}`;
      group.innerHTML += `
        <label>
          <input type="checkbox" id="${id}" value="${v}"> ${v}
        </label><br>
      `;
    });
    container.appendChild(group);

    values.forEach(v => {
      document.getElementById(`${field}-${v}`).addEventListener("change", (e) => {
        if (e.target.checked) {
          activeFilters[field].add(v);
        } else {
          activeFilters[field].delete(v);
        }
        applyFilters();
      });
    });
  }

  // --- Filter-UI ---
  createCheckboxGroup(filtersDiv, "Category", "category",
    ["hike", "mountain hike", "alpine hike", "winter hike", "snow shoe hike"]);

  createCheckboxGroup(filtersDiv, "Physical Demand", "physical_demand",
    ["low", "medium", "high"]);

  createCheckboxGroup(filtersDiv, "Active", "active", ["true", "false"]);
  createCheckboxGroup(filtersDiv, "Listed", "listed", ["true", "false"]);

  createRangeSlider(filtersDiv, "Distance (km)", 0, 50, 1, (range) => {
    activeFilters.distance = range;
  });

  createRangeSlider(filtersDiv, "Hiking Time (hh:mm)", 0, 600, 10, (range) => {
    activeFilters.hiking_time = range;
  });

  // Reset-Button
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset Filters";
  resetBtn.onclick = () => {
    activeFilters.category.clear();
    activeFilters.physical_demand.clear();
    activeFilters.active.clear();
    activeFilters.listed.clear();
    activeFilters.distance = { min: 0, max: 9999 };
    activeFilters.hiking_time = { min: 0, max: 9999 };
    initFilters(source, vectorLayer); // neu aufbauen
    applyFilters();
  };
  filtersDiv.appendChild(resetBtn);

  // Filterfunktion
  function applyFilters() {
    vectorLayer.getSource().getFeatures().forEach(f => {
      const props = f.getProperties();

      const matchCategory =
        activeFilters.category.size === 0 ||
        activeFilters.category.has(props.category);

      const matchPhysical =
        activeFilters.physical_demand.size === 0 ||
        activeFilters.physical_demand.has(props.phyisical_demand);

      const matchActive =
        activeFilters.active.size === 0 ||
        activeFilters.active.has(props.active === 1 ? "true" : "false");

      const matchListed =
        activeFilters.listed.size === 0 ||
        activeFilters.listed.has(props.listed === 1 ? "true" : "false");

      const matchDistance =
        props.distance >= activeFilters.distance.min &&
        props.distance <= activeFilters.distance.max;

      const matchTime =
        props.hiking_time >= activeFilters.hiking_time.min &&
        props.hiking_time <= activeFilters.hiking_time.max;

      const visible =
        matchCategory &&
        matchPhysical &&
        matchActive &&
        matchListed &&
        matchDistance &&
        matchTime;

      f.setStyle(visible ? null : new ol.style.Style(null));
    });
  }
}
