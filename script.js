const searchInput = document.querySelector("#search-input");
const searchColor = document.querySelector(".search-color");
const typeSelect = document.querySelector("#palette-type");
const countSelect = document.querySelector("#palette-count");
const randomBtn = document.querySelector("#random-btn");
const paletteContainer = document.querySelector("#palette");
const relatedContainer = document.querySelector("#related");

let currentColor = "skyblue";
let currentType = "analogous";
let currentCount = 6;

function getHslFromColor(color) {
  let hsl;
  if (isValidColor(color)) {
    let temp = document.createElement("div");
    temp.style.color = color;
    document.body.appendChild(temp);
    let styles = window.getComputedStyle(temp, null);
    let rgb = styles.getPropertyValue("color");
    document.body.removeChild(temp);
    rgb = removeRGB(rgb);
    hsl = rgbToHsl(rgb);
  }
  return hsl;
}

function rgbToHsl(rgb) {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;

  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = (cmin + cmax) / 2;

  if (delta === 0) {
    h = 0;
    s = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }
  if (delta !== 0) {
    s = Math.round((delta / (1 - Math.abs(2 * l - 1))) * 100);
  }
  l = Math.round(l * 100);
  return [h, s, l];
}

function HslToHex(hsl) {
  let h = hsl[0];
  let s = hsl[1];
  let l = hsl[2];
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function removeRGB(rgb) {
  return rgb.replace("rgb(", "").replace(")", "").split(",");
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function isValidColor(color) {
  if (color.startsWith("#") && color.length === 5) {
    return false;
  }
  return CSS.supports("color", color);
}

function generateAnalogousPalette(hsl, count) {
  const palette = [];
  const [hue, saturation, lightness] = hsl;

  for (let i = 0; i < count; i++) {
    let newHue = hue + 30 * i;

    if (newHue > 360) {
      newHue -= 360;
    }

    palette.push([newHue, saturation, lightness]);
  }

  return palette;
}

function generateRelatedColorsPalette(hsl, count) {
  const palette = [];
  const [hue, saturation, lightness] = hsl;

  palette.push([hue, (saturation + 20) % 100, lightness]);
  palette.push([hue, (saturation - 20) % 100, lightness]);
  palette.push([hue, saturation, (lightness + 20) % 100]);
  palette.push([hue, saturation, (lightness - 20 + 100) % 100]);
  palette.push([(hue + 20) % 360, saturation, lightness]);
  palette.push([(hue - 20) % 360, saturation, lightness]);

  for (let i = palette.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [palette[i], palette[j]] = [palette[j], palette[i]];
  }

  return palette;
}

function generatePalette(hsl, type, count) {
  switch (type) {
    case "analogous":
      return generateAnalogousPalette(hsl, count);
    case "related":
      return generateRelatedColorsPalette(hsl, count);
  }
}

function generatePaletteHtml(type, container) {
  let color = currentColor;
  let count = currentCount;
  const hsl = getHslFromColor(color);

  if (!hsl) return;

  let palette = generatePalette(hsl, type, count);
  container.innerHTML = "";

  palette.forEach((color) => {
    if (type != "image-colors") {
      color = HslToHex(color);
    }

    const colorEl = document.createElement("div");
    colorEl.classList.add("color");
    colorEl.style.backgroundColor = color;

    colorEl.innerHTML = `
      <div class="overlay">
        <div class="icons">
          <div class="copy-color" title="Copy color code">
            <i class="far fa-copy"></i>
          </div>
          <div class="generate-pallete" title="Generate Palette">
            <i class="fas fa-palette"></i>
          </div>
        </div>
        <div class="code">${color}</div>
      </div>
    `;

    container.appendChild(colorEl);
  });
}

generatePaletteHtml(currentType, paletteContainer);
generatePaletteHtml("related", relatedContainer);

searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value;
  if (isValidColor(value)) {
    searchColor.style.backgroundColor = value;
    currentColor = value;
    generatePaletteHtml(currentType, paletteContainer);
    generatePaletteHtml("related", relatedContainer);
  }
});

typeSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  currentType = value;
  typeText.textContent = value + " Palette";
  generatePaletteHtml(currentType, paletteContainer);
});

countSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  currentCount = value;
  generatePaletteHtml(currentType, paletteContainer);
});

randomBtn.addEventListener("click", () => {
  const randomColor = getRandomColor();
  searchInput.value = randomColor;
  searchColor.style.backgroundColor = randomColor;
  currentColor = randomColor;
  generatePaletteHtml(currentType, paletteContainer);
  generatePaletteHtml("related", relatedContainer);
});

const toggle = document.getElementById("toggle");

toggle.addEventListener("change", function (e) {
  if (e.target.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});
