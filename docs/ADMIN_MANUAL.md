# Amrit Dairy Farm - Complete Management System Manual

Welcome to the **Amrit Dairy Farm ERP Operations & Administrator Manual**. This guide covers daily workflows for Farm Owners (Admins) and Farm Workers (Staff).

---

## 1. System Roles & Access Control

The platform enforces Role-Based Access Control (RBAC):

| Capability / Section | Farm Owner (Admin) | Farm Worker (Staff) |
|---|---|---|
| **Login with Password / OTP** | Yes (`admin` / `admin123`) | Yes (`staff` / `staff123`) |
| **View Dashboard & Quick Links** | Yes | Yes |
| **Add Daily Milk Production Logs** | Yes | Yes |
| **Add Veterinary Treatments & Meds** | Yes | Yes |
| **Record Daily Feed Rations** | Yes | Yes |
| **Delete Cow Records** | Yes | ❌ Blocked |
| **View Financial Expenses** | Yes | ❌ Blocked (403 Forbidden) |
| **View Monthly Profit & Loss Statement** | Yes | ❌ Blocked (403 Forbidden) |
| **Manage Users & Download Backups** | Yes | ❌ Blocked |

### Session Timeout
- A 30-minute idle session timeout operates continuously.
- The remaining time is visible in the top header tag (`⏱️ 30:00`).
- Any user interaction resets the counter. Inactivity automatically logs the user out to protect farm records.

---

## 2. Dashboard

The executive dashboard provides an instant overview of daily farm productivity:
- **Today's Total Milk:** Morning yield (4:30 AM) + Evening yield (4:30 PM).
- **Cattle Status Counters:** Total Herd, Cows in Milk, Dry Period, Pregnant, and Sick / Under Treatment.
- **Active Antibiotic Withdrawal Alert:** Critical safety banner highlighting any cow under antibiotic treatment with the exact date until which its milk **must not be sold**.
- **Low-Stock Alerts:** Automatically flags feed items (e.g. Concentrate Pellets under 200 kg) or medicines.
- **Upcoming Vaccinations:** Lists cows with boosters due within the next 30 days.
- **Today's Expenses:** Real-time tally of recorded operational costs.

---

## 3. Cow Master Record

Navigate to **🐄 Cows** (`#cows`):
- Master inventory showing **Ear Tag ID**, **Pet Name**, **Breed**, **Status Pill**, **Age & DOB**, **Lactation & Calving Dates**, and **Daily Average Yield**.
- **Search & Filters:** Search by tag number or filter by status (`milking`, `dry`, `pregnant`, `sick`).
- **360° Cow History Modal:** Click **📋 Full History** on any cow to see:
  1. Complete historical milk yields table.
  2. Veterinary illness & treatment logs.
  3. Vaccination history.
  4. Gestation / pregnancy check dates.
- Click **+ Add New Cow** to register incoming heifers or purchased cattle.

---

## 4. Milk Production List

Navigate to **🥛 Milk Production** (`#milk`):
- **Daily Entry Form:** Record morning litres, evening litres, Fat %, SNF %, milk sold, milk kept (for calves & staff), and rate per litre.
- **Filters:** Filter records by Date or specific Cow.
- **Interactive Production Graph:** Visualizes 7-day whole-farm output trends in litres.
- **Sales Reconciliation:**
  $$\text{Milk Revenue} = \text{Milk Sold Litres} \times \text{Rate per Litre}$$
- Click **📥 Export CSV/Excel** for veterinary and accounting records.

---

## 5. Medicine & Veterinary Care (Withdrawal Tracker)

Navigate to **💊 Medicine** (`#medicine`):
- **Medicine Inventory:** Name, type (`antibiotic`, `vitamin`, `deworming`, `vaccine`), stock quantity, purchase & expiry dates, price, and supplier.
- **Antibiotic Withdrawal Period Tracker:** When logging an antibiotic (e.g., Amoxicillin LA 4 days):
  1. System automatically sets `withdrawal_end_date`.
  2. Flags the cow's status to **Sick / Under Treatment**.
  3. Displays a persistent red alert across the dashboard and milk logging pages warning workers **not to mix this cow's milk with sales batches**.
- **Vaccination Reminders:** Schedules due dates for FMD, HS, BQ, and Brucellosis.

---

## 6. Cow Feed & Rations (Cost per Litre)

Navigate to **🌾 Cow Feed** (`#feed`):
- **Inventory:** Green fodder (Napier & Sorghum), dry wheat straw (bhusa), concentrate pellets (22% crude protein), oil cake, chelated mineral mixture, and corn silage.
- **Daily Rations:** Log feed distributed to lactating cows, dry cows, or individual animals. Stock quantity is automatically deducted.
- **Feed Cost Efficiency Metric:**
  $$\text{Feed Cost per Litre of Milk} = \frac{\text{Today's Total Feed Expense}}{\text{Today's Total Milk Yield (Litres)}}$$
  *(e.g., ₹1,897.50 feed cost ÷ 74.0 Litres = **₹25.64 per Litre**).*

---

## 7. Expenses & Profit / Loss Statement (Admin Only)

Navigate to **💰 Expenses** (`#expenses`) and **📈 Reports** (`#reports`):
- **Expense Categories:** Feed, Medicine, Labour, Electricity & Cold Chiller, and Maintenance.
- **Monthly P&L Report:**
  $$\text{Net Operating Profit / Loss} = \text{Total Milk Income} - \text{Total Operational Expenses}$$
- View percentage breakdown per category to optimize operational margins.

---

## 8. Settings, Taxonomies & Data Backup

Navigate to **⚙️ Settings** (`#settings`):
- **User Management:** View Admin and Staff roles and access rights.
- **Taxonomies:** Configure master cattle breeds, feed items, and medicine types.
- **Language Switcher:** Toggle between English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ).
- **One-Click Backup:** Click **📥 Download Backup (JSON)** to save the complete database state to your computer anytime.
