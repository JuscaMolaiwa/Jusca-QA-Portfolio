// bug.js
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const stickyBugHunterLink = document.getElementById('stickyBugHunterLink');
  const stickyBugIcon       = document.getElementById('stickyBugIcon');
  const hiddenBugHunterLink = document.getElementById('hiddenBugHunterLink');
  const hiddenBugIcon       = document.getElementById('hiddenBugIcon');

  function animateBugIcon(bugIcon) {
    if (!bugIcon) return;
    bugIcon.classList.add('running');
    setTimeout(function () {
      bugIcon.classList.remove('running');
    }, 5000);
  }

  if (stickyBugHunterLink && stickyBugIcon) {
    stickyBugHunterLink.addEventListener('click', function (e) {
      e.preventDefault();
      animateBugIcon(stickyBugIcon);
      const home = document.getElementById('Home');
      if (home) home.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (hiddenBugHunterLink && hiddenBugIcon) {
    hiddenBugHunterLink.addEventListener('click', function () {
      animateBugIcon(hiddenBugIcon);
    });
  }
});
