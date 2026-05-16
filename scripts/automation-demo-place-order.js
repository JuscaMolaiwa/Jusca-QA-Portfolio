// automation-demo-place-order.js — Place order test
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const btn            = document.getElementById('placeOrderButton');
  const statusMessage  = document.getElementById('orderStatusMessage');
  const result         = document.getElementById('orderResult');
  const skeleton       = document.getElementById('orderSkeleton');
  const screenshotLink = document.getElementById('orderScreenshotLink');
  const videoLink      = document.getElementById('orderVideoLink');
  const reportLink     = document.getElementById('orderReportLink');
  const logsLink       = document.getElementById('orderLogsLink');
  const reportSection  = document.getElementById('orderReportSection');

  if (!btn) return;

  function showSkeleton() {
    if (skeleton) skeleton.style.display = 'flex';
  }
  function hideSkeleton() {
    if (skeleton) skeleton.style.display = 'none';
  }

  btn.addEventListener('click', function () {
    // Reset
    result.textContent = '';
    result.style.display = 'none';
    result.classList.remove('success', 'failure');
    [screenshotLink, videoLink, reportLink, logsLink].forEach(function (el) {
      if (el) el.style.display = 'none';
    });
    if (reportSection) reportSection.style.display = 'none';

    // Show skeleton while test runs
    showSkeleton();

    btn.disabled                = true;
    statusMessage.textContent   = 'Placing order… Please wait…';
    statusMessage.className     = 'demo-status running';
    statusMessage.style.display = 'flex';

    fetch('https://jusca.pythonanywhere.com/place-order', { method: 'POST' })
      .then(function (response) {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(function (data) {
        hideSkeleton();
        statusMessage.textContent    = '';
        statusMessage.className      = 'demo-status';
        statusMessage.style.display  = 'none';

        result.innerText     = data.result;
        result.style.display = 'inline-block';
        result.classList.remove('success', 'failure');
        result.classList.add(data.result.includes('successful') ? 'success' : 'failure');

        var hasLinks = false;
        if (data.screenshot && screenshotLink) {
          screenshotLink.href          = 'https://jusca.pythonanywhere.com' + data.screenshot;
          screenshotLink.style.display = 'inline-flex';
          hasLinks = true;
        }
        if (data.video && videoLink) {
          videoLink.href          = 'https://jusca.pythonanywhere.com' + data.video;
          videoLink.style.display = 'inline-flex';
          hasLinks = true;
        }
        if (data.logs && logsLink) {
          logsLink.href          = 'https://jusca.pythonanywhere.com' + data.logs;
          logsLink.style.display = 'inline-flex';
          hasLinks = true;
        }
        if (data.report && reportLink) {
          reportLink.href          = 'https://jusca.pythonanywhere.com' + data.report;
          reportLink.style.display = 'inline-flex';
          hasLinks = true;
        }
        if (reportSection) reportSection.style.display = hasLinks ? 'flex' : 'none';

        btn.disabled = false;
      })
      .catch(function (error) {
        hideSkeleton();
        statusMessage.textContent    = '';
        statusMessage.className      = 'demo-status error';
        statusMessage.style.display  = 'flex';
        result.innerText             = 'An error occurred while running the test: ' + error;
        result.classList.add('failure');
        result.style.display         = 'inline-block';
        btn.disabled                 = false;
      });
  });
});