// theme.js
(function () {
  'use strict';

  var STORAGE_KEY = 'jm-theme';
  var toggleBtn   = null;
  var icon        = null;

  // ── Determine initial theme ───────────────────────────────
  // Priority: 1. localStorage  2. OS preference  3. dark (default)
  function getPreferredTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // always dark unless user explicitly toggles to light
  }

  // ── Apply theme to <html> ─────────────────────────────────
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (icon) icon.textContent = theme === 'light' ? '☀️' : '🌙';
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function toggle() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  // ── Apply immediately to avoid flash of wrong theme ───────
  // This runs before DOMContentLoaded so the icon updates after
  applyTheme(getPreferredTheme());

  // ── Wire up button after DOM ready ────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    toggleBtn = document.getElementById('themeToggle');
    icon      = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;

    // Sync icon with already-applied theme
    if (icon) icon.textContent = currentTheme() === 'light' ? '☀️' : '🌙';

    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    }

    // Wire up static drawer theme toggle
    var drawerToggle     = document.getElementById('drawerThemeToggle');
    var drawerToggleIcon = drawerToggle ? drawerToggle.querySelector('.theme-icon') : null;

    // Sync drawer icon with current theme
    if (drawerToggleIcon) drawerToggleIcon.textContent = currentTheme() === 'light' ? '☀️' : '🌙';

    if (drawerToggle) {
      drawerToggle.addEventListener('click', function () {
        toggle();
        var newTheme = currentTheme();
        if (icon)             icon.textContent             = newTheme === 'light' ? '☀️' : '🌙';
        if (drawerToggleIcon) drawerToggleIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
      });
    }

    // OS theme changes are intentionally ignored —
    // dark mode is always the default unless the user explicitly toggles.
  });

})();