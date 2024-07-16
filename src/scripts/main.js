document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-list a");

    navLinks.forEach(function(navLink) {
        navLink.addEventListener("click", function(event) {
            event.preventDefault();

            // Remove 'active' class from all links
            navLinks.forEach(function(link) {
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
});
