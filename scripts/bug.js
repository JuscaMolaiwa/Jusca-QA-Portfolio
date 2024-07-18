document.addEventListener("DOMContentLoaded", function () {
    const stickyBugHunterLink = document.querySelector('.sticky-nav .nav-link[href="#BugHunter"]');
    const stickyBugIcon = document.querySelector('.sticky-nav .bug-icon');
    const hiddenBugHunterLink = document.querySelector('#navMenu .nav-link[href="#BugHunter"]');
    const hiddenBugIcon = document.querySelector('#navMenu .bug-icon');

    // Function to animate the bug icon
// sourcery skip: avoid-function-declarations-in-blocks
    function animateBugIcon(bugIcon) {
        bugIcon.classList.add('running');
        setTimeout(function () {
            bugIcon.classList.remove('running');
        }, 5000); // Adjust timing to match animation duration
    }

    // Add click event listener for the sticky navigation menu
    if (stickyBugHunterLink && stickyBugIcon) {
        stickyBugHunterLink.addEventListener('click', function (event) {
            event.preventDefault();
            animateBugIcon(stickyBugIcon);
        });
    }

    // Add click event listener for the hidden navigation menu
    if (hiddenBugHunterLink && hiddenBugIcon) {
        hiddenBugHunterLink.addEventListener('click', function (event) {
            event.preventDefault();
            animateBugIcon(hiddenBugIcon);
        });
    }
});
