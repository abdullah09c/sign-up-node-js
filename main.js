function togglePassword(inputId, eyeIcon) {
  const passwordInput = document.getElementById(inputId);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}

// Form validation and terms checking
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('sign-up-form');
  const termsCheckbox = document.getElementById('terms');
  const submitButton = document.querySelector('button[type="submit"]');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');

  // Function to show error message
  function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    element.parentElement.classList.add('error');
  }

  // Function to hide error message
  function hideError(element) {
    element.textContent = '';
    element.classList.remove('show');
    element.parentElement.classList.remove('error');
  }

  // Real-time password matching validation
  function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
      showError(confirmPasswordError, 'Passwords do not match');
      return false;
    } else {
      hideError(confirmPasswordError);
      return true;
    }
  }

  // Add event listeners for real-time validation
  confirmPasswordInput.addEventListener('input', validatePasswordMatch);
  passwordInput.addEventListener('input', function() {
    if (confirmPasswordInput.value) {
      validatePasswordMatch();
    }
  });

  // Check terms checkbox on form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Always prevent default to handle with AJAX
    
    // Clear previous errors
    hideError(passwordError);
    hideError(confirmPasswordError);
    
    if (!termsCheckbox.checked) {
      alert('Please accept the Terms and Conditions to proceed.');
      termsCheckbox.focus();
      return false;
    }
    
    // Get form data
    const formData = {
      email: document.getElementById('email').value,
      username: document.getElementById('username').value,
      password: passwordInput.value,
      'confirm-password': confirmPasswordInput.value,
      terms: termsCheckbox.checked
    };
    
    // Client-side password validation
    if (formData.password !== formData['confirm-password']) {
      showError(confirmPasswordError, 'Passwords do not match. Please check and try again.');
      return false;
    }
    
    // Disable submit button during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Creating Account...';
    
    try {
      // Send data to backend
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Account created successfully! Welcome to our platform.');
        form.reset(); // Clear the form
        hideError(passwordError);
        hideError(confirmPasswordError);
        submitButton.disabled = !termsCheckbox.checked; // Reset button state
      } else {
        alert(`Error: ${result.message}`);
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      // Re-enable submit button
      submitButton.disabled = !termsCheckbox.checked;
      submitButton.textContent = 'Sign Up';
    }
  });

  // Optional: Disable submit button until terms are accepted
  termsCheckbox.addEventListener('change', function() {
    submitButton.disabled = !this.checked;
  });
  
  // Initially disable the button
  submitButton.disabled = !termsCheckbox.checked;
});
