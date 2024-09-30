document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const mainContent = document.querySelector('main');
    const navLinks = navMenu.querySelectorAll('a');

    // Toggle navigation menu visibility on burger menu click
    burgerMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        burgerMenu.style.display = navMenu.classList.contains('active') ? 'none' : 'block';
    });

    // Close navigation menu when clicking on a link (excluding BugHunter)
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            if (link.getAttribute('href') !== '#BugHunter') {
                event.preventDefault();
                navMenu.classList.remove('active');
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
            if (!navMenu.classList.contains('active')) {
                burgerMenu.style.display = 'none';
            }
        } else {
            burgerMenu.style.display = 'block'; // Show burger menu on smaller screens
        }
    });
});

function toggleNavMenu() {
    const navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("active");
    const burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.style.display = navMenu.classList.contains('active') ? 'none' : 'block';
}


