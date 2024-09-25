document.getElementById('runTestButton').addEventListener('click', function() {
        document.getElementById('result').innerText = 'Running test, please wait...';

        fetch('http://your-server-url/run-test', {  // Replace with actual server URL
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = data.result;
        })
        .catch(error => {
            document.getElementById('result').innerText = 'Error executing test: ' + error;
        });
    });

