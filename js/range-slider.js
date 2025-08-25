// js/range-slider.js

/**
 * Erzeugt einen Doppel-Range-Slider (min/max) für Filter
 * @param {string} containerId - ID des HTML-Containers, in dem der Slider gebaut wird
 * @param {number} min - Minimaler Wert
 * @param {number} max - Maximaler Wert
 * @param {number} step - Schrittweite
 * @param {function} onChange - Callback bei Änderung (liefert {min, max})
 */
function createRangeSlider(containerId, min, max, step, onChange) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }

  // Grundstruktur einfügen
  container.innerHTML = `
    <style>
      .range-slider {
        position: relative;
        width: 100%;
        max-width: 250px;
        margin: 10px 0;
      }
      .range-slider input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        pointer-events: none;
        appearance: none;
        height: 8px;
        background: transparent;
      }
      .range-slider input::-webkit-slider-thumb {
        pointer-events: all;
        appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #007acc;
        cursor: grab;
      }
      .range-slider .track {
        position: absolute;
        height: 6px;
        background: #ddd;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        border-radius: 3px;
      }
      .range-slider .range {
        position: absolute;
        height: 6px;
        background: #007acc;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 3px;
      }
      .range-output {
        margin-top: 5px;
        font-size: 0.9em;
        color: #333;
      }
    </style>
    <div class="range-slider">
      <div class="track"></div>
      <div class="range"></div>
      <input type="range" class="minSlider" min="${min}" max="${max}" value="${min}" step="${step}">
      <input type="range" class="maxSlider" min="${min}" max="${max}" value="${max}" step="${step}">
    </div>
    <div class="range-output">${min} – ${max}</div>
  `;

  const minSlider = container.querySelector(".minSlider");
  const maxSlider = container.querySelector(".maxSlider");
  const range = container.querySelector(".range");
  const output = container.querySelector(".range-output");

  function updateRange() {
    let minVal = parseInt(minSlider.value);
    let maxVal = parseInt(maxSlider.value);

    // Sicherstellen, dass min < max bleibt
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

    output.textContent = `${minVal} – ${maxVal}`;

    if (onChange) {
      onChange({ min: minVal, max: maxVal });
    }
  }

  minSlider.addEventListener("input", updateRange);
  maxSlider.addEventListener("input", updateRange);

  // Initial setzen
  updateRange();
}
