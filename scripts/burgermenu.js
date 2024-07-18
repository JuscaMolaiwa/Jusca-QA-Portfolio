document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    // Toggle navigation menu visibility on burger menu click
    burgerMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        burgerMenu.style.display = 'none'; // Hide burger menu when navigation menu is active
    });

    // Close navigation menu when clicking on a link (excluding BugHunter)
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            // Check if the link is not BugHunter
            if (link.getAttribute('href') !== '#BugHunter') {
                event.preventDefault(); // Prevent default link behavior (e.g., page scroll)

                // Close navigation menu
                navMenu.classList.remove('active');
                burgerMenu.style.display = 'block'; // Show burger menu when navigation menu is closed

                // Scroll to the section
                const targetId = link.getAttribute('href').substring(1); // Get target section ID
                const targetSection = document.getElementById(targetId); // Find target section element
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to the target section
                }
            }
        });
    });
});

function toggleNavMenu() {
    const navMenu = document.getElementById("navMenu");
    navMenu.classList.remove("active");
    const burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.style.display = 'block'; // Show burger menu when navigation menu is closed
}
