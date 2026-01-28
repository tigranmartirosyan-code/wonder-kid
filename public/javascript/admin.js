function attachUpdateHandler(formId, endpoint) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    const id = form.dataset.id; // set when modal opens
    if (!id) {
      console.error(`❌ No ID found for form ${formId}`);
      return;
    }

    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());



    try {
      const res = await fetch(`/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      window.location.reload(); // refresh page after update
    } catch (err) {
      console.error(`❌ Failed to update ${endpoint}:`, err);
    }
  });
}

attachUpdateHandler("blog-form", "blogs");
attachUpdateHandler("candidate-form", "candidates");
attachUpdateHandler("course-form", "courses");
attachUpdateHandler("student-form", "students");
attachUpdateHandler("trainer-form", "trainers");
attachUpdateHandler("user-form", "users");
attachUpdateHandler("transaction-form", "transactions");

// Mock data to start with
const mockData = [
  { id: 'txn_101', transactionId: 'TXN-101', user: 'Alice', amount: 120.50, status: 'Completed', date: '2025-09-08' },
  { id: 'txn_102', transactionId: 'TXN-102', user: 'Bob', amount: 75.00, status: 'Pending', date: '2025-09-09' },
  {
    id: 'txn_103',
    transactionId: 'TXN-103',
    user: 'Charlie',
    amount: 200.00,
    status: 'Completed',
    date: '2025-09-09',
  },
  { id: 'txn_104', transactionId: 'TXN-104', user: 'Diana', amount: 45.99, status: 'Failed', date: '2025-09-10' },
  { id: 'txn_105', transactionId: 'TXN-105', user: 'Eve', amount: 350.75, status: 'Completed', date: '2025-09-10' },
];

let transactions = [];
let currentEditingId = null;

// Get references to DOM elements
const transactionTableBody = document.getElementById('transactionTableBody');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const generateReportBtn = document.getElementById('generate-report-btn');
const reportContent = document.getElementById('report-content');
const modal = document.getElementById('transaction-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const transactionForm = document.getElementById('transaction-form');
const modalTitle = document.getElementById('modal-title');
const revenueAmount = document.getElementById('revenue-amount');
const ticketCount = document.getElementById('ticket-count');
const loadingReportOverlay = document.getElementById('loading-report-overlay');

// Navigation and content elements
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = {
  dashboard: document.getElementById('dashboard-content'),
  users: document.getElementById('users-content'),
  students: document.getElementById('students-content'),
  candidates: document.getElementById('candidates-content'),
  courses: document.getElementById('courses-content'),
  blogs: document.getElementById('blogs-content'),
  trainers: document.getElementById('trainers-content'),
  schedules: document.getElementById('schedules-content'),
  analytics: document.getElementById('analytics-content'),
  settings: document.getElementById('settings-content'),
};

// --- Data Management and Rendering ---
function loadDataFromLocalStorage() {
  const storedData = localStorage.getItem('transactions');
  if (storedData) {
    try {
      transactions = JSON.parse(storedData);
    } catch (e) {
      console.error('Failed to parse transactions from localStorage, using mock data.');
      transactions = [...mockData];
    }
  } else {
    transactions = [...mockData];
  }
  updateUI();
}

function saveDataToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateUI() {
  renderTransactions();
  updateMetrics();
  drawLineChart();
}

function renderTransactions() {
  transactionTableBody.innerHTML = ''; // Clear existing table rows
  transactions.forEach(txn => {
    const row = document.createElement('tr');
    const statusColor = txn.status === 'Completed' ? 'bg-green-100 text-green-800' :
      txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800';

    row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${txn.transactionId || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${txn.user || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${(parseFloat(txn.amount) || 0).toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}">
                            ${txn.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="edit-btn text-blue-600 hover:text-blue-900 transition-colors duration-200" data-doc-id="${txn.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn text-red-600 hover:text-red-900 transition-colors duration-200 ml-4" data-doc-id="${txn.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
    transactionTableBody.appendChild(row);
  });
}

function updateMetrics() {
  const totalRevenue = transactions.reduce((sum, txn) => sum + (parseFloat(txn.amount) || 0), 0);
  const completedTickets = transactions.filter(txn => txn.status === 'Completed').length;
  revenueAmount.textContent = `$${totalRevenue.toFixed(2)}`;
  ticketCount.textContent = completedTickets;
}

// --- Modal and Form Logic ---
addTransactionBtn.addEventListener('click', () => {
  modalTitle.textContent = 'Add New Transaction';
  transactionForm.reset();
  currentEditingId = null;
  modal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// Handle form submission for add/edit
transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(transactionForm);
  const transactionData = {
    transactionId: formData.get('transactionId'),
    user: formData.get('user'),
    amount: parseFloat(formData.get('amount')),
    status: formData.get('status'),
    date: formData.get('date'),
  };

  if (currentEditingId) {
    // Edit existing transaction
    const index = transactions.findIndex(txn => txn.id === currentEditingId);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...transactionData };
    }
  } else {
    // Add new transaction
    transactionData.id = `txn_${Date.now()}`;
    transactions.push(transactionData);
  }

  saveDataToLocalStorage();
  updateUI();
  modal.classList.add('hidden');
  transactionForm.reset();
});

// --- Gemini API Integration for Report Generation ---
generateReportBtn.addEventListener('click', async () => {
  loadingReportOverlay.classList.remove('hidden');
  reportContent.textContent = ''; // Clear previous report

  const payload = {
    contents: [{
      parts: [{
        text: `Act as a world-class financial analyst. Provide a concise, single-paragraph summary of the key findings from the provided data. Highlight total revenue, new users, and completed tickets.
                        Raw transaction data: ${JSON.stringify(transactions)}.
                        Summary Metrics: Total Revenue: ${revenueAmount.textContent}, New Signups: ${document.getElementById('signups-count').textContent}, Completed Tickets: ${ticketCount.textContent}.
                        Please write a professional, high-level summary.`,
      }],
    }],
    tools: [{ 'google_search': {} }],
    systemInstruction: {
      parts: [{ text: 'You are a helpful assistant that generates professional financial reports.' }],
    },
  };

  const apiKey = '';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate report.';
    reportContent.innerHTML = text.replace(/\n/g, '<br>');
  } catch (error) {
    console.error('Error generating report:', error);
    reportContent.textContent = 'An error occurred while generating the report. Please try again.';
  } finally {
    loadingReportOverlay.classList.add('hidden');
  }
});

// --- Chart Logic ---
function drawLineChart() {
  const canvas = document.getElementById('salesChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // Aggregate data by date
  const salesData = transactions.reduce((acc, txn) => {
    const date = txn.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += parseFloat(txn.amount) || 0;
    return acc;
  }, {});

  const dates = Object.keys(salesData).sort();
  const dataValues = dates.map(date => salesData[date]);

  if (dataValues.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
    return;
  }

  const maxData = Math.max(...dataValues) * 1.2;

  const padding = 40;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const y = padding + (chartHeight / numGridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  dataValues.forEach((value, index) => {
    const x = padding + (chartWidth / (dataValues.length - 1)) * index;
    const y = canvas.height - padding - (value / maxData) * chartHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw data points
  ctx.fillStyle = '#2563eb';
  dataValues.forEach((value, index) => {
    const x = padding + (chartWidth / (dataValues.length - 1)) * index;
    const y = canvas.height - padding - (value / maxData) * chartHeight;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw labels and axes
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px Roboto, sans-serif';
  ctx.textAlign = 'center';
  dates.forEach((label, index) => {
    const x = padding + (chartWidth / (dates.length - 1)) * index;
    const y = canvas.height - padding + 15;
    ctx.fillText(label, x, y);
  });

  ctx.textAlign = 'right';
  for (let i = 0; i <= numGridLines; i++) {
    const y = padding + (chartHeight / numGridLines) * i;
    const value = (maxData / numGridLines) * (numGridLines - i);
    ctx.fillText(Math.round(value), padding - 10, y + 4);
  }
}

// --- Single Page Application (SPA) Navigation Logic ---
function showContent(page) {
  // Hide all content sections
  Object.values(contentSections).forEach(section => section.classList.add('hidden'));

  // Show the selected content section
  const targetSection = contentSections[page];
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  // Update active state in sidebar
  navLinks.forEach(link => {
    link.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
    link.classList.add('text-gray-600', 'hover:bg-gray-100');
  });
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (activeLink) {
    activeLink.classList.add('bg-blue-600', 'text-white', 'shadow-md');
    activeLink.classList.remove('text-gray-600', 'hover:bg-gray-100');
  }

  // Close the sidebar on mobile
  if (window.innerWidth < 768) {
    sidebar.classList.remove('active');
  }
}

// Add event listeners to navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    showContent(page);
  });
});

// Mobile sidebar toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.add('active');
});

sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('active');
});

window.addEventListener('resize', () => {
  // Redraw the chart on resize
  drawLineChart();
});

// Custom confirm function to replace built-in window.confirm
window.confirm = (message) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50';
  modal.innerHTML = `
                <div class="relative p-8 bg-white rounded-lg shadow-xl max-w-sm mx-auto">
                    <h3 class="text-xl font-bold mb-4">Confirm Action</h3>
                    <p class="mb-6">${message}</p>
                    <div class="flex justify-end space-x-4">
                        <button id="cancel-btn" class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">Cancel</button>
                        <button id="ok-btn" class="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">OK</button>
                    </div>
                </div>
            `;
  document.body.appendChild(modal);
  return new Promise((resolve) => {
    document.getElementById('cancel-btn').addEventListener('click', () => {
      modal.remove();
      resolve(false);
    });
    document.getElementById('ok-btn').addEventListener('click', () => {
      modal.remove();
      resolve(true);
    });
  });
};

// Initialize the app
window.onload = function() {
  loadDataFromLocalStorage();
  showContent('dashboard'); // Default to the dashboard on load
};

document.addEventListener('DOMContentLoaded', () => {

  // Universal function to submit form
  const handleFormSubmit = async (form) => {

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const type = form.dataset.type; // users, students, courses, etc.
      const id = form.dataset.id || null; // for PUT
      const url = id ? `/${type}/${id}` : `/${type}`;
      const method = id ? 'PUT' : 'POST';

      // Collect form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => data[key] = value);

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Request failed!');

        const result = await res.json();
        alert(`${id ? 'Updated' : 'Created'} successfully!`);

        // Optional: refresh table row or table
        window.location.reload();

      } catch (err) {
        console.error(err);
        alert('Something went wrong!');
      }
    });
  };

  // Initialize all forms
  document.querySelectorAll('form[data-type]').forEach(form => handleFormSubmit(form));

  // Edit button functionality
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {

      const id = btn.dataset.id;
      const type = btn.dataset.type; // e.g. blogs, candidates

      // hide all forms
      document.querySelectorAll("#transaction-modal form").forEach(f => f.classList.add("hidden"));

      // show the correct form
      const form = document.getElementById(`${type.slice(0, -1)}-form`);
      if (form) {
        form.dataset.id = id; // set id for PATCH
        form.classList.remove("hidden");
      }

      modalTitle.textContent = `${id}`;
      modal.classList.remove("hidden");
    });
  });

  // Delete button functionality
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete?')) return;

      const id = btn.dataset.id;
      const type = btn.dataset.type;

      try {
        const res = await fetch(`/${type}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed!');
        alert('Deleted successfully!');
        location.reload();
      } catch (err) {
        console.error(err);
        alert('Could not delete item.');
      }
    });
  });

});