export function initDarkMode(setDarkMode) {
    const savedMode = localStorage.getItem("darkMode");
  
    if (savedMode === "enabled") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    }
  }
  
  export function toggleDarkMode(darkMode, setDarkMode) {
    if (darkMode) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    }
  
    setDarkMode(!darkMode);
  }