// automation-demos.js — Login test
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const btn            = document.getElementById('runLoginTestButton');
  const statusMessage  = document.getElementById('loginStatusMessage');
  const result         = document.getElementById('loginResult');
  const screenshotLink = document.getElementById('loginScreenshotLink');
  const videoLink      = document.getElementById('loginVideoLink');
  const reportLink     = document.getElementById('loginReportLink');
  const logsLink       = document.getElementById('loginLogsLink');
  const reportSection  = document.getElementById('loginReportSection');

  if (!btn) return;

  btn.addEventListener('click', function () {
    // Reset
    result.textContent = '';
    result.style.display = 'none';
    result.classList.remove('success', 'failure');
    [screenshotLink, videoLink, reportLink, logsLink].forEach(function (el) {
      if (el) el.style.display = 'none';
    });
    if (reportSection) reportSection.style.display = 'none';

    btn.disabled = true;
    statusMessage.textContent    = 'Running test… Please wait…';
    statusMessage.className      = 'demo-status running';
    statusMessage.style.display  = 'flex';

    fetch('https://jusca.pythonanywhere.com/run-login-test', { method: 'POST' })
      .then(function (response) {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(function (data) {
        statusMessage.textContent   = '';
        statusMessage.className     = 'demo-status';
        statusMessage.style.display = 'none';

        // Show result inline — no alert()
        result.innerText     = data.result;
        result.style.display = 'inline-block';
        result.classList.remove('success', 'failure');
        result.classList.add(data.result.includes('successful') ? 'success' : 'failure');

        var hasLinks = false;

        if (data.screenshot && screenshotLink) {
          screenshotLink.href         = 'https://jusca.pythonanywhere.com' + data.screenshot;
          screenshotLink.style.display = 'inline-flex';
          hasLinks = true;
        }
        if (data.video && videoLink) {
          videoLink.href         = 'https://jusca.pythonanywhere.com' + data.video;
          videoLink.style.display = 'inline-flex';
          hasLinks = true;
        }
        if (data.logs && logsLink) {
          logsLink.href         = 'https://jusca.pythonanywhere.com' + data.logs;
          logsLink.style.display = 'inline-flex';
          hasLinks = true;
        }
        if (data.report && reportLink) {
          reportLink.href         = 'https://jusca.pythonanywhere.com' + data.report;
          reportLink.style.display = 'inline-flex';
          hasLinks = true;
        }

        if (reportSection) reportSection.style.display = hasLinks ? 'flex' : 'none';

        btn.disabled = false;
      })
      .catch(function (error) {
        statusMessage.textContent = '';
        statusMessage.className   = 'demo-status error';
        result.innerText          = 'An error occurred while running the test: ' + error;
        result.classList.add('failure');
        result.style.display = 'inline-block';
        btn.disabled         = false;
      });
  });
});