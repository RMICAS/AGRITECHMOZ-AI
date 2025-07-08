document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');
    
    // Hardcoded credentials as specified in requirements
    const validUsername = 'agritechmoz';
    const validPassword = 'password123';
    
    // Function to validate login
    function validateLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Check if fields are empty
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }
        
        // Check credentials
        if (username === validUsername && password === validPassword) {
            // Store login state in localStorage
            localStorage.setItem('agritechmoz_logged_in', 'true');
            
            // Redirect to main page
            window.location.href = 'index.html';
        } else {
            showError('Invalid username or password');
        }
    }
    
    // Function to show error message
    function showError(message) {
        loginError.textContent = message;
        loginError.classList.remove('d-none');
        
        // Hide error after 3 seconds
        setTimeout(() => {
            loginError.classList.add('d-none');
        }, 3000);
    }
    
    // Event listeners
    loginButton.addEventListener('click', validateLogin);
    
    // Allow login with Enter key
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateLogin();
        }
    });
    
    // Check if user is already logged in
    if (localStorage.getItem('agritechmoz_logged_in') === 'true') {
        window.location.href = 'index.html';
    }
});
