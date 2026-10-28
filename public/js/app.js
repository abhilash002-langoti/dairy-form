// ============================================================================
// AMRIT DAIRY FARM ERP - COMPLETE CLIENT-SIDE LOGIC & STATE ENGINE
// 8 Modules: Dashboard, Cows, Milk, Medicine, Feed, Expenses, Reports, Settings
// Full Role-Based Access: Admin (Full) vs Staff (Data Entry, No Delete/Reports)
// ============================================================================

const erpState = {
  currentUser: {
    username: 'admin',
    name: 'Sardar Gurmeet Singh',
    role: 'admin', // 'admin' or 'staff'
    title: 'Farm Owner & Executive Director'
  },
  activeSection: 'dashboard',
  searchQueries: {},
  statusFilters: {},
  sessionTimerSeconds: 1800, // 30 minutes session timeout
  kpis: {},
  cows: [],
  milkRecords: [],
  milkSummary: {},
  medicines: [],
  treatments: [],
  vaccinations: [],
  feedInventory: [],
  feedingLogs: [],
  expenses: [],
  pnlReport: {},
  masterSettings: {}
};

// ----------------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved language
  const savedLang = localStorage.getItem('amrit_lang') || 'en';
  if (typeof setLanguage === 'function') setLanguage(savedLang);

  // Restore session if available
  const savedUser = sessionStorage.getItem('amrit_user');
  if (savedUser) {
    try {
      erpState.currentUser = JSON.parse(savedUser);
    } catch (e) {}
  }
  updateUserUI();

  // Route from hash or default to dashboard
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  switchErpSection(hash);

  // Start Session Timeout Countdown
  startSessionTimeoutWatcher();

  // Load initial farm data
  await loadAllErpData();
});

// ----------------------------------------------------------------------------
// SESSION TIMEOUT & ROLE MANAGEMENT
// ----------------------------------------------------------------------------
function startSessionTimeoutWatcher() {
  setInterval(() => {
    if (erpState.sessionTimerSeconds > 0) {
      erpState.sessionTimerSeconds--;
      const mins = Math.floor(erpState.sessionTimerSeconds / 60);
      const secs = erpState.sessionTimerSeconds % 60;
      const el = document.getElementById('session-timer-display');
      if (el) el.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    } else {
      alert('⚠️ Session timed out due to inactivity. Please log in again.');
      logoutUser();
    }
  }, 1000);
}

function resetSessionTimer() {
  erpState.sessionTimerSeconds = 1800;
}

// Quick Role Switcher for Pair-Programming and Testing
function quickSwitchRole(role) {
  if (role === 'admin') {
    erpState.currentUser = {
      username: 'admin',
      name: 'Sardar Gurmeet Singh',
      role: 'admin',
      title: 'Farm Owner (Full Admin)'
    };
  } else {
    erpState.currentUser = {
      username: 'staff',
      name: 'Ramesh Kumar',
      role: 'staff',
      title: 'Farm Staff (Data Entry)'
    };
  }
  sessionStorage.setItem('amrit_user', JSON.stringify(erpState.currentUser));
  resetSessionTimer();
  updateUserUI();

  // If staff was on expenses or reports, redirect to dashboard
  if (erpState.currentUser.role === 'staff' && (erpState.activeSection === 'expenses' || erpState.activeSection === 'reports')) {
    switchErpSection('dashboard');
  } else {
    switchErpSection(erpState.activeSection);
  }
}

function updateUserUI() {
  const nameEl = document.getElementById('sidebar-user-name');
  const roleBadge = document.getElementById('sidebar-user-role-badge');
  const avatarEl = document.getElementById('sidebar-user-avatar');

  if (nameEl) nameEl.innerText = erpState.currentUser.name;
  if (avatarEl) avatarEl.innerText = erpState.currentUser.name.charAt(0);
  if (roleBadge) {
    roleBadge.className = `role-badge ${erpState.currentUser.role}`;
    roleBadge.innerText = erpState.currentUser.role.toUpperCase();
  }

  // Update quick toggle pills
  document.querySelectorAll('.role-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === erpState.currentUser.role);
  });

  // Lock or unlock Admin-only sidebar tabs
  const isStaff = erpState.currentUser.role === 'staff';
  const expBtn = document.getElementById('nav-btn-expenses');
  const repBtn = document.getElementById('nav-btn-reports');

  if (expBtn) {
    expBtn.classList.toggle('locked', isStaff);
    expBtn.title = isStaff ? 'Locked for Staff' : 'Expenses';
  }
  if (repBtn) {
    repBtn.classList.toggle('locked', isStaff);
    repBtn.title = isStaff ? 'Locked for Staff' : 'Reports & P&L';
  }
}

function openLoginModal() {
  document.getElementById('login-modal').classList.add('active');
}

function closeLoginModal() {
  document.getElementById('login-modal').classList.remove('active');
}

