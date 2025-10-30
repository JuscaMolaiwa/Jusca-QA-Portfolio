(function() {
    // Professional Development: show only first 3, add View more/less toggle
    document.addEventListener('DOMContentLoaded', function() {
        try {
            const eduContainer = document.querySelector('#education .education');
            if (!eduContainer) return;
            const h3s = eduContainer.querySelectorAll('h3');
            if (h3s.length < 2) return;
            const proDevHeading = h3s[1]; // second h3 is 'Professional Development'
            let list = proDevHeading.nextElementSibling;
            if (!list || list.tagName.toLowerCase() !== 'ul') return;

            const items = list.querySelectorAll('li');
            if (items.length <= 3) return;

            // Ensure list has an id for aria-controls
            if (!list.id) {
                list.id = 'professional-development-list';
            }

            // Collapse extra items by default
            list.classList.add('collapsed');

            // Create toggle button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'view-more-toggle';
            btn.setAttribute('aria-controls', list.id);
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'View more';

            btn.addEventListener('click', function() {
                const isCollapsed = list.classList.toggle('collapsed');
                const expanded = !isCollapsed;
                btn.setAttribute('aria-expanded', String(expanded));
                btn.textContent = expanded ? 'View less' : 'View more';
            });

            // Insert after the list
            if (list.parentNode) {
                list.parentNode.insertBefore(btn, list.nextSibling);
            }
        } catch (e) {
            // Fail silently to avoid breaking other scripts
            console && console.debug && console.debug('Education toggle init skipped:', e);
        }
    });
})();
document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll(".nav-list a");
    const nav = document.querySelector('.sticky-nav');
    const sections = document.querySelectorAll("section");
    const aboutSection = document.querySelector('#about');
    const bugIcon = document.querySelector('.sticky-nav .bug-icon'); 
    const bugHunterLink = document.querySelector('.nav-link[href="#BugHunter"]');
    const aboutSectionOffset = aboutSection.offsetTop;

    // Keep URL hash in sync during manual scroll without polluting history
    function setHashOnScroll(targetId) {
        const newHash = `#${targetId}`;
        if (location.hash !== newHash) {
            if (history && history.replaceState) {
                history.replaceState(null, '', newHash);
            } else {
                location.hash = targetId;
            }
        }
    }


    // sourcery skip: avoid-function-declarations-in-blocks
    function animateBugIcon() {
        bugIcon.classList.add('running');

        // Remove 'running' class after animation completes (optional)
        setTimeout(function () {
            bugIcon.classList.remove('running');
        }, 5000); // Adjust timing to match animation duration
    }

    // Function to update active navigation link based on scroll position
    function updateActiveNavLink() {
        let fromTop = window.scrollY + nav.offsetHeight + 10; // Adjusted for nav bar height

        sections.forEach(function (section) {
            if (
                fromTop >= section.offsetTop &&
                fromTop < section.offsetTop + section.offsetHeight
            ) {
                // Remove 'active' class from all links
                navLinks.forEach(function (link) {
                    link.classList.remove("active");
                });

                // Add 'active' class to corresponding link
                const targetLink = document.querySelector(
                    `.nav-list a[href="#${section.id}"]`
                );
                if (targetLink) {
                    targetLink.classList.add("active");
                }

                // Update nav background color based on section
                updateNavBackground(section.id);

                // Reflect active section in URL during scroll
                setHashOnScroll(section.id);
            }
        });

        // Special case for 'Home' link
        if (fromTop < aboutSectionOffset) {
            navLinks.forEach(function (link) {
                link.classList.remove("active");
            });
            const homeLink = document.querySelector('.nav-list a[href="#Home"]');
            if (homeLink) {
                homeLink.classList.add("active");
                updateNavBackground('home'); // Apply specific color for 'Home'
                setHashOnScroll('Home');
            }
        }
    }

    // Initial update of active nav link and nav background color
    updateActiveNavLink();
    // Ensure nav is visible initially
    nav.classList.remove('nav-hidden');

    // Smart auto-hide disabled (keep nav always visible); still update active link/background on scroll
    let lastScrollY = window.scrollY || 0;
    const autoHideEnabled = () => false; // disable auto-hide across breakpoints

    window.addEventListener("scroll", function () {
        updateActiveNavLink();

    if (!autoHideEnabled()) return;
        const current = window.scrollY || 0;

        // Do not hide when at very top
        if (current <= 0) {
            nav.classList.remove('nav-hidden');
            lastScrollY = current;
            return;
        }

        // Don't hide if mobile menu is open
        const overlayMenu = document.querySelector('.nav-menu');
        const menuOpen = overlayMenu && overlayMenu.classList.contains('active');
        if (menuOpen) {
            nav.classList.remove('nav-hidden');
            lastScrollY = current;
            return;
        }

        const delta = current - lastScrollY;
        const threshold = 8; // small threshold to avoid jitter
        if (Math.abs(delta) > threshold) {
            if (delta > 0 && current > 100) {
                // scrolling down
                // nav.classList.add('nav-hidden'); // disabled
            } else {
                // scrolling up (no-op, nav remains visible)
                nav.classList.remove('nav-hidden');
            }
            lastScrollY = current;
        }
    });

    // Smooth scroll to section on nav link click and update URL hash
    navLinks.forEach(function (navLink) {
        navLink.addEventListener("click", function (event) {
            event.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - nav.offsetHeight,
                    behavior: "smooth",
                });

                // Remove 'active' class from all links
                navLinks.forEach(function (link) {
                    link.classList.remove("active");
                });

                // Add 'active' class to clicked link
                this.classList.add("active");

                // Update nav background color based on clicked link
                updateNavBackground(targetId);

                if (targetId === 'Home' || targetId === 'BugHunter') {
                    animateBugIcon();
                }
                // Update the URL hash without triggering default jump
                if (history && history.pushState) {
                    history.pushState(null, '', `#${targetId}`);
                } else {
                    // Fallback for very old browsers
                    location.hash = targetId;
                }
                // Ensure nav is visible after a click (kept for safety)
                nav.classList.remove('nav-hidden');
            }
        });
    });

    // On resize, show nav to avoid being stuck hidden when switching breakpoints
    window.addEventListener('resize', function() {
        nav.classList.remove('nav-hidden');
    });

    // Burger menu open/close is handled in burgermenu.js for consistency

    // Show or hide the back-to-top button based on scroll position
    window.addEventListener("scroll", function () {
        const backToTopButton = document.querySelector('.sh-back-to-top');
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });

    // Scroll smoothly to the top when the button is clicked
    document.querySelector('.sh-back-to-top').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Function to update nav background color based on section
    function updateNavBackground(sectionId) {
        // Keep current nav styling managed via CSS; function retained for compatibility
        // Optionally, could add subtle effects per section if needed later
    }

    // Removed duplicate DOMContentLoaded listener toggling navMenu; handled in burgermenu.js

});
