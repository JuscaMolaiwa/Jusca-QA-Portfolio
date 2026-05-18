// blog.js
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var grid        = document.getElementById('blogGrid');
  var toggleBtn   = document.getElementById('blogToggle');
  var toggleText  = document.getElementById('blogToggleText');
  var filterBtns  = document.querySelectorAll('.blog-filter');
  var hiddenCards = document.querySelectorAll('.blog-card--hidden');

  if (!grid) return;

  var expanded      = false;
  var activeFilter  = 'all';

  // ── View more / less ─────────────────────────────────────
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      expanded = !expanded;
      toggleBtn.setAttribute('aria-expanded', String(expanded));
      toggleText.textContent = expanded ? 'View less' : 'View 3 more';

      hiddenCards.forEach(function (card) {
        if (expanded) {
          // Only show if it matches the active filter
          var cat = card.getAttribute('data-category');
          if (activeFilter === 'all' || cat === activeFilter) {
            card.classList.remove('blog-card--hidden');
            // Trigger fade-up if not already visible
            setTimeout(function () { card.classList.add('visible'); }, 50);
          }
        } else {
          card.classList.add('blog-card--hidden');
          card.classList.remove('visible');
        }
      });
    });
  }

  // ── Category filter ───────────────────────────────────────
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeFilter = btn.getAttribute('data-filter');

      // Update active state
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Filter visible cards
      var allCards = grid.querySelectorAll('.blog-card:not(.blog-card--hidden)');
      allCards.forEach(function (card) {
        var cat = card.getAttribute('data-category');
        if (activeFilter === 'all' || cat === activeFilter) {
          card.classList.remove('blog-card--filtered');
        } else {
          card.classList.add('blog-card--filtered');
        }
      });

      // Also filter hidden cards if expanded
      if (expanded) {
        hiddenCards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          if (activeFilter === 'all' || cat === activeFilter) {
            card.classList.remove('blog-card--filtered');
          } else {
            card.classList.add('blog-card--filtered');
          }
        });
      }

      // Update toggle text to reflect filtered count
      updateToggleCount();
    });
  });

  // ── Update toggle button count based on active filter ─────
  function updateToggleCount() {
    if (!toggleBtn) return;
    var matchingHidden = 0;
    hiddenCards.forEach(function (card) {
      var cat = card.getAttribute('data-category');
      if (activeFilter === 'all' || cat === activeFilter) matchingHidden++;
    });

    if (matchingHidden === 0) {
      toggleBtn.style.display = 'none';
    } else {
      toggleBtn.style.display = '';
      if (!expanded) {
        toggleText.textContent = 'View ' + matchingHidden + ' more';
      }
    }
  }

  updateToggleCount();

});