document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');

    function validateName() {
        const name = nameInput ? nameInput.value : '';
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            if (nameError) nameError.textContent = 'Name should contain only letters.';
        } else {
            if (nameError) nameError.textContent = '';
        }
    }

    function validateEmail() {
        const email = emailInput ? emailInput.value : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (emailError) emailError.textContent = 'Enter a valid email address.';
        } else {
            if (emailError) emailError.textContent = '';
        }
    }

    function validatePhone() {
        const phone = phoneInput ? phoneInput.value : '';
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(phone)) {
            if (phoneError) phoneError.textContent = 'Phone number should contain only numbers.';
        } else {
            if (phoneError) phoneError.textContent = '';
        }
    }

    function validatePassword() {
        const password = passwordInput ? passwordInput.value : '';
        if (password.length < 6) {
            if (passwordError) passwordError.textContent = 'Password must contain at least 6 characters.';
        } else {
            if (passwordError) passwordError.textContent = '';
        }
    }

    function validateConfirmPassword() {
        const password = passwordInput ? passwordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
        if (confirmPassword !== password) {
            if (confirmPasswordError) confirmPasswordError.textContent = 'Passwords do not match.';
        } else {
            if (confirmPasswordError) confirmPasswordError.textContent = '';
        }
    }

    // Add event listeners for validation
    if (nameInput) nameInput.addEventListener('input', validateName);
    if (emailInput) emailInput.addEventListener('input', validateEmail);
    if (phoneInput) phoneInput.addEventListener('input', validatePhone);
    if (passwordInput) passwordInput.addEventListener('input', validatePassword);
    if (confirmPasswordInput) confirmPasswordInput.addEventListener('input', validateConfirmPassword);

    // Signup form functionality
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            validateName();
            validateEmail();
            validatePhone();
            validatePassword();
            validateConfirmPassword();

            // Check for any validation errors
            if (nameError.textContent || emailError.textContent || phoneError.textContent || passwordError.textContent || confirmPasswordError.textContent) {
                return; // Do not submit if there are validation errors
            }

            const name = nameInput.value;
            const email = emailInput.value;
            const phone = phoneInput.value;
            const password = passwordInput.value;

            // Send signup request to the backend
            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        password,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Signup successful!');
                    window.location.href = 'login.html'; // Redirect to login page
                } else {
                    alert(data.error || 'An error occurred during signup.');
                }
            } catch (error) {
                console.error('Error during signup:', error);
                alert('An error occurred during signup.');
            }
        });
    }

    // Login form functionality
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const loginName = document.getElementById('login-name').value;
            const loginPassword = document.getElementById('login-password').value;

            // Send login request to the backend
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: loginName,
                        password: loginPassword,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login successful!');
                    window.location.href = 'services.html'; // Redirect to services page
                } else {
                    alert('Invalid name or password!');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login.');
            }
        });
    }
});
