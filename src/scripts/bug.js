document.addEventListener("DOMContentLoaded", function () {
    const bugHunterLink = document.querySelector('.nav-link[href="#BugHunter"]');
    const bugIcon = document.querySelector('.bug-icon');

    if (bugHunterLink && bugIcon) {
        bugHunterLink.addEventListener('click', function (event) {
            event.preventDefault();
            bugIcon.classList.toggle('running');
        });
    }
});
