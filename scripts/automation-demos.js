document.getElementById('runLoginTestButton').addEventListener('click', function() {
    const statusMessage = document.getElementById("loginStatusMessage");
    const result = document.getElementById("loginResult");
    const screenshotLink = document.getElementById("loginScreenshotLink");
    const videoLink = document.getElementById("loginVideoLink");
    const reportLink = document.getElementById("loginReportLink");
    const logsLink = document.getElementById("loginLogsLink");
    const reportSection = document.getElementById("loginReportSection");

    // Reset previous result and hide the links
    result.textContent = "";
    screenshotLink.style.display = 'none';
    videoLink.style.display = 'none';
    reportLink.style.display = 'none';
    logsLink.style.display = 'none';
    result.classList.remove('success', 'failure');

    // Check if the button is already disabled
    this.disabled = true;

    // Update the status message
    statusMessage.textContent = "Running test... Please wait...";

    // Make the fetch request to run the test
    fetch('https://jusca.pythonanywhere.com/run-login-test', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Clear the status message
        statusMessage.textContent = "";

        // Update the result with the response from the server
        result.innerText = data.result;
        result.style.display = 'inline-block'; // Show the result message
         // Clear any previous success or failure classes
        result.classList.remove('success', 'failure');

         // Apply success or failure class based on the result text
         if (data.result.includes("successful")) {
            result.classList.add("success"); // Add success class
        } else {
            result.classList.add("failure"); // Add failure class
        }

        // Initialize a flag to track if any links are shown
        let hasLinks = false;

        // Check if screenshot URL is available, then update the link and show it
        if (data.screenshot) {
            screenshotLink.href = `https://jusca.pythonanywhere.com${data.screenshot}`;
            screenshotLink.style.display = 'block';
            hasLinks = true; // Set the flag to true
        }

        // Check if video URL is available, then update the link and show it
        if (data.video) {
            videoLink.href = `https://jusca.pythonanywhere.com${data.video}`;
            videoLink.style.display = 'block';
            hasLinks = true; // Set the flag to true
        }

        // Check if report URL is available, then update the link and show it
        if (data.report) {
            reportLink.href = `https://jusca.pythonanywhere.com${data.report}`;
            reportLink.style.display = 'block';
            hasLinks = true; // Set the flag to true
        }

        // Check if logs URL is available, then update the link and show it
        if (data.logs) {
            logsLink.href = `https://jusca.pythonanywhere.com${data.logs}`;
            logsLink.style.display = 'block';
            hasLinks = true; // Set the flag to true
        }

        // Show the report section if any link is available
        reportSection.style.display = hasLinks ? 'block' : 'none';

        alert(data.result);  // Display the test result

        // Re-enable the button after result is shown
        this.disabled = false;
    })
    .catch(error => {
        // Clear the status message and show error
        statusMessage.textContent = "";
        result.innerText = 'An error occurred while running the test: ' + error;
        result.classList.add("failure"); // Show as failure
        result.style.display = 'inline-block'; // Show the error message
        // Re-enable the button after result is shown
        this.disabled = false;
    });
});
