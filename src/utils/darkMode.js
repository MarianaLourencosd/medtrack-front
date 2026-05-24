export function initDarkMode() {
  const savedMode = localStorage.getItem("darkMode");
  
  if (savedMode === "enabled") {
    document.body.classList.add("dark-mode");
    return true;
  } else {
    document.body.classList.remove("dark-mode");
    return false;
  }
}

export function toggleDarkMode() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  
  if (isDarkMode) {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
    return false;
  } else {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
    return true;
  }
}