async function submitLogin(e) {
  if (e) e.preventDefault();
  const identifier = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const otp = document.getElementById('login-otp').value.trim();

  try {
    const res = await fetch('/api/erp/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: identifier, password, otp })
    }).then(r => r.json());

    if (res.success) {
      erpState.currentUser = res.user;
      sessionStorage.setItem('amrit_user', JSON.stringify(res.user));
      resetSessionTimer();
      updateUserUI();
      closeLoginModal();
      alert(`✅ ${res.message}`);
      switchErpSection('dashboard');
    } else {
      alert('Login notice: ' + res.message);
    }
  } catch (err) {
    alert('Connection error: ' + err.message);
  }
}

function logoutUser() {
  sessionStorage.removeItem('amrit_user');
  quickSwitchRole('staff');
  alert('You have been logged out.');
}

function triggerForgotPassword() {
  const phone = prompt('Enter your registered mobile number for OTP reset:', '9876543210');
  if (phone) {
    alert(`Reset OTP sent to ${phone}. For instant demo reset, use code: 1234.`);
  }
}

// ----------------------------------------------------------------------------
// NAVIGATION ROUTER
// ----------------------------------------------------------------------------
function switchErpSection(section) {
  // Guard admin-only sections
  if (erpState.currentUser.role === 'staff' && (section === 'expenses' || section === 'reports')) {
    alert('🔒 Restricted Access: Financial Expenses and Profit & Loss reports are visible to Farm Owner (Admin) only.');
    return;
  }

  erpState.activeSection = section;
  window.location.hash = section;

  // Toggle active class on sidebar buttons
  document.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  // Toggle active class on page-views
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.toggle('active', view.id === `section-${section}`);
  });

  // Update header title
  const titles = {
    dashboard: 'Farm Executive Dashboard',
    cows: 'Cattle Master Registry',
    milk: 'Daily Milk Production & Yields',
    medicine: 'Veterinary Medicines & Treatments',
    feed: 'Cow Feed Inventory & Daily Rations',
    expenses: 'Farm Expenses & Operational Costs',
    reports: 'Financial Profit & Loss Statement',
    settings: 'Farm Settings & Master Lists'
  };
  const titleEl = document.getElementById('page-header-title');
  if (titleEl) titleEl.innerText = titles[section] || 'Farm Management';

  // Render specific section
  if (section === 'dashboard') renderDashboardView();
  if (section === 'cows') renderCowsView();
  if (section === 'milk') renderMilkView();
  if (section === 'medicine') renderMedicineView();
  if (section === 'feed') renderFeedView();
  if (section === 'expenses') renderExpensesView();
  if (section === 'reports') renderReportsView();
  if (section === 'settings') renderSettingsView();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------------
