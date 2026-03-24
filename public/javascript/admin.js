// Logout handler
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/auth/logout', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          window.location.href = '/login';
        }
      } catch (err) {
        window.location.href = '/login';
      }
    });
  }
});


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
  seo: document.getElementById('seo-content'),
  faq: document.getElementById('faq-content'),
  pages: document.getElementById('pages-content'),
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

// --- Helper: escape HTML to prevent XSS ---
function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Table column configs for each model ---
const TABLE_CONFIGS = {
  users: {
    tableId: 'users-table',
    endpoint: '/users',
    type: 'users',
    columns: [
      { key: 'fullName' },
      { key: 'email' },
      { key: 'phone' },
      { key: 'password' },
      { key: 'role' },
      { key: 'work_type' },
    ],
  },
  students: {
    tableId: 'students-table',
    endpoint: '/students',
    type: 'students',
    columns: [
      { key: 'image', render: (v) => `<img src="${escapeHtml(v)}" alt="Student" class="rounded-full w-16 h-16 object-cover">` },
      { key: 'fullName' },
      { key: 'email' },
      { key: 'age' },
      { key: 'groupName' },
      { key: 'phones' },
      { key: 'schedules', render: (v) => escapeHtml((v || []).map(s => s.title).join(', ')) },
    ],
  },
  candidates: {
    tableId: 'candidates-table',
    endpoint: '/candidates',
    type: 'candidates',
    columns: [
      { key: 'fullName' },
      { key: 'age' },
      { key: 'gender' },
      { key: 'phones' },
    ],
  },
  courses: {
    tableId: 'courses-table',
    endpoint: '/courses',
    type: 'courses',
    columns: [
      { key: 'image', render: (v, row) => `<img src="${escapeHtml(v)}" alt="${escapeHtml(row.title)}" class="h-12 w-12 rounded-lg object-cover">` },
      { key: 'title', className: 'font-semibold' },
      { key: 'duration' },
      { key: 'price' },
    ],
  },
  trainers: {
    tableId: 'trainers-table',
    endpoint: '/trainers',
    type: 'trainers',
    columns: [
      { key: 'image', render: (v, row) => `<img src="${escapeHtml(v)}" alt="${escapeHtml(row.fullName)}" class="h-12 w-12 rounded-lg object-cover">` },
      { key: 'fullName', className: 'font-semibold' },
      { key: 'role' },
      { key: 'phone' },
      { key: 'description', className: 'truncate max-w-xs' },
      { key: 'schedules', render: (v) => escapeHtml((v || []).map(s => s.title).join(', ')) },
    ],
  },
  blogs: {
    tableId: 'blogs-table',
    endpoint: '/blogs',
    type: 'blogs',
    columns: [
      { key: 'image', render: (v, row) => `<img src="${escapeHtml(v)}" alt="${escapeHtml(row.title)}" class="h-12 w-20 object-cover rounded-lg">` },
      { key: 'title', className: 'font-semibold' },
      { key: 'description', className: 'truncate max-w-sm' },
      { key: 'category' },
    ],
  },
  schedules: {
    tableId: 'schedules-table',
    endpoint: '/schedules',
    type: 'schedules',
    columns: [
      {
        key: 'students',
        className: 'align-top',
        render: (v) => {
          if (!v || !v.length) return '';
          return `<ul class="space-y-2 max-h-32 overflow-y-auto pr-1">${v.map(s =>
            `<li class="flex items-center space-x-2">
              <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.fullName)}" class="h-8 w-8 rounded-full object-cover border">
              <span class="text-sm font-medium text-gray-800">${escapeHtml(s.fullName)}</span>
            </li>`
          ).join('')}</ul>`;
        },
      },
      {
        key: 'trainers',
        className: 'align-top',
        render: (v) => {
          if (!v || !v.length) return '';
          return `<ul class="space-y-2 max-h-32 overflow-y-auto pr-1">${v.map(t =>
            `<li class="flex items-center space-x-2">
              <img src="${escapeHtml(t.image)}" alt="${escapeHtml(t.fullName)}" class="h-8 w-8 rounded-full object-cover border">
              <span class="text-sm font-medium text-gray-800">${escapeHtml(t.fullName)}</span>
              <span class="text-xs text-gray-500">(${escapeHtml(t.role)})</span>
            </li>`
          ).join('')}</ul>`;
        },
      },
      { key: 'title', className: 'font-semibold' },
      {
        key: 'startDate',
        className: 'text-sm whitespace-nowrap',
        render: (v, row) => {
          const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          return `${escapeHtml(fmt(v))} &rarr; ${escapeHtml(fmt(row.endDate))}`;
        },
      },
      {
        key: 'color',
        render: (v) => `<span class="px-3 py-1 rounded-lg text-white text-xs font-semibold shadow-sm" style="background-color: ${escapeHtml(v)};">${escapeHtml(v)}</span>`,
      },
    ],
  },
  seo: {
    tableId: 'seo-table',
    endpoint: '/seo',
    type: 'seo',
    columns: [
      { key: 'pageName', className: 'font-semibold' },
      { key: 'metaTitle' },
      { key: 'metaDescription', className: 'truncate max-w-xs' },
      { key: 'metaKeywords', className: 'truncate max-w-xs' },
      { key: 'canonicalUrl', className: 'truncate max-w-xs' },
    ],
  },
  faq: {
    tableId: 'faq-table',
    endpoint: '/faq',
    type: 'faq',
    columns: [
      { key: 'question', className: 'font-semibold max-w-xs truncate' },
      { key: 'answer', className: 'truncate max-w-sm' },
      { key: 'category' },
      { key: 'sortOrder' },
    ],
  },
  pages: {
    tableId: 'pages-table',
    endpoint: '/pages',
    type: 'pages',
    columns: [
      { key: 'title', className: 'font-semibold' },
      { key: 'slug' },
      { key: 'content', className: 'truncate max-w-sm' },
      {
        key: 'status',
        render: (v) => {
          const cls = v === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
          return `<span class="px-2 py-1 text-xs font-semibold rounded-full ${cls}">${escapeHtml(v)}</span>`;
        },
      },
    ],
  },
};

