
const LOCAL_STORAGE_KEY = "toggle-bootstrap-theme";

const LOCAL_META_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

const DARK_THEME_PATH = "./css/mdb.dark.min.css";

const DARK_STYLE_LINK = $("#dark-theme-style");
const THEME_TOGGLER = $("#theme-toggler");
const THEME_TOGGLER_INPUT = $("#theme-toggler-input");

let isDark = LOCAL_META_DATA && LOCAL_META_DATA.isDark;

// vai ver se o utilizador já ativou o tema "escuro"
if (isDark) {
  enableDarkTheme();
} else {
  disableDarkTheme();
}

/**
  esta função vai alternar os temas mas tambem vai guardar o tema do utilizador no local storage.
  assim quando o utilizador voltar ao site tem o mesmo tema guardado
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

//função para mudar o tema de "light" para "dark"
function enableDarkTheme() {
  DARK_STYLE_LINK.attr("href", DARK_THEME_PATH);
  THEME_TOGGLER.html("<h5>Tema: 🌙</h5>");
  THEME_TOGGLER_INPUT.prop("checked", true);
}

//função para mudar o tema de "dark" para "light"
function disableDarkTheme() {
  DARK_STYLE_LINK.attr("href", "");
  THEME_TOGGLER.html("<h5>Tema: 🌞</h5>");
  THEME_TOGGLER_INPUT.prop("checked", false);
}