// DATA FETCHING CLIENT
// ----------------------------------------------------------------------------
async function loadAllErpData() {
  try {
    const roleHeader = { 'X-User-Role': erpState.currentUser.role };

    const [dashRes, cowsRes, milkRes, medRes, trtRes, vacRes, feedRes, ratRes, setRes] = await Promise.all([
      fetch('/api/erp/dashboard', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/cows', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/milk', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/medicines', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/treatments', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/vaccinations', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/feed', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/feed/rations', { headers: roleHeader }).then(r => r.json()),
      fetch('/api/erp/settings', { headers: roleHeader }).then(r => r.json())
    ]);

    if (dashRes.success) {
      erpState.kpis = dashRes.kpis;
      erpState.alerts = dashRes.alerts;
    }
    if (cowsRes.cows) erpState.cows = cowsRes.cows;
    if (milkRes.records) {
      erpState.milkRecords = milkRes.records;
      erpState.milkSummary = milkRes.summary;
    }
    if (medRes.medicines) erpState.medicines = medRes.medicines;
    if (trtRes.treatments) erpState.treatments = trtRes.treatments;
    if (vacRes.vaccinations) erpState.vaccinations = vacRes.vaccinations;
    if (feedRes.feedInventory) erpState.feedInventory = feedRes.feedInventory;
    if (ratRes.feedingLogs) erpState.feedingLogs = ratRes.feedingLogs;
    if (setRes.masterSettings) erpState.masterSettings = setRes.masterSettings;

    // Load admin only data if admin
    if (erpState.currentUser.role === 'admin') {
      const [expRes, pnlRes] = await Promise.all([
        fetch('/api/erp/expenses', { headers: roleHeader }).then(r => r.json()),
        fetch('/api/erp/reports/pnl', { headers: roleHeader }).then(r => r.json())
      ]);
      if (expRes.expenses) erpState.expenses = expRes.expenses;
      if (pnlRes.success) erpState.pnlReport = pnlRes;
    }

    // Refresh active section
    switchErpSection(erpState.activeSection);
  } catch (err) {
    console.error('Error fetching farm ERP data:', err);
  }
}

// ----------------------------------------------------------------------------
// 1. DASHBOARD VIEW CONTROLLER
// ----------------------------------------------------------------------------
function renderDashboardView() {
  const k = erpState.kpis;
  if (!k) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setVal('dash-kpi-total-milk', `${k.todayTotalMilkLitres || 74} L`);
  setVal('dash-kpi-morning-evening', `🌅 Morning: ${k.todayMorningLitres || 48}L  |  🌇 Evening: ${k.todayEveningLitres || 26}L`);
  setVal('dash-kpi-total-cows', k.totalCows || erpState.cows.length);
  setVal('dash-kpi-cows-breakdown', `🥛 In Milk: ${k.cowsInMilk || 3} • 🌾 Dry: ${k.dryCows || 1} • 🍼 Pregnant: ${k.pregnantCows || 2} • 🩺 Sick: ${k.sickCows || 1}`);
  setVal('dash-kpi-today-expenses', `₹${(k.todayExpenses || 3097).toLocaleString()}`);

  // Render Alerts Banner Container
  const alertsContainer = document.getElementById('dashboard-alerts-container');
  if (alertsContainer && erpState.alerts) {
    let alertsHtml = '';

    // Antibiotic Withdrawal Alert!
    if (erpState.alerts.activeWithdrawals && erpState.alerts.activeWithdrawals.length > 0) {
      erpState.alerts.activeWithdrawals.forEach(w => {
        alertsHtml += `
          <div class="alert-banner withdrawal">
            <span style="font-size:24px;">🚫</span>
            <div>
              <strong style="font-size:15px;">ANTIBIOTIC WITHDRAWAL ACTIVE — COW ${w.cowTag} (${w.cowName})</strong>
              <p style="font-size:13px; margin-top:2px;">
                Treated with ${w.medicineName} for ${w.illness}. <strong>Milk MUST NOT be sold</strong> until ${w.withdrawalEndDate}.
              </p>
            </div>
          </div>
        `;
      });
    }

    // Low Stock Feeds Alert
    if (erpState.alerts.lowStockFeeds && erpState.alerts.lowStockFeeds.length > 0) {
      alertsHtml += `
        <div class="alert-banner low-stock">
          <span style="font-size:24px;">⚠️</span>
          <div>
            <strong>Low Feed Stock Alert:</strong>
            ${erpState.alerts.lowStockFeeds.map(f => `${f.name} (${f.stockKg} kg left, alert at ${f.alertKg} kg)`).join('; ')}.
          </div>
        </div>
      `;
    }

    // Near Expiry Medicines Alert
    if (erpState.alerts.nearExpiryMedicines && erpState.alerts.nearExpiryMedicines.length > 0) {
      alertsHtml += `
        <div class="alert-banner low-stock">
          <span style="font-size:24px;">💊</span>
          <div>
            <strong>Near Expiry Medicine:</strong>
            ${erpState.alerts.nearExpiryMedicines.map(m => `${m.name} (Expires ${m.expiryDate})`).join(', ')}.
          </div>
        </div>
      `;
    }

    // Upcoming Vaccinations Alert
    if (erpState.alerts.upcomingVaccinations && erpState.alerts.upcomingVaccinations.length > 0) {
      alertsHtml += `
        <div class="alert-banner vaccine">
          <span style="font-size:24px;">💉</span>
          <div>
            <strong>Upcoming Vaccination Due:</strong>
            ${erpState.alerts.upcomingVaccinations.map(v => `${v.cowTag} - ${v.vaccineName} due on ${v.nextDueDate}`).join('; ')}.
          </div>
        </div>
      `;
    }

    alertsContainer.innerHTML = alertsHtml || '<p style="color:#166534; font-weight:700;">✅ All herd health, feed stocks, and vaccinations are up to date.</p>';
  }
}

// ----------------------------------------------------------------------------
// 2. COW LIST & 360° HISTORY CONTROLLER
// ----------------------------------------------------------------------------
function renderCowsView() {
  const container = document.getElementById('cows-table-body');
  if (!container) return;

  const q = (erpState.searchQueries.cows || '').toLowerCase();
  const filter = erpState.statusFilters.cows || 'all';

  let list = erpState.cows;
  if (q) {
    list = list.filter(c =>
      c.tagNumber.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.breed.toLowerCase().includes(q)
    );
  }
  if (filter !== 'all') {
    list = list.filter(c => c.status === filter);
  }

  const isStaff = erpState.currentUser.role === 'staff';

  container.innerHTML = list.map(c => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${c.photoUrl}" style="width:48px; height:48px; object-fit:cover; border-radius:8px; border:1px solid #cbd5e1;" />
          <div>
            <span style="font-weight:900; font-size:15px; color:#0f172a;">${c.tagNumber}</span>
            <p style="font-size:13px; font-weight:700; color:#15803d;">${c.name}</p>
          </div>
        </div>
      </td>
      <td><strong>${c.breed}</strong><br><span style="font-size:12px; color:#64748b;">${c.type}</span></td>
      <td>
        <span class="status-pill ${c.status}">
          ${c.status.toUpperCase()}
        </span>
      </td>
      <td>${c.ageYears} Yrs<br><span style="font-size:11px; color:#64748b;">DOB: ${c.dob}</span></td>
      <td>Lactation #${c.lactationNumber}<br><span style="font-size:11px; color:#64748b;">Calved: ${c.calvingDate || 'N/A'}</span></td>
      <td style="font-weight:900; color:#15803d; font-size:16px;">${c.dailyAvgYield} L/day</td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn-outline" style="padding:6px 12px; font-size:12px;" onclick="viewCowHistory('${c.id}')">
            📋 Full History
          </button>
          ${!isStaff ? `
            <button class="btn-danger" style="padding:6px 10px; font-size:12px;" onclick="deleteCow('${c.id}')">
              🗑️
            </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function filterCowsTable() {
  erpState.searchQueries.cows = document.getElementById('cow-search-input').value;
  erpState.statusFilters.cows = document.getElementById('cow-status-filter').value;
  renderCowsView();
}

// 360° Cow History Modal
async function viewCowHistory(cowId) {
  try {
    const res = await fetch(`/api/erp/cows/${cowId}/history`).then(r => r.json());
    if (!res.success) return;

    const c = res.cow;
    document.getElementById('hist-modal-title').innerText = `Cow ${c.tagNumber} - ${c.name} (${c.breed})`;
    document.getElementById('hist-modal-photo').src = c.photoUrl;
    document.getElementById('hist-modal-details').innerHTML = `
      <p><strong>Status:</strong> <span class="status-pill ${c.status}">${c.status.toUpperCase()}</span></p>
      <p><strong>Age:</strong> ${c.ageYears} Years (DOB: ${c.dob})</p>
      <p><strong>Purchase Date:</strong> ${c.purchaseDate} (Price: ₹${c.purchasePrice})</p>
      <p><strong>Calving Date:</strong> ${c.calvingDate || 'None'} ${c.expectedCalvingDate ? `• 🍼 Expected: ${c.expectedCalvingDate}` : ''}</p>
      <p><strong>Daily Average Yield:</strong> ${c.dailyAvgYield} Litres/day</p>
      <p><strong>Health Notes:</strong> ${c.healthNotes}</p>
    `;

    // Milk History Table
    const milkTable = document.getElementById('hist-milk-table-body');
    if (res.milkHistory.length === 0) {
      milkTable.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#64748b;">No milk logs recorded for this cow yet.</td></tr>';
    } else {
      milkTable.innerHTML = res.milkHistory.map(m => `
        <tr>
          <td>${m.date}</td>
          <td>${m.morningLitres} L</td>
          <td>${m.eveningLitres} L</td>
          <td><strong>${m.totalLitres} L</strong></td>
          <td>Fat ${m.fat}% • SNF ${m.snf}%</td>
        </tr>
      `).join('');
    }

    // Treatments History Table
    const trtTable = document.getElementById('hist-treatments-table-body');
    if (res.treatmentHistory.length === 0) {
      trtTable.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#64748b;">No veterinary illnesses recorded. Perfectly healthy.</td></tr>';
    } else {
      trtTable.innerHTML = res.treatmentHistory.map(t => `
        <tr>
          <td>${t.treatmentDate}</td>
          <td><strong>${t.illness}</strong></td>
          <td>${t.medicineName} (${t.dose})</td>
          <td>${t.vetName}</td>
          <td>${t.isWithdrawalActive ? `<span style="color:#dc2626; font-weight:800;">Active (until ${t.withdrawalEndDate})</span>` : 'Completed'}</td>
        </tr>
      `).join('');
    }

    document.getElementById('cow-history-modal').classList.add('active');
  } catch (err) {
    alert('Failed to load cow history');
  }
}

function openAddCowModal() {
  // Populate breeds dropdown from master settings
  const breedSelect = document.getElementById('add-cow-breed');
  if (breedSelect && erpState.masterSettings.breeds) {
    breedSelect.innerHTML = erpState.masterSettings.breeds.map(b => `<option value="${b}">${b}</option>`).join('');
  }
  document.getElementById('add-cow-modal').classList.add('active');
}

async function submitAddCow(e) {
  if (e) e.preventDefault();
  const tag = document.getElementById('add-cow-tag').value.trim();
  const name = document.getElementById('add-cow-name').value.trim();
  const breed = document.getElementById('add-cow-breed').value;
  const status = document.getElementById('add-cow-status').value;
  const dob = document.getElementById('add-cow-dob').value;
  const purchaseDate = document.getElementById('add-cow-purchase-date').value;
  const calvingDate = document.getElementById('add-cow-calving-date').value;
  const yieldAvg = Number(document.getElementById('add-cow-yield').value) || 12;

  try {
    const res = await fetch('/api/erp/cows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tagNumber: tag,
        name: name,
        breed: breed,
        status: status,
        dob: dob,
        purchaseDate: purchaseDate,
        calvingDate: calvingDate,
        dailyAvgYield: yieldAvg
      })
    }).then(r => r.json());

    if (res.success) {
      alert('🐄 Cow registered successfully!');
      document.getElementById('add-cow-modal').classList.remove('active');
      await loadAllErpData();
    }
  } catch (e) {
    alert('Error saving cow record');
  }
}

async function deleteCow(cowId) {
  if (erpState.currentUser.role !== 'admin') {
    alert('Permission Denied: Staff cannot delete records.');
    return;
  }
  if (!confirm('Are you sure you want to delete this cow record?')) return;

  try {
    const res = await fetch(`/api/erp/cows/${cowId}`, {
      method: 'DELETE',
      headers: { 'X-User-Role': 'admin' }
    }).then(r => r.json());

    if (res.success) {
      alert('Cow record removed.');
      await loadAllErpData();
    }
  } catch (e) {}
}

// ----------------------------------------------------------------------------
// 3. MILK PRODUCTION LIST & CHARTS CONTROLLER
// ----------------------------------------------------------------------------
function renderMilkView() {
  const container = document.getElementById('milk-table-body');
  if (!container) return;

  const dateFilter = document.getElementById('milk-date-filter') ? document.getElementById('milk-date-filter').value : '';
  const cowFilter = document.getElementById('milk-cow-filter') ? document.getElementById('milk-cow-filter').value : 'all';

  let list = erpState.milkRecords;
  if (dateFilter) list = list.filter(m => m.date === dateFilter);
  if (cowFilter !== 'all') list = list.filter(m => m.cowId === cowFilter);

  // Totals
  const totM = list.reduce((s, m) => s + (m.morningLitres || 0), 0);
  const totE = list.reduce((s, m) => s + (m.eveningLitres || 0), 0);
  const totL = list.reduce((s, m) => s + (m.totalLitres || 0), 0);
  const totSold = list.reduce((s, m) => s + (m.milkSold || 0), 0);
  const totKept = list.reduce((s, m) => s + (m.milkKept || 0), 0);
  const totRevenue = list.reduce((s, m) => s + ((m.milkSold || 0) * (m.ratePerLitre || 65)), 0);

  const setT = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  setT('milk-summary-total-litres', `${totL.toFixed(1)} L`);
  setT('milk-summary-morning', `${totM.toFixed(1)} L`);
  setT('milk-summary-evening', `${totE.toFixed(1)} L`);
  setT('milk-summary-sold-kept', `Sold: ${totSold.toFixed(1)}L  |  Kept: ${totKept.toFixed(1)}L`);
  setT('milk-summary-revenue', `₹${totRevenue.toLocaleString()}`);

  container.innerHTML = list.map(m => `
    <tr>
      <td style="font-weight:700;">${m.date}</td>
      <td><strong>${m.cowTag}</strong> (${m.cowName})</td>
      <td>${m.morningLitres} L</td>
      <td>${m.eveningLitres} L</td>
      <td style="font-weight:900; color:#15803d; font-size:16px;">${m.totalLitres} L</td>
      <td>Fat ${m.fat}% • SNF ${m.snf}%</td>
      <td>${m.milkSold} L (Sold) / ${m.milkKept} L (Kept)</td>
      <td><strong>₹${m.ratePerLitre}/L</strong> (₹${m.milkSold * m.ratePerLitre})</td>
    </tr>
  `).join('');

  // Render SVG Production Chart
  renderProductionChart(list);
  populateMilkCowDropdown();
}

function populateMilkCowDropdown() {
  const select = document.getElementById('milk-cow-filter');
  const modalSelect = document.getElementById('log-milk-cow-select');
  if (select && select.children.length <= 1) {
    erpState.cows.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.innerText = `${c.tagNumber} - ${c.name}`;
      select.appendChild(opt);
    });
  }
  if (modalSelect && modalSelect.children.length === 0) {
    erpState.cows.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.innerText = `${c.tagNumber} - ${c.name} (${c.breed})`;
      modalSelect.appendChild(opt);
    });
  }
}

// Interactive SVG Production Graph
function renderProductionChart(records) {
  const svg = document.getElementById('milk-trend-svg');
  if (!svg) return;

  // Group by date
  const byDate = {};
  records.forEach(r => {
    byDate[r.date] = (byDate[r.date] || 0) + r.totalLitres;
  });

  const dates = Object.keys(byDate).sort().slice(-7); // Last 7 days
  if (dates.length === 0) return;

  const maxYield = Math.max(...dates.map(d => byDate[d]), 50);
  const width = 600;
  const height = 180;
  const barWidth = 40;
  const spacing = (width - 60) / dates.length;

  let barsHtml = '';
  dates.forEach((d, i) => {
    const val = byDate[d];
    const barHeight = (val / maxYield) * (height - 40);
    const x = 50 + i * spacing;
    const y = height - barHeight - 20;

    barsHtml += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="#16a34a" />
      <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" font-weight="800" text-anchor="middle" fill="#15803d">${val.toFixed(1)}L</text>
      <text x="${x + barWidth / 2}" y="${height - 4}" font-size="10" text-anchor="middle" fill="#64748b">${d.slice(5)}</text>
    `;
  });

  svg.innerHTML = `
    <line x1="40" y1="${height - 20}" x2="${width}" y2="${height - 20}" stroke="#cbd5e1" stroke-width="1.5" />
    ${barsHtml}
  `;
}

function openAddMilkModal() {
  document.getElementById('log-milk-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('add-milk-modal').classList.add('active');
}

async function submitDailyMilk(e) {
  if (e) e.preventDefault();
  const cowId = document.getElementById('log-milk-cow-select').value;
  const date = document.getElementById('log-milk-date').value;
  const morning = Number(document.getElementById('log-milk-morning').value) || 0;
  const evening = Number(document.getElementById('log-milk-evening').value) || 0;
  const fat = Number(document.getElementById('log-milk-fat').value) || 4.5;
  const snf = Number(document.getElementById('log-milk-snf').value) || 8.8;
  const rate = Number(document.getElementById('log-milk-rate').value) || 65;

  try {
    const res = await fetch('/api/erp/milk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cowId, date, morningLitres: morning, eveningLitres: evening, fat, snf, ratePerLitre: rate
      })
    }).then(r => r.json());

    if (res.success) {
      alert('🥛 Milk production entry logged!');
      document.getElementById('add-milk-modal').classList.remove('active');
      await loadAllErpData();
    }
  } catch (e) {
    alert('Error saving milk log');
  }
}

