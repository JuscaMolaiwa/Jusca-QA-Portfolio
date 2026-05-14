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

  const nameEl    = document.getElementById('fb-name');
  const emailEl   = document.getElementById('fb-email');
  const messageEl = document.getElementById('fb-message');

  const nameErr    = document.getElementById('fb-name-error');
  const emailErr   = document.getElementById('fb-email-error');
  const messageErr = document.getElementById('fb-message-error');

  // ── Inline error helpers ──────────────────────────────────────────────
  function setError(input, errorEl, show) {
    if (!input || !errorEl) return;
    input.classList.toggle('invalid', show);
    errorEl.classList.toggle('visible', show);
  }

  function clearErrors() {
    setError(nameEl,    nameErr,    false);
    setError(emailEl,   emailErr,   false);
    setError(messageEl, messageErr, false);
  }

  // Clear error on each field as soon as the user starts typing
  [nameEl, emailEl, messageEl].forEach(function (el) {
    if (!el) return;
    el.addEventListener('input', function () {
      const errEl = document.getElementById(el.id + '-error');
      setError(el, errEl, false);
    });
  });

  // ── Show / hide form ─────────────────────────────────────────────────
  if (feedbackButton) {
    feedbackButton.addEventListener('click', function () {
      if (feedbackForm)   feedbackForm.classList.add('visible');
      if (feedbackPrompt) feedbackPrompt.style.display = 'none';
      feedbackButton.style.display = 'none';
      if (feedbackStatus) feedbackStatus.style.display = 'none';
      clearErrors();
    });
  }

  if (closeFeedbackBtn) {
    closeFeedbackBtn.addEventListener('click', function () {
      if (feedbackForm)   feedbackForm.classList.remove('visible');
      if (feedbackPrompt) feedbackPrompt.style.display = '';
      if (feedbackButton) feedbackButton.style.display = '';
      if (feedbackStatus) feedbackStatus.style.display = 'none';
      clearErrors();
    });
  }

  // ── Status helper ─────────────────────────────────────────────────────
  function showStatus(message, isSuccess, autohide) {
    if (!feedbackStatus) return;
    feedbackStatus.style.display = 'block';
    feedbackStatus.style.color   = isSuccess ? 'var(--accent)' : '#f85149';
    feedbackStatus.textContent   = message;
    if (autohide) {
      setTimeout(function () { feedbackStatus.style.display = 'none'; }, 10000);
    }
  }

  // ── Validate ──────────────────────────────────────────────────────────
  function validate() {
    const name    = nameEl    ? nameEl.value.trim()    : '';
    const email   = emailEl   ? emailEl.value.trim()   : '';
    const message = messageEl ? messageEl.value.trim() : '';

    let valid = true;

    if (!name || name.length < 3) {
      setError(nameEl, nameErr, true);
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(emailEl, emailErr, true);
      valid = false;
    }
    if (!message || message.length < 10) {
      setError(messageEl, messageErr, true);
      valid = false;
    }

    // Focus the first invalid field
    if (!valid) {
      const firstInvalid = feedbackForm.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
    }

    return valid;
  }

  // ── Submit ────────────────────────────────────────────────────────────
  if (submitFeedbackBtn) {
    submitFeedbackBtn.addEventListener('click', function () {
      if (!validate()) return;

      const name    = nameEl.value.trim();
      const email   = emailEl.value.trim();
      const message = messageEl.value.trim();

      submitFeedbackBtn.disabled  = true;
      submitFeedbackBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      fetch(FEEDBACK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message })
      })
        .then(function (response) {
          return response.json()
            .then(function (data) { return { ok: response.ok, status: response.status, data }; })
            .catch(function ()    { return { ok: response.ok, status: response.status, data: {} }; });
        })
        .then(function (res) {
          if (res.ok) {
            showStatus(res.data.message || 'Thank you for your feedback!', true, true);
            [nameEl, emailEl, messageEl].forEach(function (el) { if (el) el.value = ''; });
          } else {
            const msg = res.data.message
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
              ? 'Could not reach the feedback server. It may be temporarily offline - please try again shortly.'
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