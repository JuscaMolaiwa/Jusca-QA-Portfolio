document.getElementById('placeOrderButton').addEventListener('click', function() {
    const statusMessage = document.getElementById("orderStatusMessage");
    const result = document.getElementById("orderResult");
    const screenshotLink = document.getElementById("orderScreenshotLink");
    const videoLink = document.getElementById("orderVideoLink");
    const reportLink = document.getElementById("orderReportLink");
    const logsLink = document.getElementById("orderLogsLink");
    const reportSection = document.getElementById("orderReportSection");

    // Reset previous result and hide the links
    result.textContent = "";
    screenshotLink.style.display = 'none';
    videoLink.style.display = 'none';
    reportLink.style.display = 'none';
    logsLink.style.display = 'none';
    result.classList.remove('success', 'failure');

    this.disabled = true;
    statusMessage.textContent = "Placing order... Please wait...";

    fetch('https://jusca.pythonanywhere.com/place-order', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        statusMessage.textContent = "";
        result.innerText = data.result;
        result.style.display = 'inline-block';
        result.classList.add(data.result.includes("successful") ? "success" : "failure");

        let hasLinks = false;
        if (data.screenshot) {
            screenshotLink.href = `https://jusca.pythonanywhere.com${data.screenshot}`;
            screenshotLink.style.display = 'block';
            hasLinks = true;
        }
        if (data.video) {
            videoLink.href = `https://jusca.pythonanywhere.com${data.video}`;
            videoLink.style.display = 'block';
            hasLinks = true;
        }
        if (data.logs) {
            logsLink.href = `https://jusca.pythonanywhere.com${data.logs}`;
            logsLink.style.display = 'block';
            hasLinks = true;
        }
        if (data.report) {
            reportLink.href = `https://jusca.pythonanywhere.com${data.report}`;
            reportLink.style.display = 'block';
            hasLinks = true;
        }
        reportSection.style.display = hasLinks ? 'block' : 'none';

        alert(data.result);
        this.disabled = false;
    })
    .catch(error => {
        statusMessage.textContent = "";
        result.innerText = 'An error occurred: ' + error;
        result.classList.add("failure");
        result.style.display = 'inline-block';
        this.disabled = false;
    });
});
