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
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54A.48.48 0 0 0 13.88 2h-3.84a.48.48 0 0 0-.49.41L9.19 4.95a7.28 7.28 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22l-1.92 3.32a.5.5 0 0 0 .12.64l2.03 1.58a7.49 7.49 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96c.5.39 1.04.71 1.63.94l.36 2.54a.48.48 0 0 0 .49.41h3.84a.48.48 0 0 0 .49-.41l.36-2.54c.59-.23 1.13-.55 1.63-.94l2.39.96a.5.5 0 0 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
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
