document.getElementById('feedbackButton').addEventListener('click', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackPrompt = document.getElementById('feedbackPrompt'); // Reference to the feedback prompt section

    feedbackForm.style.display = 'block'; // Show the feedback form
    feedbackPrompt.style.display = 'none'; // Hide the feedback prompt (text and button)
});

document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const formData = new FormData(this); // Gather form data
    fetch('/submit-feedback', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const feedbackStatusMessage = document.getElementById('feedbackStatusMessage');
        feedbackStatusMessage.style.display = 'block'; // Show the feedback status message

        // Check the status from the server response
        if (data.status === 'success') {
            feedbackStatusMessage.textContent = data.message; // Display success message

            // Clear the form after successful submission
            this.reset(); // Reset the form fields

            // Hide the success message after 5 seconds
            setTimeout(() => {
                feedbackStatusMessage.style.display = 'none'; // Hide the message
            }, 10000); // 5000 milliseconds = 5 seconds

        } else {
            feedbackStatusMessage.textContent = 'There was an error submitting your feedback. Please try again.'; // Error message

            // Hide the error message after 5 seconds
            setTimeout(() => {
                feedbackStatusMessage.style.display = 'none'; // Hide the message
            }, 10000); // 5000 milliseconds = 5 seconds
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('feedbackStatusMessage').textContent = 'An error occurred. Please try again later.';

        // Hide the error message after 5 seconds
        setTimeout(() => {
            feedbackStatusMessage.style.display = 'none'; // Hide the message
        }, 10000); // 5000 milliseconds = 5 seconds
    });
});

// Close button functionality
document.getElementById('closeFeedbackForm').addEventListener('click', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackPrompt = document.getElementById('feedbackPrompt'); // Reference to the feedback prompt section

    feedbackForm.style.display = 'none'; // Hide the feedback form
    feedbackPrompt.style.display = 'block'; // Show the feedback prompt (text and button)
});