// --- URL Params Helper ---
let activeSection = 'dashboard';

function updateUrlParams() {
  const params = new URLSearchParams();
  params.set('page', activeSection);

  const tm = tableManagers[activeSection];
  if (tm && tm.table) {
    if (tm.searchTerm) params.set('search', tm.searchTerm);
    // Collect all active filters
    Object.entries(tm.filters).forEach(([key, value]) => {
      if (value) params.set('filter_' + key, value);
    });
    if (tm.currentPage > 1) params.set('p', tm.currentPage.toString());
    if (tm.pageSize !== 10) params.set('limit', tm.pageSize.toString());
  }

  const newUrl = `${window.location.pathname}?${params}`;
  history.replaceState(null, '', newUrl);
}

function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

// --- Server-side Table Manager ---
const tableManagers = {};

class TableManager {
  constructor(config) {
    this.config = config;
    this.table = document.getElementById(config.tableId);
    if (!this.table) return;

    this.tbody = this.table.querySelector('tbody');
    this.currentPage = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.filters = {};
    this.filtersPopulated = false;

    this.searchInput = document.querySelector(`.table-search[data-table="${config.tableId}"]`);
    this.filterSelects = document.querySelectorAll(`.table-filter[data-table="${config.tableId}"]`);
    this.pageSizeSelect = document.querySelector(`.table-page-size[data-table="${config.tableId}"]`);
    this.paginationContainer = document.querySelector(`.table-pagination[data-table="${config.tableId}"]`);

    this.bindEvents();
  }

  // Restore state from URL params
  restoreFromUrl(urlParams) {
    const p = parseInt(urlParams.get('p'));
    const limit = parseInt(urlParams.get('limit'));
    const search = urlParams.get('search');

    if (p > 0) this.currentPage = p;
    if (limit > 0) {
      this.pageSize = limit;
      if (this.pageSizeSelect) this.pageSizeSelect.value = limit.toString();
    }
    if (search) {
      this.searchTerm = search;
      if (this.searchInput) this.searchInput.value = search;
    }

    // Restore filter values (stored as filter_fieldName in URL)
    this.filterSelects.forEach(select => {
      const key = select.dataset.filterKey;
      const val = urlParams.get('filter_' + key);
      if (key && val) {
        // Add option temporarily if not yet populated
        if (!select.querySelector(`option[value="${val}"]`)) {
          const opt = document.createElement('option');
          opt.value = val;
          opt.textContent = val;
          select.appendChild(opt);
        }
        select.value = val;
        this.filters[key] = val;
      }
    });
  }

