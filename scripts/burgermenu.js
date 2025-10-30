document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const mainContent = document.querySelector('main');
    const navLinks = navMenu.querySelectorAll('a');
    const closeButton = document.querySelector('.close-button');

    // Toggle navigation menu visibility on burger menu click
    burgerMenu.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('active');
        burgerMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        document.body.classList.toggle('no-scroll', isOpen);
        if (isOpen) {
            navMenu.querySelector('a')?.focus();
        } else {
            burgerMenu.focus();
        }
    });

    // Keyboard support: Enter/Space on burger
    burgerMenu.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            burgerMenu.click();
        }
    });

    // Close via close button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navMenu.setAttribute('aria-hidden', 'true');
            burgerMenu.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            burgerMenu.style.display = 'block';
            burgerMenu.focus();
        });
    }

    // Close navigation menu when clicking on a link (excluding BugHunter)
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            if (link.getAttribute('href') !== '#BugHunter') {
                event.preventDefault();
                navMenu.classList.remove('active');
                navMenu.setAttribute('aria-hidden', 'true');
                burgerMenu.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
                burgerMenu.style.display = 'block';

                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Close the menu if the window is resized to a width greater than 768px
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            if (!navMenu.classList.contains('active')) { burgerMenu.style.display = 'none'; }
        } else {
            burgerMenu.style.display = 'block'; // Show burger menu on smaller screens
        }
    });

    // ESC to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navMenu.setAttribute('aria-hidden', 'true');
            burgerMenu.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            burgerMenu.style.display = 'block';
            burgerMenu.focus();
        }
    });
});

function toggleNavMenu() {
    const navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("active");
    const burgerMenu = document.querySelector('.burger-menu');
    const isOpen = navMenu.classList.contains('active');
    burgerMenu.style.display = isOpen ? 'none' : 'block';
    burgerMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.classList.toggle('no-scroll', isOpen);
}


