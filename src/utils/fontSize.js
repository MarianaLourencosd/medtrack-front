// utils/fontSize.js
export function initFontSizeControls() {
  const allTextElements = document.querySelectorAll("body, body *");

  const originalSizes = [];
  allTextElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    originalSizes.push({ el, size: parseFloat(style.fontSize) });
  });

  let scale = parseFloat(localStorage.getItem("fontScale")) || 1;

  function applyScale() {
    allTextElements.forEach((el, i) => {
      el.style.fontSize = originalSizes[i].size * scale + "px";
    });
  }

  applyScale();

  function decrease() {
    scale *= 0.9;
    localStorage.setItem("fontScale", scale);
    applyScale();
  }

  function increase() {
    scale *= 1.1;
    localStorage.setItem("fontScale", scale);
    applyScale();
  }

  function reset() {
    scale = 1;
    localStorage.setItem("fontScale", scale);
    applyScale();
  }

  return { decrease, increase, reset };
}