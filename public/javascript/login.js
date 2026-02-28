const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageBox = document.getElementById('message-box');
const loginBtnText = document.getElementById('login-btn-text');
const registerBtnText = document.getElementById('register-btn-text');

function showForm(formToShow) {
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  formToShow.classList.remove('hidden');
  messageBox.classList.add('hidden');
}

function setActiveTab(tabToActivate) {
  loginTab.classList.remove('bg-white', 'shadow-lg', 'text-gray-900');
  registerTab.classList.remove('bg-white', 'shadow-lg', 'text-gray-900');
  loginTab.classList.add('text-gray-600', 'hover:bg-gray-200');
  registerTab.classList.add('text-gray-600', 'hover:bg-gray-200');

  tabToActivate.classList.add('bg-white', 'shadow-lg', 'text-gray-900');
  tabToActivate.classList.remove('text-gray-600', 'hover:bg-gray-200');
}

loginTab.addEventListener('click', () => {
  showForm(loginForm);
  setActiveTab(loginTab);
});

registerTab.addEventListener('click', () => {
  showForm(registerForm);
  setActiveTab(registerTab);
});

function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
  if (type === 'error') {
    messageBox.classList.add('bg-red-100', 'text-red-700');
  } else if (type === 'success') {
    messageBox.classList.add('bg-green-100', 'text-green-700');
  }
}

// Validation helpers
function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.remove('border-green-400', 'bg-green-50');
  inputEl.classList.remove('border-gray-200', 'bg-gray-50');
  inputEl.classList.add('border-red-400', 'bg-red-50');
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

function showFieldSuccess(inputEl, errorEl) {
  inputEl.classList.remove('border-red-400', 'bg-red-50');
  inputEl.classList.remove('border-gray-200', 'bg-gray-50');
  inputEl.classList.add('border-green-400', 'bg-green-50');
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

function clearField(inputEl, errorEl) {
  inputEl.classList.remove('border-red-400', 'bg-red-50', 'border-green-400', 'bg-green-50');
  inputEl.classList.add('border-gray-200', 'bg-gray-50');
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Armenian phone validation: +374XXXXXXXX or 0XXXXXXXX
function isValidArmenianPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+374|0)(10|11|12|33|41|43|44|46|47|49|55|77|91|93|94|95|96|97|98|99)\d{6}$/.test(cleaned);
}

// Password toggle
function setupPasswordToggle(toggleBtnId, inputId) {
  const btn = document.getElementById(toggleBtnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
}

setupPasswordToggle('toggle-login-password', 'login-password');
setupPasswordToggle('toggle-register-password', 'register-password');

// Real-time validation on blur
function setupBlurValidation() {
  const loginEmail = document.getElementById('login-email');
  const loginEmailError = document.getElementById('login-email-error');
  const loginPassword = document.getElementById('login-password');
  const loginPasswordError = document.getElementById('login-password-error');

  loginEmail.addEventListener('blur', () => {
    const val = loginEmail.value.trim();
    if (!val) showFieldError(loginEmail, loginEmailError, 'Email is required');
    else if (!isValidEmail(val)) showFieldError(loginEmail, loginEmailError, 'Please enter a valid email');
    else showFieldSuccess(loginEmail, loginEmailError);
  });

  loginEmail.addEventListener('input', () => clearField(loginEmail, loginEmailError));

  loginPassword.addEventListener('blur', () => {
    const val = loginPassword.value;
    if (!val) showFieldError(loginPassword, loginPasswordError, 'Password is required');
    else if (val.length < 6) showFieldError(loginPassword, loginPasswordError, 'Password must be at least 6 characters');
    else showFieldSuccess(loginPassword, loginPasswordError);
  });

  loginPassword.addEventListener('input', () => clearField(loginPassword, loginPasswordError));
}

setupBlurValidation();

// Login form submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const emailError = document.getElementById('login-email-error');
  const passwordError = document.getElementById('login-password-error');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  let valid = true;

  if (!email) {
    showFieldError(emailInput, emailError, 'Email is required');
    valid = false;
  } else if (!isValidEmail(email)) {
    showFieldError(emailInput, emailError, 'Please enter a valid email');
    valid = false;
  }

  if (!password) {
    showFieldError(passwordInput, passwordError, 'Password is required');
    valid = false;
  } else if (password.length < 6) {
    showFieldError(passwordInput, passwordError, 'Password must be at least 6 characters');
    valid = false;
  }

  if (!valid) return;

  loginBtnText.textContent = 'Signing In...';

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      showMessage("Login successful!", "success");
      if (data.role === 'admin') {
        window.location.replace("/admin");
      } else if (data.role === 'trainer') {
        window.location.replace("/admin");
      } else if (data.role === 'student') {
        window.location.replace("/profile");
      } else {
        window.location.replace("/profile");
      }
    } else {
      showMessage(data.message || "Invalid credentials", "error");
    }
  } catch (error) {
    console.error(error);
    showMessage("Something went wrong, try again.", "error");
  }

  loginBtnText.textContent = 'Log In';
});

// Register form submit
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('register-name');
  const email = document.getElementById('register-email');
  const phone = document.getElementById('register-phone');
  const password = document.getElementById('register-password');
  const confirmPassword = document.getElementById('register-confirm-password');
  const nameError = document.getElementById('register-name-error');
  const emailError = document.getElementById('register-email-error');
  const phoneError = document.getElementById('register-phone-error');
  const passwordError = document.getElementById('register-password-error');
  const confirmError = document.getElementById('register-confirm-error');
  const roleError = document.getElementById('register-role-error');

  const selectedRole = document.querySelector('input[name="register-role"]:checked');

  let valid = true;

  if (!selectedRole) {
    roleError.textContent = 'Please select a role';
    roleError.classList.remove('hidden');
    valid = false;
  } else {
    roleError.classList.add('hidden');
  }

  if (!name.value.trim()) {
    showFieldError(name, nameError, 'Full name is required');
    valid = false;
  }

  if (!email.value.trim()) {
    showFieldError(email, emailError, 'Email is required');
    valid = false;
  } else if (!isValidEmail(email.value.trim())) {
    showFieldError(email, emailError, 'Please enter a valid email');
    valid = false;
  }

  if (!phone.value.trim()) {
    showFieldError(phone, phoneError, 'Phone number is required');
    valid = false;
  } else if (!isValidArmenianPhone(phone.value.trim())) {
    showFieldError(phone, phoneError, 'Enter a valid Armenian number (+374XXXXXXXX or 0XXXXXXXX)');
    valid = false;
  }

  if (!password.value) {
    showFieldError(password, passwordError, 'Password is required');
    valid = false;
  } else if (password.value.length < 6) {
    showFieldError(password, passwordError, 'Password must be at least 6 characters');
    valid = false;
  }

  if (!confirmPassword.value) {
    showFieldError(confirmPassword, confirmError, 'Please confirm your password');
    valid = false;
  } else if (password.value !== confirmPassword.value) {
    showFieldError(confirmPassword, confirmError, 'Passwords do not match');
    valid = false;
  }

  if (!valid) return;

  registerBtnText.textContent = 'Creating Account...';

  try {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        password: password.value,
        role: selectedRole.value,
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      showMessage('Registration successful! Please log in.', 'success');
      showForm(loginForm);
      setActiveTab(loginTab);
      registerForm.reset();
    } else {
      showMessage(data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Something went wrong, try again.', 'error');
  }

  registerBtnText.textContent = 'Create Account';
});

// Initialize with the login form visible
document.addEventListener('DOMContentLoaded', () => {
  showForm(loginForm);
  setActiveTab(loginTab);
});
