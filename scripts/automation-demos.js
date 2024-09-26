document.getElementById('runTestButton').addEventListener('click', function() {
    const statusMessage = document.getElementById("statusMessage");
    const result = document.getElementById("result");

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

        // Optionally, handle screenshots and videos here
        // You can append links to the result or manage them separately
    })
    .catch(error => {
        // Clear the status message and show error
        statusMessage.textContent = "";
        result.innerText = 'Error executing test: ' + error;
    });
});


