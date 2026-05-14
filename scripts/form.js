// form.js
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const FEEDBACK_URL = 'https://jusca.pythonanywhere.com/submit-feedback';

  const feedbackButton    = document.getElementById('feedbackButton');
  const feedbackForm      = document.getElementById('feedbackForm');
  const feedbackPrompt    = document.getElementById('feedbackPrompt');
  const closeFeedbackBtn  = document.getElementById('closeFeedbackForm');
  const feedbackStatus    = document.getElementById('feedbackStatusMessage');
  const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');

  // ── Always read values fresh — never cache .value ────────────────────
  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  // ── Inline error helpers ──────────────────────────────────────────────
  function setError(inputId, errorId, show) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (input) input.classList.toggle('invalid', show);
    if (error) error.classList.toggle('visible', show);
  }

  function clearAllErrors() {
    setError('fb-name',    'fb-name-error',    false);
    setError('fb-email',   'fb-email-error',   false);
    setError('fb-message', 'fb-message-error', false);
  }

  // Clear a field's error on both 'input' (desktop) and 'change' (mobile autocomplete / blur)
  ['fb-name', 'fb-email', 'fb-message'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    ['input', 'change'].forEach(function (evt) {
      el.addEventListener(evt, function () {
        setError(id, id + '-error', false);
      });
    });
  });

  // ── Show / hide form ──────────────────────────────────────────────────
  if (feedbackButton) {
    feedbackButton.addEventListener('click', function () {
      if (feedbackForm)   feedbackForm.classList.add('visible');
      if (feedbackPrompt) feedbackPrompt.style.display = 'none';
      feedbackButton.style.display = 'none';
      if (feedbackStatus) feedbackStatus.style.display = 'none';
      clearAllErrors();
    });
  }

  if (closeFeedbackBtn) {
    closeFeedbackBtn.addEventListener('click', function () {
      if (feedbackForm)   feedbackForm.classList.remove('visible');
      if (feedbackPrompt) feedbackPrompt.style.display = '';
      if (feedbackButton) feedbackButton.style.display = '';
      if (feedbackStatus) feedbackStatus.style.display = 'none';
      clearAllErrors();
    });
  }

  // ── Status message ────────────────────────────────────────────────────
  function showStatus(message, isSuccess, autohide) {
    if (!feedbackStatus) return;
    feedbackStatus.style.display = 'block';
    feedbackStatus.style.color   = isSuccess ? 'var(--accent)' : '#f85149';
    feedbackStatus.textContent   = message;
    if (autohide) {
      setTimeout(function () {
        if (feedbackStatus) feedbackStatus.style.display = 'none';
      }, 10000);
    }
  }

  // ── Validate — reads values fresh every time ──────────────────────────
  function validate() {
    // Read fresh at the moment of submit — don't rely on cached refs
    var name    = getVal('fb-name');
    var email   = getVal('fb-email');
    var message = getVal('fb-message');

    var valid = true;

    if (name.length < 3) {
      setError('fb-name', 'fb-name-error', true);
      valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('fb-email', 'fb-email-error', true);
      valid = false;
    }

    if (message.length < 10) {
      setError('fb-message', 'fb-message-error', true);
      valid = false;
    }

    // Focus first invalid field so mobile keyboard opens on the right one
    if (!valid && feedbackForm) {
      var firstInvalid = feedbackForm.querySelector('input.invalid, textarea.invalid');
      if (firstInvalid) firstInvalid.focus();
    }

    return valid;
  }

  // ── Submit ────────────────────────────────────────────────────────────
  if (submitFeedbackBtn) {
    submitFeedbackBtn.addEventListener('click', function () {

      // Re-read values right now, right here
      var name    = getVal('fb-name');
      var email   = getVal('fb-email');
      var message = getVal('fb-message');

      if (!validate()) return;

      submitFeedbackBtn.disabled  = true;
      submitFeedbackBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending\u2026';

      fetch(FEEDBACK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name, email: email, message: message })
      })
        .then(function (response) {
          return response.json()
            .then(function (data) { return { ok: response.ok, status: response.status, data: data }; })
            .catch(function ()    { return { ok: response.ok, status: response.status, data: {} }; });
        })
        .then(function (res) {
          if (res.ok) {
            showStatus(res.data.message || 'Thank you for your feedback!', true, true);
            ['fb-name', 'fb-email', 'fb-message'].forEach(function (id) {
              var el = document.getElementById(id);
              if (el) el.value = '';
            });
            clearAllErrors();
          } else {
            var msg = res.data.message
              || (res.status === 404 ? 'Feedback endpoint not found. The backend may be offline.'
              :   res.status >= 500  ? 'The server encountered an error. Please try again later.'
              :                        'Submission failed. Please try again.');
            showStatus(msg, false, true);
          }
        })
        .catch(function (error) {
          console.error('Feedback fetch error:', error);
          showStatus(
            navigator.onLine
              ? 'Could not reach the feedback server. It may be temporarily offline \u2014 please try again shortly.'
              : 'You appear to be offline. Please check your connection and try again.',
            false,
            true
          );
        })
        .finally(function () {
          submitFeedbackBtn.disabled  = false;
          submitFeedbackBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';
        });
    });
  }

});