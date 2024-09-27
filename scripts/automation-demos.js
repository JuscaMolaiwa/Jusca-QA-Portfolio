document.getElementById('runTestButton').addEventListener('click', function() {
    const statusMessage = document.getElementById("statusMessage");
    const result = document.getElementById("result");
    const screenshotLink = document.getElementById("screenshotLink");
    const videoLink = document.getElementById("videoLink");
    const reportLink = document.getElementById("reportLink");

    // Reset previous result and hide the links
    result.textContent = "";
    screenshotLink.style.display = 'none';  
    videoLink.style.display = 'none';      
    reportLink.style.display = 'none';
    logsLink.style.display = 'none';
    result.classList.remove('success', 'failure'); 

 

    // Update the status message
    statusMessage.textContent = "Running test... Please wait...";

    // Make the fetch request to run the test
    fetch('http://127.0.0.1:5000/run-test', {  
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
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

        // Check if screenshot URL is available, then update the link and show it
        if (data.screenshot) {
            screenshotLink.href = `http://127.0.0.1:5000${data.screenshot}`;
            screenshotLink.style.display = 'block';
        }

        alert(data.result);  // Display the test result

        // Check if video URL is available, then update the link and show it
        if (data.video) {
            videoLink.href = `http://127.0.0.1:5000${data.video}`;
            videoLink.style.display = 'block';
        }

        // Check if report URL is available, then update the link and show it
        if (data.report) {
            reportLink.href = `http://127.0.0.1:5000${data.report}`;
            reportLink.style.display = 'block';
        }

        // Check if logs URL is available, then update the link and show it
        if (data.logs) {
            logsLink.href = `http://127.0.0.1:5000${data.logs}`;
            logsLink.style.display = 'block';
        }
    })
    .catch(error => {
        // Clear the status message and show error
        statusMessage.textContent = "";
        result.innerText = 'An error occurred while running the test: ' + error;
        result.classList.add("failure"); // Show as failure
        result.style.display = 'inline-block'; // Show the error message
    });
});
