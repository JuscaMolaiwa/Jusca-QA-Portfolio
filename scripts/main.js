document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-list a");
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.sticky-nav');
    const sections = document.querySelectorAll("section");
    const aboutSection = document.querySelector('#about');
    const bugIcon = document.querySelector('.bug-icon');
    const aboutSectionOffset = aboutSection.offsetTop;

    
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
            }
        }
    }
    
    // Initial update of active nav link and nav background color
    updateActiveNavLink();

    // Update active nav link and nav background color on scroll
    window.addEventListener("scroll", function () {
        updateActiveNavLink();
    });

    // Smooth scroll to section on nav link click
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
                if (targetId === 'Home' || targetId === 'Skills') {
                    animateBugIcon();
                }

            }
        });
    });

    // Toggle burger menu and nav list on mobile
    burgerMenu.addEventListener("click", function () {
        this.classList.toggle("open"); // Toggle open class on burger menu
        nav.classList.toggle("open"); // Toggle open class on nav (sticky-nav)
    });

    // Close burger menu and nav list on nav link click (mobile)
    navLinks.forEach(function (navLink) {
        navLink.addEventListener("click", function () {
            burgerMenu.classList.remove("open");
            nav.classList.remove("open");
        });
    });

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
        // Example logic for changing nav background color based on section
        switch (sectionId) {
            case 'home':
                nav.style.backgroundColor = '#7878'; // Color for 'Home' section
                break;
            case 'about me':
                nav.style.backgroundColor = '#BBB23'; // Color for 'About Me' section
                break;
            case 'resume':
                nav.style.backgroundColor = '#ABB'; // Color for 'Resume' section
                break;
            case 'projects':
                nav.style.backgroundColor = 'cream-white'; // Color for 'Projects' section
                break;
            case 'skills':
                nav.style.backgroundColor = '#BBB'; // Color for 'Skills' section
                break;
            case 'education':
                nav.style.backgroundColor = '#787'; // Color for 'Certifications' section
                break;
            case 'contact':
                nav.style.backgroundColor = '#788'; // Color for 'Contact' section
                break;
            default:
                nav.style.backgroundColor = '#7878'; // Default color
                break;
        }
    }
});
