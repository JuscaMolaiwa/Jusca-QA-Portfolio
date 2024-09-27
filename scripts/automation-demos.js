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


        // Check if screenshot URL is available, then update the link and show it
        if (data.screenshot) {
            // Assume the environment variable DOCKER_ENV is set in Docker but not locally
            const isDocker = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

            const baseUrl = isDocker ? 'http://host.docker.internal:5000' : 'http://127.0.0.1:5000';
            
            screenshotLink.href = `${baseUrl}${data.screenshot}`;
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
    });
});
