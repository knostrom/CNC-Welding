const root = document.documentElement;
const settings = document.createElement("div");
settings.className = "site-settings";
settings.innerHTML = `
  <div class="settings-menu" id="site-settings-menu" role="group" aria-label="Settings" hidden>
    <label class="settings-option">
      <span>Dark Mode</span>
      <input type="checkbox" data-setting="dark-mode">
    </label>
    <label class="settings-option">
      <span>Improve Contrast</span>
      <input type="checkbox" data-setting="improve-contrast">
    </label>
  </div>
  <button class="settings-button" type="button" aria-label="Settings" aria-expanded="false" aria-controls="site-settings-menu">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm0-6v2.1a7.7 7.7 0 0 1 2.16.58l1.48-1.48 2.91 2.91-1.48 1.48c.29.67.49 1.4.58 2.16h2.1v4.12h-2.1a7.7 7.7 0 0 1-.58 2.16l1.48 1.48-2.91 2.91-1.48-1.48a7.7 7.7 0 0 1-2.16.58v2.1H9.88v-2.1a7.7 7.7 0 0 1-2.16-.58l-1.48 1.48-2.91-2.91 1.48-1.48a7.7 7.7 0 0 1-.58-2.16h-2.1V10h2.1c.09-.76.29-1.49.58-2.16L3.33 6.36l2.91-2.91 1.48 1.48a7.7 7.7 0 0 1 2.16-.58v-2.1H12Z"/>
    </svg>
  </button>
`;
document.body.append(settings);

function readSetting(name) {
  try {
    return localStorage.getItem(`cnc-settings-${name}`) === "true";
  } catch (error) {
    console.error(`Unable to load the ${name} setting.`, error);
    return false;
  }
}

function saveSetting(name, enabled) {
  try {
    localStorage.setItem(`cnc-settings-${name}`, String(enabled));
  } catch (error) {
    console.error(`Unable to save the ${name} setting.`, error);
  }
}

const controls = settings.querySelectorAll("[data-setting]");
controls.forEach((control) => {
  const name = control.dataset.setting;
  const enabled = readSetting(name);
  control.checked = enabled;

  if (enabled && name === "dark-mode") {
    root.dataset.theme = "dark";
  } else if (enabled && name === "improve-contrast") {
    root.dataset.contrast = "high";
  }

  control.addEventListener("change", () => {
    const active = control.checked;
    if (name === "dark-mode") {
      if (active) {
        root.dataset.theme = "dark";
      } else {
        delete root.dataset.theme;
      }
    } else if (name === "improve-contrast") {
      if (active) {
        root.dataset.contrast = "high";
      } else {
        delete root.dataset.contrast;
      }
    }
    saveSetting(name, active);
  });
});

const menu = settings.querySelector(".settings-menu");
const button = settings.querySelector(".settings-button");

function closeMenu() {
  menu.hidden = true;
  button.setAttribute("aria-expanded", "false");
}

button.addEventListener("click", () => {
  const isOpen = button.getAttribute("aria-expanded") === "true";
  menu.hidden = isOpen;
  button.setAttribute("aria-expanded", String(!isOpen));
});

document.addEventListener("click", (event) => {
  if (!settings.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) {
    closeMenu();
    button.focus();
  }
});
