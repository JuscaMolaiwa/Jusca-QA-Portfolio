document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-list a");
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.sticky-nav');
    // Get the offset position of the "About" section
    const aboutSection = document.querySelector('#about');
    const aboutSectionOffset = aboutSection.offsetTop;

    navLinks.forEach(function (navLink) {
        navLink.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove 'active' class from all links
            navLinks.forEach(function (link) {
                link.classList.remove("active");
            });

            // Add 'active' class to clicked link
            this.classList.add("active");

            // Scroll to the corresponding section smoothly
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });
    burgerMenu.addEventListener('click', function () {
        this.classList.toggle('open'); // Toggle open class on burger menu
        navList.classList.toggle('open'); // Toggle open class on nav list
    });
    navLinks.forEach(function (navLink) {
        navLink.addEventListener("click", function () {
            burgerMenu.classList.remove('open');
            navList.classList.remove('open');
        });
    });
    // Show or hide the back-to-top button based on scroll position
    window.onscroll = function () {
        // sourcery skip: avoid-using-var
        var backToTopButton = document.querySelector('.sh-back-to-top');
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };

    // Scroll smoothly to the top when the button is clicked
    document.querySelector('.sh-back-to-top').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Function to update nav background color
// sourcery skip: avoid-function-declarations-in-blocks
    function updateNavBackground() {
        if (window.scrollY >= aboutSectionOffset) {
            nav.style.backgroundColor = '#333'; // Change color as needed
        } else {
            nav.style.backgroundColor = '#7878'; // Default color
        }
    }

    // Update nav background color on scroll and initially
    updateNavBackground();
    window.addEventListener('scroll', updateNavBackground);
});


