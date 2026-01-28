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

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  loginBtnText.textContent = 'Signing In...';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (email && password) {
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: email,   // ✅ match backend DTO
          password
        })
      });


      if (res.ok) {
        showMessage("Login successful ✅");
        // save token if backend sends it
        if(email.includes('@admin')){
          window.location.href = "/admin";
        }

        if(!email.includes('@admin')){
          window.location.href = "/profile?email=" + email;
        }


      } else {
        showMessage(data.message || "Invalid credentials ❌");
      }
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong, try again.");
    }
  } else {
    showMessage("Please fill the inputs ❌");
  }

  loginBtnText.textContent = 'Log In';
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  registerBtnText.textContent = 'Creating Account...';
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (password !== confirmPassword) {
    showMessage('Passwords do not match!', 'error');
    registerBtnText.textContent = 'Create Account';
    return;
  }

  setTimeout(() => {
    showMessage('Registration successful! Please log in.', 'success');
    showForm(loginForm);
    setActiveTab(loginTab);
    registerForm.reset();
    registerBtnText.textContent = 'Create Account';
  }, 1500);
});

// Initialize with the login form visible
document.addEventListener('DOMContentLoaded', () => {
  showForm(loginForm);
  setActiveTab(loginTab);
});