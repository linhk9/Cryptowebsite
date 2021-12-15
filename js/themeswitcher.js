// you can use app's unique identifier here
const LOCAL_STORAGE_KEY = "toggle-bootstrap-theme";

const LOCAL_META_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

// you can change this url as needed
const DARK_THEME_PATH = "./css/mdb.dark.min.css";

const DARK_STYLE_LINK = document.getElementById("dark-theme-style");
const THEME_TOGGLER = document.getElementById("theme-toggler");
const THEME_TOGGLER_INPUT = document.getElementById("theme-toggler-input");

let isDark = LOCAL_META_DATA && LOCAL_META_DATA.isDark;

// check if user has already selected dark theme earlier
if (isDark) {
  enableDarkTheme();
} else {
  disableDarkTheme();
}

/**
 * Apart from toggling themes, this will also store user's theme preference in local storage.
 * So when user visits next time, we can load the same theme.
 *
 */
function toggleTheme() {
  isDark = !isDark;
  if (isDark) {
    enableDarkTheme();
  } else {
    disableDarkTheme();
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ isDark }));
}

function enableDarkTheme() {
  DARK_STYLE_LINK.setAttribute("href", DARK_THEME_PATH);
  THEME_TOGGLER.innerHTML = "🌙";
  THEME_TOGGLER_INPUT.checked = true;
}

function disableDarkTheme() {
  DARK_STYLE_LINK.setAttribute("href", "");
  THEME_TOGGLER.innerHTML = "🌞";
  THEME_TOGGLER_INPUT.checked = false;
}