// ----------------------------------------------------------------------------
// 4. MEDICINE, TREATMENT & WITHDRAWAL TRACKER CONTROLLER
// ----------------------------------------------------------------------------
function renderMedicineView() {
  // Medicine Stock Table
  const medTable = document.getElementById('medicine-table-body');
  if (medTable) {
    medTable.innerHTML = erpState.medicines.map(m => {
      const isLow = m.quantity <= m.minAlertLevel;
      const isNearExp = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) <= 60;
      return `
        <tr>
          <td><strong>${m.name}</strong><br><span style="font-size:11px; color:#64748b;">${m.notes}</span></td>
          <td><span style="padding:2px 8px; border-radius:4px; font-size:11px; font-weight:800; background:#f1f5f9;">${m.type.toUpperCase()}</span></td>
          <td style="font-weight:900; color:${isLow ? '#dc2626' : '#15803d'}; font-size:15px;">
            ${m.quantity} ${m.unit} ${isLow ? '⚠️ Low' : ''}
          </td>
          <td>${m.expiryDate} ${isNearExp ? '<span style="color:#d97706; font-weight:800;">(Expiring Soon)</span>' : ''}</td>
          <td>₹${m.price}</td>
          <td>${m.supplier}</td>
          <td><strong>${m.withdrawalDays} Days</strong></td>
        </tr>
      `;
    }).join('');
  }

  // Treatment & Withdrawal Table
  const trtTable = document.getElementById('treatments-table-body');
  if (trtTable) {
    trtTable.innerHTML = erpState.treatments.map(t => `
      <tr style="${t.isWithdrawalActive ? 'background:#fef2f2;' : ''}">
        <td style="font-weight:700;">${t.treatmentDate}</td>
        <td><strong>${t.cowTag}</strong> (${t.cowName})</td>
        <td><strong>${t.illness}</strong></td>
        <td>${t.medicineName} (${t.dose})</td>
        <td>${t.vetName}</td>
        <td>
          ${t.isWithdrawalActive ? `
            <span style="background:#fee2e2; color:#991b1b; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:900; border:1px solid #fca5a5;">
              🚫 ACTIVE WITHDRAWAL (Until ${t.withdrawalEndDate})
            </span>
          ` : `
            <span style="color:#16a34a; font-weight:700; font-size:12px;">✓ Cleared</span>
          `}
        </td>
      </tr>
    `).join('');
  }

  // Vaccination Table
  const vacTable = document.getElementById('vaccinations-table-body');
  if (vacTable) {
    vacTable.innerHTML = erpState.vaccinations.map(v => `
      <tr>
        <td><strong>${v.cowTag}</strong> (${v.cowName})</td>
        <td>${v.vaccineName}</td>
        <td>${v.dateAdministered}</td>
        <td style="font-weight:800; color:${v.status === 'due_soon' ? '#d97706' : '#15803d'};">
          ${v.nextDueDate} ${v.status === 'due_soon' ? '⚠️ Due Soon' : ''}
        </td>
        <td>${v.vetName}</td>
      </tr>
    `).join('');
  }

  populateTreatmentDropdowns();
}

