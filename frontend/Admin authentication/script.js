// Admin Login/Register Script

// ============================================
// Toggle between Login and Register modes
// ============================================
const signinBtn = document.getElementById('signinBtn');
const signupBtn = document.getElementById('signupBtn');
const nameField = document.getElementById('nameField');
const title = document.getElementById('title');

let isLoginMode = false;

function switchToLogin() {
  isLoginMode = true;
  title.innerText = 'Admin Login';
  nameField.style.maxHeight = '0';
  nameField.style.overflow = 'hidden';
  signinBtn.style.background = '#4bb564';
  signinBtn.style.color = '#fff';
  signinBtn.style.border = 'none';
  signupBtn.style.background = '#fff';
  signupBtn.style.color = '#555';
  signupBtn.style.border = '1px solid #4bb564';
}

function switchToRegister() {
  isLoginMode = false;
  title.innerText = 'Admin Register';
  nameField.style.maxHeight = '65px';
  nameField.style.overflow = 'visible';
  signupBtn.style.background = '#4bb564';
  signupBtn.style.color = '#fff';
  signupBtn.style.border = 'none';
  signinBtn.style.background = '#fff';
  signinBtn.style.color = '#555';
  signinBtn.style.border = '1px solid #4bb564';
}

if (signinBtn) {
  signinBtn.addEventListener('click', async () => {
    if (!isLoginMode) {
      // First click: switch to login mode
      switchToLogin();
      return;
    }

    // Already in login mode: perform admin login
    const emailInput = document.querySelector('.input-group input[type="email"]');
    const passwordInput = document.getElementById('passwordInput');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }

    showLoading(signinBtn);

    try {
      const result = await loginAPI(email, password);

      if (result.success) {
        if (result.data.role !== 'admin') {
          showToast('Access denied. Admin privileges required.', 'error');
          hideLoading(signinBtn);
          return;
        }

        saveToLocalStorage('token', result.data.token);
        saveToLocalStorage('user', result.data);
        window.location.href = '../Admin dashboard/admin-dashboard.html';
      } else {
        showToast(result.error || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('An error occurred during login', 'error');
    } finally {
      hideLoading(signinBtn);
    }
  });
}

if (signupBtn) {
  signupBtn.addEventListener('click', async () => {
    if (isLoginMode) {
      // First click: switch to register mode
      switchToRegister();
      return;
    }

    // Already in register mode: perform admin registration
    const nameInput = document.querySelector('#nameField input[type="text"]');
    const emailInput = document.querySelector('.input-group input[type="email"]');
    const passwordInput = document.getElementById('passwordInput');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }

    if (!validatePassword(password)) {
      showToast('Password must be at least 8 characters long and contain at least one letter and one number', 'warning', 5000);
      return;
    }

    showLoading(signupBtn);

    try {
      const result = await registerAPI(name, email, password, 'admin');

      if (result.success) {
        saveToLocalStorage('token', result.data.token);
        saveToLocalStorage('user', result.data);
        window.location.href = '../Admin dashboard/admin-dashboard.html';
      } else {
        showToast(result.error || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('An error occurred during registration', 'error');
    } finally {
      hideLoading(signupBtn);
    }
  });
}

// ============================================
// Demo Login (bypasses backend for quick testing)
// ============================================
const demoLoginBtn = document.getElementById('demoLoginBtn');
if (demoLoginBtn) {
  demoLoginBtn.addEventListener('click', () => {
    const demoAdmin = {
      _id: 'demo_admin_001',
      name: 'Demo Admin',
      email: 'admin@example.com',
      role: 'admin',
      token: 'demo-token-admin-12345'
    };

    saveToLocalStorage('token', demoAdmin.token);
    saveToLocalStorage('user', demoAdmin);

    window.location.href = '../Admin dashboard/admin-dashboard.html';
  });
}
