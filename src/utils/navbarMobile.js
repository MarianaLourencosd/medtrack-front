export function initNavbarMobile() {
  const btn = document.getElementById("nav-btn-toggle");
  const menu = document.getElementById("nav-mobile");

  if (!btn || !menu) return;

  const handleClick = () => {
    menu.classList.toggle("open");
  };

  btn.addEventListener("click", handleClick);

  return () => btn.removeEventListener("click", handleClick);
}