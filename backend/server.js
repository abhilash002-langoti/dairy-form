// ============================================================================
// AMRIT DAIRY FARMS - PRODUCTION REST API & ERP SERVER
// Built with pure Node.js (Zero external dependencies)
// ============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Initialize in-memory store
let db = {};

function initData() {
  const initial = require('./data/initialData');
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      db = JSON.parse(content);
      // Ensure all ERP keys exist
      ['erpUsers', 'masterSettings', 'milkProduction', 'medicines', 'treatments', 'vaccinations', 'feedingLogs'].forEach(k => {
        if (!db[k]) db[k] = JSON.parse(JSON.stringify(initial[k] || []));
      });
      console.log('Loaded database state from', DATA_FILE);
      return;
    } catch (e) {
      console.error('Error reading existing store.json, re-seeding:', e.message);
    }
  }
  db = JSON.parse(JSON.stringify(initial));
  saveData();
  console.log('Initialized fresh database with comprehensive farm ERP data.');
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save store.json:', e);
  }
}

initData();

// Helper MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-User-Role'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) reject(new Error('Body too large'));
    });
    req.on('end', () => {
      try {
        if (!body) return resolve({});
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-User-Role'
    });
    return res.end();
  }

  // -------------------------------------------------------------
  // API ROUTING
  // -------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    try {
      // ---------------------------------------------------------
      // SECTION A: FARM ERP API ENDPOINTS
      // ---------------------------------------------------------

      // 1. ERP Authentication: Login with Username/Phone + Password or OTP
      if (pathname === '/api/erp/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        const identifier = (body.username || body.phone || '').trim().toLowerCase();
        const password = body.password || '';
        const otp = body.otp;

        const user = db.erpUsers.find(u =>
          u.username.toLowerCase() === identifier ||
          u.phone === identifier ||
          u.email.toLowerCase() === identifier
        );

        if (!user) {
          return sendJSON(res, 401, { success: false, message: 'User not found. Use admin/admin123 or staff/staff123.' });
        }

        // Password or demo OTP verification
        const isPasswordValid = user.password === password;
        const isOtpValid = otp === '1234' || otp === '9999';

        if (!isPasswordValid && !isOtpValid) {
          return sendJSON(res, 401, { success: false, message: 'Invalid credentials. Password or OTP (1234) incorrect.' });
        }

        return sendJSON(res, 200, {
          success: true,
          message: `Welcome back, ${user.name}! Logged in as ${user.role.toUpperCase()}.`,
          token: `token-erp-${user.role}-${Date.now()}`,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role, // 'admin' or 'staff'
            title: user.title,
            phone: user.phone,
            email: user.email
          }
        });
      }

      // 2. ERP Dashboard Overview Metrics
      if (pathname === '/api/erp/dashboard' && method === 'GET') {
        const today = new Date().toISOString().split('T')[0];

        // Cows breakdown
        const totalCows = db.cows.length;
        const cowsInMilk = db.cows.filter(c => c.status === 'milking').length;
        const dryCows = db.cows.filter(c => c.status === 'dry').length;
        const pregnantCows = db.cows.filter(c => c.status === 'pregnant' || c.expectedCalvingDate).length;
        const sickCows = db.cows.filter(c => c.status === 'sick').length;

        // Today's milk production
        const todayRecords = db.milkProduction.filter(m => m.date === today);
        let todayMorning = 0;
        let todayEvening = 0;
        let todaySold = 0;
        let todayKept = 0;

        todayRecords.forEach(r => {
          todayMorning += r.morningLitres || 0;
          todayEvening += r.eveningLitres || 0;
          todaySold += r.milkSold || 0;
          todayKept += r.milkKept || 0;
        });

        const totalYieldToday = Number((todayMorning + todayEvening).toFixed(1));

        // Low stock alerts for feeds
        const lowStockFeeds = db.feedInventory.filter(f => f.stockKg <= f.alertKg);

        // Low stock and near-expiry alerts for medicines
        const lowStockMedicines = db.medicines.filter(m => m.quantity <= m.minAlertLevel);
        const nearExpiryMedicines = db.medicines.filter(m => {
          const exp = new Date(m.expiryDate);
          const diffDays = (exp - new Date()) / (1000 * 60 * 60 * 24);
          return diffDays <= 60; // within 60 days
        });

        // Upcoming vaccinations in the next 30 days
        const upcomingVaccinations = db.vaccinations.filter(v => v.status === 'due_soon');

        // Active antibiotic withdrawal period alerts!
        const activeWithdrawals = db.treatments.filter(t => t.isWithdrawalActive && new Date(t.withdrawalEndDate) >= new Date());

        // Today's expenses
        const todayExpenses = db.expenses
          .filter(e => e.date === today)
          .reduce((sum, e) => sum + e.amount, 0);

        return sendJSON(res, 200, {
          success: true,
          kpis: {
            todayTotalMilkLitres: totalYieldToday,
            todayMorningLitres: Number(todayMorning.toFixed(1)),
            todayEveningLitres: Number(todayEvening.toFixed(1)),
            todayMilkSoldLitres: Number(todaySold.toFixed(1)),
            todayMilkKeptLitres: Number(todayKept.toFixed(1)),
            todayExpenses: todayExpenses,
            totalCows,
            cowsInMilk,
            dryCows,
            pregnantCows,
            sickCows
          },
          alerts: {
            lowStockFeeds,
            lowStockMedicines,
            nearExpiryMedicines,
            upcomingVaccinations,
            activeWithdrawals
          }
        });
      }

      // 3. Cow Master Records
      if (pathname === '/api/erp/cows' && method === 'GET') {
        let list = db.cows;
        const q = (parsedUrl.query.q || '').toLowerCase();
        const status = parsedUrl.query.status;

        if (q) {
          list = list.filter(c =>
            c.tagNumber.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.breed.toLowerCase().includes(q)
          );
        }
        if (status && status !== 'all') {
          list = list.filter(c => c.status === status);
        }
        return sendJSON(res, 200, { success: true, count: list.length, cows: list });
      }

      if (pathname === '/api/erp/cows' && method === 'POST') {
        const body = await parseBody(req);
        if (!body.tagNumber || !body.breed) {
          return sendJSON(res, 400, { success: false, message: 'Tag Number and Breed are required.' });
        }
        const newCow = {
          id: 'cow-' + Date.now(),
          tagNumber: body.tagNumber.toUpperCase().trim(),
          name: body.name || `Cow-${body.tagNumber}`,
          breed: body.breed,
          type: body.type || 'Cow',
          status: body.status || 'milking',
          dob: body.dob || '2021-01-01',
          ageYears: Number(body.ageYears) || 3.0,
          purchaseDate: body.purchaseDate || new Date().toISOString().split('T')[0],
          purchasePrice: Number(body.purchasePrice) || 60000,
          calvingDate: body.calvingDate || null,
          expectedCalvingDate: body.expectedCalvingDate || null,
          lactationNumber: Number(body.lactationNumber) || 1,
          dailyAvgYield: Number(body.dailyAvgYield) || 12.0,
          weightKg: Number(body.weightKg) || 400,
          healthNotes: body.healthNotes || '',
          photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80'
        };
        db.cows.unshift(newCow);
        saveData();
        return sendJSON(res, 201, { success: true, message: 'Cow added to master registry', cow: newCow });
      }

      // Edit Cow
      if (pathname.match(/^\/api\/erp\/cows\/[^\/]+$/) && method === 'PUT') {
        const id = pathname.split('/')[4];
        const body = await parseBody(req);
        const idx = db.cows.findIndex(c => c.id === id);
        if (idx === -1) return sendJSON(res, 404, { success: false, message: 'Cow not found' });

        db.cows[idx] = { ...db.cows[idx], ...body };
        saveData();
        return sendJSON(res, 200, { success: true, message: 'Cow updated successfully', cow: db.cows[idx] });
      }

      // Delete Cow (Admin Only)
      if (pathname.match(/^\/api\/erp\/cows\/[^\/]+$/) && method === 'DELETE') {
        const id = pathname.split('/')[4];
        const userRole = req.headers['x-user-role'];
        if (userRole !== 'admin') {
          return sendJSON(res, 403, { success: false, message: 'Permission Denied: Only Farm Owner (Admin) can delete records.' });
        }
        db.cows = db.cows.filter(c => c.id !== id);
        saveData();
        return sendJSON(res, 200, { success: true, message: 'Cow record deleted successfully.' });
      }

      // 4. Cow 360° History (Milk, Treatments, Feed Rations)
      if (pathname.match(/^\/api\/erp\/cows\/[^\/]+\/history$/) && method === 'GET') {
        const id = pathname.split('/')[4];
        const cow = db.cows.find(c => c.id === id);
        if (!cow) return sendJSON(res, 404, { success: false, message: 'Cow not found' });

        const milk = db.milkProduction.filter(m => m.cowId === id || m.cowTag === cow.tagNumber);
        const treatments = db.treatments.filter(t => t.cowId === id || t.cowTag === cow.tagNumber);
        const vaccinations = db.vaccinations.filter(v => v.cowId === id || v.cowTag === cow.tagNumber);

        return sendJSON(res, 200, {
          success: true,
          cow,
          milkHistory: milk,
          treatmentHistory: treatments,
          vaccinationHistory: vaccinations
        });
      }

      // 5. Milk Production Records
      if (pathname === '/api/erp/milk' && method === 'GET') {
        let list = db.milkProduction;
        const cowId = parsedUrl.query.cowId;
        const date = parsedUrl.query.date;

        if (cowId) list = list.filter(m => m.cowId === cowId);
        if (date) list = list.filter(m => m.date === date);

        const totalMorning = list.reduce((s, m) => s + (m.morningLitres || 0), 0);
        const totalEvening = list.reduce((s, m) => s + (m.eveningLitres || 0), 0);
        const totalLitres = list.reduce((s, m) => s + (m.totalLitres || 0), 0);
        const totalSold = list.reduce((s, m) => s + (m.milkSold || 0), 0);
        const totalKept = list.reduce((s, m) => s + (m.milkKept || 0), 0);
        const totalSalesRevenue = list.reduce((s, m) => s + ((m.milkSold || 0) * (m.ratePerLitre || 65)), 0);

        return sendJSON(res, 200, {
          success: true,
          count: list.length,
          summary: {
            totalMorning: Number(totalMorning.toFixed(1)),
            totalEvening: Number(totalEvening.toFixed(1)),
            totalLitres: Number(totalLitres.toFixed(1)),
            totalSold: Number(totalSold.toFixed(1)),
            totalKept: Number(totalKept.toFixed(1)),
            totalSalesRevenue: Number(totalSalesRevenue.toFixed(2))
          },
          records: list
        });
      }

      if (pathname === '/api/erp/milk' && method === 'POST') {
        const body = await parseBody(req);
        const cow = db.cows.find(c => c.id === body.cowId || c.tagNumber === body.cowTag);
        if (!cow) return sendJSON(res, 400, { success: false, message: 'Please select a valid cow.' });

        const mMorning = Number(body.morningLitres) || 0;
        const mEvening = Number(body.eveningLitres) || 0;
        const mTotal = Number((mMorning + mEvening).toFixed(1));
        const rate = Number(body.ratePerLitre) || db.masterSettings.milkSaleRatePerLitre;
        const sold = body.milkSold !== undefined ? Number(body.milkSold) : mTotal;
        const kept = body.milkKept !== undefined ? Number(body.milkKept) : Math.max(0, mTotal - sold);

        const newRec = {
          id: 'mlp-' + Date.now(),
          date: body.date || new Date().toISOString().split('T')[0],
          cowId: cow.id,
          cowTag: cow.tagNumber,
          cowName: cow.name,
          morningLitres: mMorning,
          eveningLitres: mEvening,
          totalLitres: mTotal,
          fat: Number(body.fat) || 4.5,
          snf: Number(body.snf) || 8.8,
          milkSold: sold,
          milkKept: kept,
          ratePerLitre: rate,
          notes: body.notes || ''
        };

        db.milkProduction.unshift(newRec);
        saveData();
        return sendJSON(res, 201, { success: true, message: 'Daily milk yield entry recorded.', record: newRec });
      }

      // 6. Medicine Inventory & Expiry Alerts
      if (pathname === '/api/erp/medicines' && method === 'GET') {
        return sendJSON(res, 200, { success: true, medicines: db.medicines });
      }

      if (pathname === '/api/erp/medicines' && method === 'POST') {
        const body = await parseBody(req);
        const newMed = {
          id: 'med-' + Date.now(),
          name: body.name,
          type: body.type || 'antibiotic',
          quantity: Number(body.quantity) || 1,
          unit: body.unit || 'vials',
          minAlertLevel: Number(body.minAlertLevel) || 2,
          purchaseDate: body.purchaseDate || new Date().toISOString().split('T')[0],
          expiryDate: body.expiryDate || '2027-12-31',
          price: Number(body.price) || 0,
          supplier: body.supplier || 'Veterinary Supplier',
          withdrawalDays: Number(body.withdrawalDays) || 0,
          notes: body.notes || ''
        };
        db.medicines.unshift(newMed);
        saveData();
        return sendJSON(res, 201, { success: true, message: 'Medicine added to inventory.', medicine: newMed });
      }

      // 7. Veterinary Treatments & Withdrawal Period Tracker
      if (pathname === '/api/erp/treatments' && method === 'GET') {
        return sendJSON(res, 200, { success: true, treatments: db.treatments });
      }

      if (pathname === '/api/erp/treatments' && method === 'POST') {
        const body = await parseBody(req);
        const cow = db.cows.find(c => c.id === body.cowId || c.tagNumber === body.cowTag);
        if (!cow) return sendJSON(res, 400, { success: false, message: 'Cow not found' });

        const treatmentDate = body.treatmentDate || new Date().toISOString().split('T')[0];
        const withdrawalDays = Number(body.withdrawalDays) || 0;

        // Calculate withdrawal end date
        let withdrawalEndDate = null;
        let isWithdrawalActive = false;
        if (withdrawalDays > 0) {
          const end = new Date(treatmentDate);
          end.setDate(end.getDate() + withdrawalDays);
          withdrawalEndDate = end.toISOString().split('T')[0];
          isWithdrawalActive = new Date(withdrawalEndDate) >= new Date();
          // Update cow health status to sick/treated
          cow.status = 'sick';
          cow.healthNotes = `Under treatment for ${body.illness || 'illness'}. Milk withdrawal active until ${withdrawalEndDate}.`;
        }

        const newTrt = {
          id: 'trt-' + Date.now(),
          cowId: cow.id,
          cowTag: cow.tagNumber,
          cowName: cow.name,
          illness: body.illness || 'Infection',
          medicineId: body.medicineId || '',
          medicineName: body.medicineName || 'Medicine',
          dose: body.dose || '10 ml',
          treatmentDate: treatmentDate,
          vetName: body.vetName || 'Dr. Ramesh BVSc',
          cost: Number(body.cost) || 0,
          withdrawalDays: withdrawalDays,
          withdrawalEndDate: withdrawalEndDate,
          isWithdrawalActive: isWithdrawalActive,
          notes: body.notes || ''
        };

        db.treatments.unshift(newTrt);
        // Also log into expenses if cost > 0
        if (newTrt.cost > 0) {
          db.expenses.unshift({
            id: 'exp-' + Date.now(),
            date: treatmentDate,
            category: 'medicine',
            amount: newTrt.cost,
            payee: newTrt.vetName,
            description: `Treatment for ${cow.tagNumber} (${newTrt.illness})`,
            paymentMode: 'Cash / UPI'
          });
        }
        saveData();
        return sendJSON(res, 201, {
          success: true,
          message: withdrawalDays > 0
            ? `Treatment logged! ⚠️ WITHDRAWAL PERIOD ACTIVE until ${withdrawalEndDate}. Milk from ${cow.tagNumber} must NOT be sold.`
            : 'Treatment record logged.',
          treatment: newTrt
        });
      }

      // 8. Vaccinations Schedule & Reminders
      if (pathname === '/api/erp/vaccinations' && method === 'GET') {
        return sendJSON(res, 200, { success: true, vaccinations: db.vaccinations });
      }

      if (pathname === '/api/erp/vaccinations' && method === 'POST') {
        const body = await parseBody(req);
        const cow = db.cows.find(c => c.id === body.cowId || c.tagNumber === body.cowTag);
        if (!cow) return sendJSON(res, 400, { success: false, message: 'Cow not found' });

        const newVac = {
          id: 'vac-' + Date.now(),
          cowId: cow.id,
          cowTag: cow.tagNumber,
          cowName: cow.name,
          vaccineName: body.vaccineName || 'FMD Booster',
          dateAdministered: body.dateAdministered || new Date().toISOString().split('T')[0],
          nextDueDate: body.nextDueDate || '2026-12-01',
          vetName: body.vetName || 'Dr. Ramesh BVSc',
          status: body.status || 'completed'
        };

        db.vaccinations.unshift(newVac);
        saveData();
        return sendJSON(res, 201, { success: true, message: 'Vaccination record saved.', vaccination: newVac });
      }

      // 9. Cow Feed Inventory & Daily Rations
      if (pathname === '/api/erp/feed' && method === 'GET') {
        return sendJSON(res, 200, { success: true, feedInventory: db.feedInventory });
      }

      if (pathname === '/api/erp/feed' && method === 'POST') {
        const body = await parseBody(req);
        const newFeed = {
          id: 'feed-' + Date.now(),
          name: body.name,
          category: body.category || 'green_fodder',
          stockKg: Number(body.stockKg) || 0,
          alertKg: Number(body.alertKg) || 200,
          pricePerKg: Number(body.pricePerKg) || 5.0,
          supplier: body.supplier || 'Feed Merchant',
          purchaseDate: body.purchaseDate || new Date().toISOString().split('T')[0]
        };
        db.feedInventory.unshift(newFeed);
        saveData();
        return sendJSON(res, 201, { success: true, message: 'Feed item created.', feedItem: newFeed });
      }

      // Feeding Rations (calculates feed cost per day and per litre of milk produced)
      if (pathname === '/api/erp/feed/rations' && method === 'GET') {
        return sendJSON(res, 200, { success: true, feedingLogs: db.feedingLogs });
      }

      if (pathname === '/api/erp/feed/rations' && method === 'POST') {
        const body = await parseBody(req);
        const feed = db.feedInventory.find(f => f.id === body.feedId);
        if (!feed) return sendJSON(res, 400, { success: false, message: 'Feed item not found' });

        const qty = Number(body.quantityKg) || 0;
        if (feed.stockKg < qty) {
          return sendJSON(res, 400, { success: false, message: `Insufficient feed stock. Available: ${feed.stockKg} kg.` });
        }

        // Deduct from stock
        feed.stockKg -= qty;

        const totalCost = Number((qty * feed.pricePerKg).toFixed(2));
        const newLog = {
          id: 'fdl-' + Date.now(),
          date: body.date || new Date().toISOString().split('T')[0],
          target: body.target || 'All Herd',
          feedId: feed.id,
          feedName: feed.name,
          quantityKg: qty,
          costPerKg: feed.pricePerKg,
          totalCost: totalCost,
          notes: body.notes || ''
        };

        db.feedingLogs.unshift(newLog);
        saveData();
        return sendJSON(res, 201, {
          success: true,
          message: `Ration logged! Deducted ${qty}kg of ${feed.name}. Total feed cost: ₹${totalCost}.`,
          log: newLog
        });
      }

      // 10. Expenses & Monthly Profit/Loss Reports (Admin Only)
      if (pathname === '/api/erp/expenses' && method === 'GET') {
        const userRole = req.headers['x-user-role'];
        if (userRole === 'staff') {
          return sendJSON(res, 403, { success: false, message: 'Restricted: Financial expenses are visible to Farm Owner (Admin) only.' });
        }
        return sendJSON(res, 200, { success: true, expenses: db.expenses });
      }

      if (pathname === '/api/erp/expenses' && method === 'POST') {
        const body = await parseBody(req);
        const newExp = {
          id: 'exp-' + Date.now(),
          date: body.date || new Date().toISOString().split('T')[0],
          category: body.category || 'other',
          amount: Number(body.amount) || 0,
          payee: body.payee || '',
          description: body.description || '',
          paymentMode: body.paymentMode || 'Cash'
        };
        db.expenses.unshift(newExp);
        saveData();
        return sendJSON(res, 201, { success: true, message: 'Expense logged successfully.', expense: newExp });
      }

      // Profit and Loss Statement (Admin Only)
      if (pathname === '/api/erp/reports/pnl' && method === 'GET') {
        const userRole = req.headers['x-user-role'];
        if (userRole === 'staff') {
          return sendJSON(res, 403, { success: false, message: 'Restricted: Financial P&L statements are visible to Farm Owner (Admin) only.' });
        }

        // Milk Revenue
        const totalMilkSoldLitres = db.milkProduction.reduce((sum, m) => sum + (m.milkSold || 0), 0);
        const totalMilkIncome = db.milkProduction.reduce((sum, m) => sum + ((m.milkSold || 0) * (m.ratePerLitre || 65)), 0);

        // Expense by category
        const expenseBreakdown = {
          feed: 0,
          medicine: 0,
          labour: 0,
          electricity: 0,
          other: 0
        };

        db.expenses.forEach(e => {
          const cat = expenseBreakdown[e.category] !== undefined ? e.category : 'other';
          expenseBreakdown[cat] += e.amount || 0;
        });

        const totalExpenses = Object.values(expenseBreakdown).reduce((a, b) => a + b, 0);
        const netProfitOrLoss = totalMilkIncome - totalExpenses;

        // Feed cost per litre of milk produced
        const totalMilkProducedLitres = db.milkProduction.reduce((sum, m) => sum + (m.totalLitres || 0), 0);
        const feedCostPerLitre = totalMilkProducedLitres > 0
          ? Number((expenseBreakdown.feed / totalMilkProducedLitres).toFixed(2))
          : 0;

        return sendJSON(res, 200, {
          success: true,
          reportPeriod: 'Current Month to Date',
          revenue: {
            milkSoldLitres: Number(totalMilkSoldLitres.toFixed(1)),
            totalMilkIncome: Number(totalMilkIncome.toFixed(2))
          },
          expenses: expenseBreakdown,
          totalExpenses: Number(totalExpenses.toFixed(2)),
          netOperatingProfit: Number(netProfitOrLoss.toFixed(2)),
          metrics: {
            totalMilkProducedLitres: Number(totalMilkProducedLitres.toFixed(1)),
            feedCostPerLitre: feedCostPerLitre
          }
        });
      }

      // 11. Settings & Master Categories
      if (pathname === '/api/erp/settings' && method === 'GET') {
        return sendJSON(res, 200, {
          success: true,
          users: db.erpUsers.map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role, title: u.title })),
          masterSettings: db.masterSettings
        });
      }

      if (pathname === '/api/erp/settings' && method === 'PUT') {
        const body = await parseBody(req);
        if (body.masterSettings) {
          db.masterSettings = { ...db.masterSettings, ...body.masterSettings };
        }
        saveData();
        return sendJSON(res, 200, { success: true, message: 'Farm settings updated successfully.', masterSettings: db.masterSettings });
      }

      // 12. Backup & Restore Data
      if (pathname === '/api/erp/backup' && method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': 'attachment; filename="amrit_dairy_backup.json"'
        });
        return res.end(JSON.stringify(db, null, 2));
      }

      // ---------------------------------------------------------
      // SECTION B: PUBLIC & CONSUMER DELIVERY API (Preserved)
      // ---------------------------------------------------------
      if (pathname === '/api/health' && method === 'GET') {
        return sendJSON(res, 200, { status: 'ok', farm: db.farmConfig.name, timestamp: new Date().toISOString() });
      }

      if (pathname === '/api/config' && method === 'GET') {
        return sendJSON(res, 200, { farmConfig: db.farmConfig, serviceAreas: db.serviceAreas });
      }

      if (pathname === '/api/pincodes/check' && method === 'GET') {
        const pin = (parsedUrl.query.pincode || '').trim();
        const found = db.serviceAreas.find(s => s.pincode === pin && s.active);
        if (found) {
          return sendJSON(res, 200, { deliverable: true, pincode: found.pincode, locality: found.locality, morningTime: found.morningTime });
        }
        return sendJSON(res, 200, { deliverable: false, pincode: pin, message: 'Outside current morning run' });
      }

      if (pathname === '/api/products' && method === 'GET') {
        return sendJSON(res, 200, { success: true, count: db.products.length, products: db.products });
      }

      if (pathname === '/api/customer/wallet' && method === 'GET') {
        return sendJSON(res, 200, { success: true, balance: 1240.0, transactions: db.walletTransactions });
      }

      if (pathname === '/api/subscriptions' && method === 'GET') {
        return sendJSON(res, 200, { success: true, subscriptions: db.subscriptions });
      }

      if (pathname === '/api/delivery/daily-run' && method === 'GET') {
        return sendJSON(res, 200, { success: true, orders: db.orders, deliveredCount: 2, totalStops: 3 });
      }

      return sendJSON(res, 404, { success: false, message: 'Endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // -------------------------------------------------------------
  // STATIC ASSET SERVING
  // -------------------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        return res.end('Error: ' + readErr.message);
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`================================================================`);
  console.log(`🐄 AMRIT DAIRY FARM ERP & WEB RUNNING AT http://localhost:${PORT}`);
  console.log(`📋 Farm ERP Management System: http://localhost:${PORT}`);
  console.log(`================================================================`);
});
