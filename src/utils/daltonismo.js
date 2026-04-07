// utils/daltonismo.js
export function initDaltonismo() {
  const tipos = ["", "daltonismo-red-verde", "daltonismo-azul-amarelo", "daltonismo-todo"];
  const icones = ["OFF", "🔴", "🔵", "🟡"];

  // Função de toggle
  function toggleDaltonismo(buttonEl) {
    if (!buttonEl) return () => {};

    let current = tipos.indexOf(localStorage.getItem("daltonismo") || "");

    const aplicarDaltonismo = () => {
      document.body.classList.remove(...tipos.filter(t => t !== ""));
      if (current > 0) document.body.classList.add(tipos[current]);
      buttonEl.textContent = `Daltonismo: ${icones[current]}`;
    };

    aplicarDaltonismo();

    const handleClick = () => {
      current = (current + 1) % tipos.length;
      localStorage.setItem("daltonismo", tipos[current]);
      aplicarDaltonismo();
    };

    buttonEl.addEventListener("click", handleClick);

    // Cleanup
    return () => buttonEl.removeEventListener("click", handleClick);
  }

  return { toggleDaltonismo };
}