function populateTreatmentDropdowns() {
  const cowSelect = document.getElementById('add-trt-cow-select');
  const medSelect = document.getElementById('add-trt-med-select');

  if (cowSelect && cowSelect.children.length === 0) {
    erpState.cows.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.innerText = `${c.tagNumber} - ${c.name}`;
      cowSelect.appendChild(opt);
    });
  }

  if (medSelect && medSelect.children.length === 0) {
    erpState.medicines.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.innerText = `${m.name} (${m.type}) - ${m.withdrawalDays}d withdrawal`;
      medSelect.appendChild(opt);
    });
  }
}

function openAddTreatmentModal() {
  document.getElementById('add-trt-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('add-treatment-modal').classList.add('active');
}

async function submitTreatment(e) {
  if (e) e.preventDefault();
  const cowId = document.getElementById('add-trt-cow-select').value;
  const medId = document.getElementById('add-trt-med-select').value;
  const illness = document.getElementById('add-trt-illness').value.trim();
  const dose = document.getElementById('add-trt-dose').value.trim();
  const date = document.getElementById('add-trt-date').value;
  const vet = document.getElementById('add-trt-vet').value.trim();
  const cost = Number(document.getElementById('add-trt-cost').value) || 0;
  const withdrawal = Number(document.getElementById('add-trt-withdrawal').value) || 0;

  const med = erpState.medicines.find(m => m.id === medId);

  try {
    const res = await fetch('/api/erp/treatments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cowId, medicineId: medId, medicineName: med ? med.name : 'Medicine', illness, dose, treatmentDate: date, vetName: vet, cost, withdrawalDays: withdrawal
      })
    }).then(r => r.json());

    if (res.success) {
      alert(res.message);
      document.getElementById('add-treatment-modal').classList.remove('active');
      await loadAllErpData();
    }
  } catch (e) {
    alert('Error logging treatment');
  }
}