  bindEvents() {
    if (this.searchInput) {
      let timeout;
      this.searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.searchTerm = this.searchInput.value.trim();
          this.currentPage = 1;
          this.fetchData();
        }, 300);
      });
    }

    this.filterSelects.forEach(select => {
      select.addEventListener('change', () => {
        this.collectFilters();
        this.currentPage = 1;
        this.fetchData();
      });
    });

    if (this.pageSizeSelect) {
      this.pageSizeSelect.addEventListener('change', () => {
        this.pageSize = parseInt(this.pageSizeSelect.value);
        this.currentPage = 1;
        this.fetchData();
      });
    }

    if (this.paginationContainer) {
      this.paginationContainer.querySelector('.pagination-prev').addEventListener('click', () => {
        if (this.currentPage > 1) { this.currentPage--; this.fetchData(); }
      });
      this.paginationContainer.querySelector('.pagination-next').addEventListener('click', () => {
        this.currentPage++;
        this.fetchData();
      });
    }
  }

  collectFilters() {
    this.filters = {};
    this.filterSelects.forEach(s => {
      const key = s.dataset.filterKey;
      if (key && s.value) this.filters[key] = s.value;
    });
  }

  async fetchData() {
    const params = new URLSearchParams({
      page: this.currentPage.toString(),
      limit: this.pageSize.toString(),
    });
    if (this.searchTerm) params.set('search', this.searchTerm);
    Object.entries(this.filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    try {
      const res = await fetch(`${this.config.endpoint}?${params}`);
      const result = await res.json();
      this.renderRows(result.data);
      this.renderPagination(result);
      if (!this.filtersPopulated && result.filterOptions) {
        this.populateFilters(result.filterOptions);
        this.filtersPopulated = true;
      }
      updateUrlParams();
    } catch (err) {
      console.error(`Failed to fetch ${this.config.type}:`, err);
    }
  }

  renderRows(data) {
    this.tbody.innerHTML = '';
    if (!data || data.length === 0) {
      const colCount = this.config.columns.length + (window.__isAdmin ? 1 : 0);
      this.tbody.innerHTML = `<tr><td colspan="${colCount}" class="px-4 py-8 text-center text-gray-500">No data found</td></tr>`;
      return;
    }

    data.forEach(row => {
      const tr = document.createElement('tr');
      this.config.columns.forEach(col => {
        const td = document.createElement('td');
        td.className = `px-4 py-2 ${col.className || ''}`;
        if (col.render) {
          td.innerHTML = col.render(row[col.key], row);
        } else {
          td.textContent = row[col.key] != null ? String(row[col.key]) : '';
        }
        tr.appendChild(td);
      });

      if (window.__isAdmin) {
        const actionTd = document.createElement('td');
        actionTd.className = 'px-4 py-2';
        actionTd.innerHTML = `
          <button data-id="${escapeHtml(row.id)}" data-type="${this.config.type}"
                  class="edit-btn px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><i class="fas fa-edit"></i></button>
          <button data-id="${escapeHtml(row.id)}" data-type="${this.config.type}"
                  class="delete-btn px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"><i class="fas fa-trash"></i></button>
        `;
        tr.appendChild(actionTd);
      }

      this.tbody.appendChild(tr);
    });
  }

  renderPagination(result) {
    if (!this.paginationContainer) return;
    const { total, page, totalPages } = result;
    const start = total === 0 ? 0 : (page - 1) * this.pageSize + 1;
    const end = Math.min(page * this.pageSize, total);

    this.paginationContainer.querySelector('.pagination-info').textContent =
      total === 0 ? 'No entries found' : `Showing ${start}-${end} of ${total}`;

    const prevBtn = this.paginationContainer.querySelector('.pagination-prev');
    const nextBtn = this.paginationContainer.querySelector('.pagination-next');
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;

    const pagesContainer = this.paginationContainer.querySelector('.pagination-pages');
    pagesContainer.innerHTML = '';

    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === page
        ? 'px-3 py-1 border border-indigo-500 bg-indigo-600 text-white rounded-lg text-sm'
        : 'px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm';
      btn.addEventListener('click', () => {
        this.currentPage = i;
        this.fetchData();
      });
      pagesContainer.appendChild(btn);
    }
  }

  populateFilters(filterOptions) {
    this.filterSelects.forEach(select => {
      const filterKey = select.dataset.filterKey;
      if (filterKey && filterOptions[filterKey]) {
        // Keep only the default "All" option
        const defaultOpt = select.querySelector('option');
        select.innerHTML = '';
        select.appendChild(defaultOpt);
        filterOptions[filterKey].forEach(val => {
          const opt = document.createElement('option');
          opt.value = val;
          opt.textContent = val;
          select.appendChild(opt);
        });
      }
    });
  }
}

