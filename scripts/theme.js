// theme.js
(function () {
  'use strict';

  var STORAGE_KEY = 'jm-theme';
  var icons = []; // track all icon elements

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  function getPreferredTheme() {
    var saved = storageGet(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncIcons(theme) {
    icons.forEach(function (el) {
      if (el) el.textContent = theme === 'light' ? '☀️' : '🌙';
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    storageSet(STORAGE_KEY, theme);
    syncIcons(theme);
  }

  function toggle() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  // Apply immediately to avoid flash
  applyTheme(getPreferredTheme());

  // ── Guard against already-parsed DOM (defer/async scripts) ──
  function domReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  domReady(function () {
    var toggleBtn = document.getElementById('themeToggle');
    var mainIcon  = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;

    if (mainIcon) icons.push(mainIcon);
    syncIcons(currentTheme()); // sync after icons array is populated

    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    } else {
      console.warn('[theme] #themeToggle not found');
    }

    var drawer = document.getElementById('navDrawer');
    if (drawer) {
      var drawerToggle = document.createElement('button');
      drawerToggle.className = 'theme-toggle drawer-theme-toggle';
      drawerToggle.setAttribute('aria-label', 'Toggle light/dark mode');
      var drawerIcon = document.createElement('span');
      drawerIcon.className = 'theme-icon';
      icons.push(drawerIcon);
      drawerToggle.appendChild(drawerIcon);
      drawerToggle.appendChild(document.createTextNode(' Toggle theme'));
      drawerToggle.style.cssText = [
        'display:flex', 'align-items:center', 'gap:8px',
        'width:100%', 'padding:10px 0',
        'border:none', 'border-bottom:1px solid var(--border)',
        'background:transparent', 'color:var(--muted)',
        'font-family:var(--font-display)', 'font-size:1.1rem',
        'cursor:pointer', 'border-radius:0'
      ].join(';');
      drawerToggle.addEventListener('click', toggle);
      drawer.insertBefore(drawerToggle, drawer.firstChild);
      syncIcons(currentTheme());
    }
  });
})();