// ----------------------------------------------------------------------------
// 5. COW FEED & COST PER LITRE CONTROLLER
// ----------------------------------------------------------------------------
function renderFeedView() {
  // Inventory Table
  const feedTable = document.getElementById('feed-stock-table-body');
  if (feedTable) {
    feedTable.innerHTML = erpState.feedInventory.map(f => {
      const isLow = f.stockKg <= f.alertKg;
      return `
        <tr>
          <td><strong>${f.name}</strong></td>
          <td>${f.category.replace('_', ' ').toUpperCase()}</td>
          <td style="font-weight:900; color:${isLow ? '#dc2626' : '#15803d'}; font-size:16px;">
            ${f.stockKg} kg ${isLow ? '⚠️ LOW STOCK' : ''}
          </td>
          <td>${f.alertKg} kg</td>
          <td>₹${f.pricePerKg} / kg</td>
          <td>${f.supplier}</td>
        </tr>
      `;
    }).join('');
  }

  // Daily Feeding Rations Table
  const logsTable = document.getElementById('feeding-logs-table-body');
  if (logsTable) {
    let todayFeedCost = 0;
    logsTable.innerHTML = erpState.feedingLogs.map(l => {
      todayFeedCost += l.totalCost || 0;
      return `
        <tr>
          <td>${l.date}</td>
          <td><strong>${l.target}</strong></td>
          <td>${l.feedName}</td>
          <td>${l.quantityKg} kg</td>
          <td>₹${l.costPerKg}</td>
          <td style="font-weight:900; color:#15803d;">₹${l.totalCost}</td>
        </tr>
      `;
    }).join('');

    // Calculate feed cost per litre of milk produced
    const todayYield = erpState.kpis.todayTotalMilkLitres || 74;
    const costPerLitre = todayYield > 0 ? (todayFeedCost / todayYield).toFixed(2) : 0;

    const setF = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    setF('feed-metric-daily-cost', `₹${todayFeedCost.toFixed(2)}`);
    setF('feed-metric-cost-per-litre', `₹${costPerLitre} / Litre`);
  }

  populateFeedDropdowns();
}

