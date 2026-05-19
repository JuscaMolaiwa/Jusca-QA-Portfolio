(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    const nav          = document.querySelector('.sticky-nav');
    const navLinks     = document.querySelectorAll('.nav-list a');
    const sections     = document.querySelectorAll('section[id]');
    const aboutSection = document.querySelector('#about');
    const bugIcon      = document.getElementById('stickyBugIcon');
    const backToTopBtn = document.querySelector('.back-to-top');

    if (!nav) return;

    const aboutOffset = aboutSection ? aboutSection.offsetTop : 0;

    // ── Hash helper ───────────────────────────────────────────────────────
    function setHash(id) {
      const hash = '#' + id;
      if (location.hash !== hash && history && history.replaceState) {
        history.replaceState(null, '', hash);
      }
    }

    // ── Bug icon animation ────────────────────────────────────────────────
    function animateBugIcon() {
      if (!bugIcon) return;
      bugIcon.classList.add('running');
      setTimeout(function () { bugIcon.classList.remove('running'); }, 5000);
    }

    // ── Active nav highlight on scroll ────────────────────────────────────
    function updateActiveNavLink() {
      const fromTop = window.scrollY + nav.offsetHeight + 10;

      if (fromTop < aboutOffset) {
        navLinks.forEach(l => l.classList.remove('active'));
        const homeLink = document.querySelector('.nav-list a[href="#Home"]');
        if (homeLink) { homeLink.classList.add('active'); setHash('Home'); }
        return;
      }

      sections.forEach(function (section) {
        if (fromTop >= section.offsetTop && fromTop < section.offsetTop + section.offsetHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          const target = document.querySelector('.nav-list a[href="#' + section.id + '"]');
          if (target) { target.classList.add('active'); setHash(section.id); }
        }
      });
    }

    updateActiveNavLink();


    // ── Scroll progress bar ──────────────────────────────────────
    const progressBar = document.getElementById('scrollProgressBar');
    function updateProgressBar() {
      if (!progressBar) return;
      const scrollTop  = window.scrollY || document.documentElement.scrollTop;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', pct);
    }

    window.addEventListener('scroll', function () {
      updateProgressBar();
      updateActiveNavLink();
      if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible',
          document.documentElement.scrollTop > 400 || document.body.scrollTop > 400
        );
      }
    }, { passive: true });

    // ── Smooth scroll on desktop nav click ───────────────────────────────
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          window.scrollTo({ top: targetSection.offsetTop - nav.offsetHeight, behavior: 'smooth' });
        }
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        if (targetId === 'Home' || targetId === 'BugHunter') animateBugIcon();
        if (history && history.pushState) history.pushState(null, '', '#' + targetId);
      });
    });

    // ── Back to top ───────────────────────────────────────────────────────
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ── Fade-up scroll animations ─────────────────────────────────────────
    const fadeEls = document.querySelectorAll('.fade-up');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      fadeEls.forEach(el => obs.observe(el));
    } else {
      fadeEls.forEach(el => el.classList.add('visible'));
    }

    // ── Professional Development: view more / less ────────────────────────
    const certsList   = document.getElementById('certsList');
    const certsToggle = document.getElementById('certsToggle');
    const certsText   = document.getElementById('certsToggleText');

    if (certsList && certsToggle && certsText) {
      certsToggle.addEventListener('click', function () {
        const collapsed = certsList.classList.toggle('collapsed');
        certsToggle.setAttribute('aria-expanded', String(!collapsed));
        certsText.textContent = collapsed ? 'View more' : 'View less';
      });
    }


    
    // ── Timeline view more / less (mobile only) ───────────────────
    const timelineToggle    = document.getElementById('timelineToggle');
    const timelineToggleTxt = document.getElementById('timelineToggleText');
    const hiddenItems       = document.querySelectorAll('.timeline-item--hidden');

    if (timelineToggle) {
      timelineToggle.addEventListener('click', function () {
        const expanded = timelineToggle.getAttribute('aria-expanded') === 'true';
        timelineToggle.setAttribute('aria-expanded', String(!expanded));
        timelineToggleTxt.textContent = expanded ? 'View 2 more' : 'View less';
        hiddenItems.forEach(function (item) {
          if (!expanded) {
            item.classList.remove('timeline-item--hidden');
            setTimeout(function () { item.classList.add('visible'); }, 50);
          } else {
            item.classList.add('timeline-item--hidden');
            item.classList.remove('visible');
          }
        });
      });
    }

  });
})();