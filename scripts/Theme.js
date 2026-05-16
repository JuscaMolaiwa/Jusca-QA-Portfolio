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

    // Also add toggle to mobile drawer
    var drawer = document.getElementById('navDrawer');
    if (drawer) {
      var drawerToggle = document.createElement('button');
      drawerToggle.className   = 'theme-toggle drawer-theme-toggle';
      drawerToggle.setAttribute('aria-label', 'Toggle light/dark mode');
      drawerToggle.innerHTML   = '<span class="theme-icon">' + (currentTheme() === 'light' ? '☀️' : '🌙') + '</span> Toggle theme';
      drawerToggle.style.cssText = [
        'display:flex', 'align-items:center', 'gap:8px',
        'width:100%', 'padding:10px 0',
        'border:none', 'border-bottom:1px solid var(--border)',
        'background:transparent', 'color:var(--muted)',
        'font-family:var(--font-display)', 'font-size:1.1rem',
        'cursor:pointer', 'border-radius:0'
      ].join(';');
      drawerToggle.addEventListener('click', function () {
        toggle();
        // Sync both icons
        var newTheme = currentTheme();
        [icon, drawerToggle.querySelector('.theme-icon')].forEach(function (el) {
          if (el) el.textContent = newTheme === 'light' ? '☀️' : '🌙';
        });
      });
      // Insert as first item in drawer
      drawer.insertBefore(drawerToggle, drawer.firstChild);
    }

    // dark mode is always the default unless the user explicitly toggles.
  });

})();