function populateFeedDropdowns() {
  const select = document.getElementById('add-ration-feed-select');
  if (select && select.children.length === 0) {
    erpState.feedInventory.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.innerText = `${f.name} (Stock: ${f.stockKg}kg @ ₹${f.pricePerKg}/kg)`;
      select.appendChild(opt);
    });
  }
}

function openAddRationModal() {
  document.getElementById('add-ration-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('add-ration-modal').classList.add('active');
}

async function submitFeedRation(e) {
  if (e) e.preventDefault();
  const feedId = document.getElementById('add-ration-feed-select').value;
  const target = document.getElementById('add-ration-target').value;
  const qty = Number(document.getElementById('add-ration-qty').value) || 0;
  const date = document.getElementById('add-ration-date').value;

  try {
    const res = await fetch('/api/erp/feed/rations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedId, target, quantityKg: qty, date })
    }).then(r => r.json());

    if (res.success) {
      alert(`🌾 ${res.message}`);
      document.getElementById('add-ration-modal').classList.remove('active');
      await loadAllErpData();
    } else {
      alert(res.message);
    }
  } catch (e) {
    alert('Error recording feed ration');
  }
}

// ----------------------------------------------------------------------------
// 6. EXPENSES (ADMIN ONLY) CONTROLLER
// ----------------------------------------------------------------------------
function renderExpensesView() {
  if (erpState.currentUser.role !== 'admin') return;

  const container = document.getElementById('expenses-table-body');
  if (!container) return;

  const catFilter = document.getElementById('expense-cat-filter') ? document.getElementById('expense-cat-filter').value : 'all';
  let list = erpState.expenses;
  if (catFilter !== 'all') list = list.filter(e => e.category === catFilter);

  const total = list.reduce((s, e) => s + (e.amount || 0), 0);
  const totEl = document.getElementById('expenses-total-display');
  if (totEl) totEl.innerText = `₹${total.toLocaleString()}`;

  container.innerHTML = list.map(e => `
    <tr>
      <td style="font-weight:700;">${e.date}</td>
      <td><span style="padding:3px 8px; border-radius:4px; font-size:11px; font-weight:800; background:#f1f5f9;">${e.category.toUpperCase()}</span></td>
      <td><strong>${e.payee}</strong></td>
      <td>${e.description}</td>
      <td>${e.paymentMode}</td>
      <td style="font-weight:900; color:#dc2626; font-size:16px;">₹${e.amount.toLocaleString()}</td>
    </tr>
  `).join('');
}

