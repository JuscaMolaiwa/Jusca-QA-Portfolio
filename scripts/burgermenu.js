document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const burgerBtn  = document.getElementById('burgerBtn');
  const navDrawer  = document.getElementById('navDrawer');
  const navOverlay = document.getElementById('navOverlay');

  if (!burgerBtn || !navDrawer) return;

  // ── Open / close helpers ──────────────────────────────────────────────
  function openDrawer() {
    navDrawer.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    const firstLink = navDrawer.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    burgerBtn.focus();
  }

  // Expose globally for inline onclick in HTML
  window.closeDrawer  = closeDrawer;
  window.toggleDrawer = function () {
    navDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
  };

  burgerBtn.addEventListener('click', window.toggleDrawer);

  burgerBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.toggleDrawer();
    }
  });

  if (navOverlay) navOverlay.addEventListener('click', closeDrawer);

  // Close button inside drawer
  var closeBtn = document.getElementById('navDrawerClose');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  navDrawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) closeDrawer();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && navDrawer.classList.contains('open')) closeDrawer();
  }, { passive: true });

});