// --- Single Page Application (SPA) Navigation Logic ---
function showContent(page, skipUrlUpdate) {
  activeSection = page;

  // Hide all content sections
  Object.values(contentSections).forEach(section => { if (section) section.classList.add('hidden'); });

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

  // Fetch table data when navigating to a table section
  if (tableManagers[page]) {
    tableManagers[page].fetchData();
  } else if (!skipUrlUpdate) {
    updateUrlParams();
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

  // Initialize table managers for all model tables
  Object.entries(TABLE_CONFIGS).forEach(([key, config]) => {
    const table = document.getElementById(config.tableId);
    if (table) {
      tableManagers[key] = new TableManager(config);
    }
  });

  // Restore state from URL params
  const urlParams = getUrlParams();
  const section = urlParams.get('page') || 'dashboard';

  // Restore table state if navigating to a table section
  if (tableManagers[section]) {
    tableManagers[section].restoreFromUrl(urlParams);
  }

  showContent(section, true);

  // Trigger fetch with restored params (showContent already calls fetchData for table sections)
};

document.addEventListener('DOMContentLoaded', () => {

  // Universal function to submit form
  const handleFormSubmit = async (form) => {

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const type = form.dataset.type; // users, students, courses, etc.
      const id = form.dataset.id || null; // for PUT
      const url = id ? `/${type}/${id}` : `/${type}`;
      const method = id ? 'PATCH' : 'POST';

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

        // Re-fetch current table data instead of reloading
        if (tableManagers[type]) {
          tableManagers[type].fetchData();
        }
        modal.classList.add('hidden');

      } catch (err) {
        console.error(err);
        alert('Something went wrong!');
      }
    });
  };

  // Initialize all forms except transaction-form (it has its own localStorage handler)
  document.querySelectorAll('form[data-type]').forEach(form => {
    if (form.id !== 'transaction-form') handleFormSubmit(form);
  });

  // Mappings for non-standard plural endpoints
  const formIdOverrides = { seo: 'seo-form', faq: 'faq-form' };
  const entityNameOverrides = { seo: 'SEO', faq: 'FAQ' };
  function getFormId(type) {
    return formIdOverrides[type] || (type.slice(0, -1) + '-form');
  }
  function getEntityName(type) {
    return entityNameOverrides[type] || (type.charAt(0).toUpperCase() + type.slice(1, -1));
  }

  // Add button functionality - opens modal with empty form for creating
  document.querySelectorAll('.add-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type; // e.g. "users", "students"
      const formId = getFormId(type);

      // Hide all forms in modal
      document.querySelectorAll('#transaction-modal form').forEach(f => f.classList.add('hidden'));

      // Show the correct form
      const form = document.getElementById(formId);
      if (form) {
        form.reset();
        delete form.dataset.id; // no id = POST (create)
        form.classList.remove('hidden');
      }

      // Set modal title and show
      const entityName = getEntityName(type);
      modalTitle.textContent = `Add New ${entityName}`;
      modal.classList.remove('hidden');
    });
  });

  // Edit and Delete buttons - use event delegation for dynamically rendered buttons
  document.addEventListener('click', async (e) => {
    // --- Edit button ---
    const editBtn = e.target.closest('.edit-btn[data-type]');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const type = editBtn.dataset.type;

      // hide all forms
      document.querySelectorAll('#transaction-modal form').forEach(f => f.classList.add('hidden'));

      // show the correct form
      const formId = getFormId(type);
      const form = document.getElementById(formId);
      if (form) {
        form.reset();
        form.dataset.id = id; // set id for PATCH

        // Fetch existing data and populate form
        try {
          const res = await fetch(`/${type}/${id}`);
          if (res.ok) {
            const data = await res.json();
            // Populate form fields with existing data
            Object.keys(data).forEach(key => {
              const input = form.querySelector(`[name="${key}"]`);
              if (input) {
                if (input.type === 'date' && data[key]) {
                  input.value = data[key].split('T')[0];
                } else {
                  input.value = data[key] || '';
                }
              }
            });
          }
        } catch (err) {
          console.error('Failed to fetch entity data:', err);
        }

        form.classList.remove('hidden');
      }

      const entityName = getEntityName(type);
      modalTitle.textContent = `Edit ${entityName}`;
      modal.classList.remove('hidden');
      return;
    }

    // --- Delete button ---
    const deleteBtn = e.target.closest('.delete-btn[data-type]');
    if (deleteBtn) {
      const confirmed = await window.confirm('Are you sure you want to delete?');
      if (!confirmed) return;

      const id = deleteBtn.dataset.id;
      const type = deleteBtn.dataset.type;

      try {
        const res = await fetch(`/${type}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed!');
        alert('Deleted successfully!');

        // Re-fetch current table data instead of reloading
        if (tableManagers[type]) {
          tableManagers[type].fetchData();
        }
      } catch (err) {
        console.error(err);
        alert('Could not delete item.');
      }
      return;
    }
  });

});