function openAddExpenseModal() {
  document.getElementById('add-exp-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('add-expense-modal').classList.add('active');
}

async function submitExpense(e) {
  if (e) e.preventDefault();
  const category = document.getElementById('add-exp-cat').value;
  const payee = document.getElementById('add-exp-payee').value.trim();
  const amount = Number(document.getElementById('add-exp-amount').value) || 0;
  const desc = document.getElementById('add-exp-desc').value.trim();
  const mode = document.getElementById('add-exp-mode').value;
  const date = document.getElementById('add-exp-date').value;

  try {
    const res = await fetch('/api/erp/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, payee, amount, description: desc, paymentMode: mode, date })
    }).then(r => r.json());

    if (res.success) {
      alert('Expense recorded.');
      document.getElementById('add-expense-modal').classList.remove('active');
      await loadAllErpData();
    }
  } catch (e) {
    alert('Error saving expense');
  }
}

// ----------------------------------------------------------------------------
// 7. FINANCIAL REPORTS & PROFIT/LOSS (ADMIN ONLY) CONTROLLER
// ----------------------------------------------------------------------------
function renderReportsView() {
  if (erpState.currentUser.role !== 'admin') return;
  const p = erpState.pnlReport;
  if (!p || !p.revenue) return;

  const setR = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  setR('pnl-milk-income', `₹${p.revenue.totalMilkIncome.toLocaleString()}`);
  setR('pnl-milk-sold-litres', `${p.revenue.milkSoldLitres} Litres Sold`);
  setR('pnl-feed-expense', `₹${p.expenses.feed.toLocaleString()}`);
  setR('pnl-medicine-expense', `₹${p.expenses.medicine.toLocaleString()}`);
  setR('pnl-labour-expense', `₹${p.expenses.labour.toLocaleString()}`);
  setR('pnl-electricity-expense', `₹${p.expenses.electricity.toLocaleString()}`);
  setR('pnl-other-expense', `₹${p.expenses.other.toLocaleString()}`);
  setR('pnl-total-expenses', `₹${p.totalExpenses.toLocaleString()}`);

  const netEl = document.getElementById('pnl-net-profit');
  if (netEl) {
    netEl.innerText = `₹${p.netOperatingProfit.toLocaleString()}`;
    netEl.style.color = p.netOperatingProfit >= 0 ? '#16a34a' : '#dc2626';
  }

  setR('pnl-feed-cost-per-litre', `₹${p.metrics.feedCostPerLitre} / Litre`);
}

function exportReportFile(type) {
  window.open(`/api/reports/export?type=${type}`, '_blank');
}

// ----------------------------------------------------------------------------
// 8. SETTINGS & MASTER CATEGORIES CONTROLLER
// ----------------------------------------------------------------------------
function renderSettingsView() {
  const usersTable = document.getElementById('settings-users-table-body');
  if (usersTable) {
    usersTable.innerHTML = `
      <tr>
        <td><strong>Sardar Gurmeet Singh</strong></td>
        <td>admin</td>
        <td><span class="role-badge admin">ADMIN (OWNER)</span></td>
        <td>Full access to records, cattle registry, finance & deletion</td>
      </tr>
      <tr>
        <td><strong>Ramesh Kumar</strong></td>
        <td>staff</td>
        <td><span class="role-badge staff">STAFF (WORKER)</span></td>
        <td>Can add milk, feed, health logs. Cannot delete or see finance</td>
      </tr>
    `;
  }
}

function downloadDatabaseBackup() {
  window.open('/api/erp/backup', '_blank');
}

function toggleMobileSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}
