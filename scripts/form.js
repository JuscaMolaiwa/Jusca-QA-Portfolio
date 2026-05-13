// form.js
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const feedbackButton     = document.getElementById('feedbackButton');
  const feedbackForm       = document.getElementById('feedbackForm');
  const feedbackPrompt     = document.getElementById('feedbackPrompt');
  const closeFeedbackBtn   = document.getElementById('closeFeedbackForm');
  const feedbackStatus     = document.getElementById('feedbackStatusMessage');
  const submitFeedbackBtn  = document.getElementById('submitFeedbackBtn');

  // Show form, hide prompt
  if (feedbackButton) {
    feedbackButton.addEventListener('click', function () {
      if (feedbackForm)  feedbackForm.classList.add('visible');
      if (feedbackPrompt) feedbackPrompt.style.display = 'none';
      feedbackButton.style.display = 'none';
    });
  }

  // Close form, show prompt
  if (closeFeedbackBtn) {
    closeFeedbackBtn.addEventListener('click', function () {
      if (feedbackForm)  feedbackForm.classList.remove('visible');
      if (feedbackPrompt) feedbackPrompt.style.display = '';
      if (feedbackButton) feedbackButton.style.display = '';
      if (feedbackStatus) feedbackStatus.style.display = 'none';
    });
  }

  // Submit via fetch (JSON, no native form POST)
  if (submitFeedbackBtn) {
    submitFeedbackBtn.addEventListener('click', function () {
      const name    = document.getElementById('fb-name')    ? document.getElementById('fb-name').value.trim()    : '';
      const email   = document.getElementById('fb-email')   ? document.getElementById('fb-email').value.trim()   : '';
      const message = document.getElementById('fb-message') ? document.getElementById('fb-message').value.trim() : '';

      if (!name || name.length < 3)          { alert('Please enter your name (at least 3 characters).'); return; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
      if (!message || message.length < 10)   { alert('Feedback must be at least 10 characters.'); return; }

      submitFeedbackBtn.disabled = true;
      submitFeedbackBtn.textContent = 'Sending…';

      fetch('/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
        .then(function (response) { return response.json().then(function (data) { return { ok: response.ok, data }; }); })
        .then(function (res) {
          if (feedbackStatus) {
            feedbackStatus.style.display = 'block';
            feedbackStatus.style.color   = res.ok ? 'var(--accent)' : '#f85149';
            feedbackStatus.textContent   = res.ok
              ? (res.data.message || 'Thank you for your feedback!')
              : (res.data.message || 'There was an error submitting your feedback. Please try again.');
          }
          if (res.ok) {
            ['fb-name', 'fb-email', 'fb-message'].forEach(function (id) {
              const el = document.getElementById(id);
              if (el) el.value = '';
            });
            setTimeout(function () {
              if (feedbackStatus) feedbackStatus.style.display = 'none';
            }, 10000);
          }
        })
        .catch(function (error) {
          console.error('Feedback error:', error);
          if (feedbackStatus) {
            feedbackStatus.style.display = 'block';
            feedbackStatus.style.color   = '#f85149';
            feedbackStatus.textContent   = 'An error occurred. Please try again later.';
            setTimeout(function () { feedbackStatus.style.display = 'none'; }, 10000);
          }
        })
        .finally(function () {
          submitFeedbackBtn.disabled    = false;
          submitFeedbackBtn.innerHTML   = '<i class="fas fa-paper-plane"></i> Submit';
        });
    });
  }
});
