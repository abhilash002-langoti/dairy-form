# CowCare — Beginner's Step-by-Step FlutterFlow & Firebase Guide

Welcome to **CowCare**! This guide is written specifically for beginners. Follow these exact steps to connect Firebase and design the CowCare app in FlutterFlow.

---

## 1. Firebase Project Setup (5 minutes)

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **"Add project"** (or "Create a project").
3. Name your project: `cowcare-dairy` (or any name you prefer), then click **Continue**.
4. Disable Google Analytics (optional, to keep it simple) and click **Create Project**.
5. When ready, click **Continue**.

### A. Enable Firebase Authentication
1. On the left sidebar, click **Build** → **Authentication**.
2. Click **Get Started**.
3. Under "Sign-in method", click **Email/Password**.
4. Switch **Enable** to **ON** and click **Save**.

### B. Create Cloud Firestore Database
1. On the left sidebar, click **Build** → **Firestore Database**.
2. Click **Create Database**.
3. Choose your database location (e.g. `asia-south1 (Mumbai)` for India).
4. Select **Start in production mode** and click **Create**.
5. Once created, click the **Rules** tab at the top.
6. Copy and paste the contents of `firebase/firestore.rules` from this repository.
7. Click **Publish**.

### C. Create Firebase Storage (for Cow Photos)
1. On the left sidebar, click **Build** → **Storage**.
2. Click **Get Started**, choose **Production mode**, and click **Done**.
3. In the **Rules** tab, paste the contents of `firebase/storage.rules` from this repository.
4. Click **Publish**.

---

## 2. FlutterFlow Project Setup (Where to click)

1. Open [https://app.flutterflow.io/](https://app.flutterflow.io/) and log in.
2. Click **+ Create New** on the dashboard.
3. Project Name: `CowCare`. Select **Blank App** and click **Create New**.

### Connecting Firebase to FlutterFlow
1. In FlutterFlow, click the **Settings & Integrations** gear icon (⚙️) on the bottom left sidebar.
2. Under "Project Setup", click **Firebase**.
3. In the **Firebase Project ID** box, paste your Firebase Project ID (found in Firebase Console → Project Settings ⚙️).
4. Click **Connect**.
5. Follow the prompt to grant FlutterFlow service account permissions:
   - Copy the email address shown: `firebase@flutterflow.io`.
   - In Firebase Console → **Project Settings** → **Users and permissions** → **Add member**, paste `firebase@flutterflow.io` with role **Editor**.
   - Back in FlutterFlow, click **Verify** and then **Generate Config Files**.

### Setting Up Authentication
1. In FlutterFlow Settings (⚙️) → **Authentication**:
   - Turn **Enable Authentication** to **ON**.
   - Authentication Type: **Firebase**.
   - Initial Page (Logged In): `DashboardPage`.
   - Entry Page (Logged Out): `LoginPage`.

---

## 3. Creating the Database Collections

In FlutterFlow, click **Firestore** (the database icon on the left sidebar):

1. Click **+ Add Collection**:
   - Collection Name: `cows`
   - Fields:
     - `tagId` (String)
     - `name` (String)
     - `breed` (String)
     - `dob` (DateTime)
     - `gender` (String)
     - `status` (String) — e.g. "active", "dry", "pregnant", "sick", "sold"
     - `purchaseDate` (DateTime)
     - `purchaseCost` (Double)
     - `photoUrl` (ImagePath)
     - `notes` (String)
     - `farmId` (String)
     - `createdAt` (DateTime)
     - `updatedAt` (DateTime)

2. Click **+ Add Collection**:
   - Collection Name: `milk_records`
   - Fields:
     - `farmId` (String)
     - `cowId` (String)
     - `cowTag` (String)
     - `date` (String, format YYYY-MM-DD)
     - `session` (String, "morning" or "evening")
     - `quantityLitres` (Double)
     - `fatContent` (Double)
     - `notes` (String)
     - `recordedBy` (String)
     - `createdAt` (DateTime)

3. Click **+ Add Collection**:
   - Collection Name: `farms`
   - Fields: `name` (String), `ownerUid` (String), `phone` (String), `village` (String), `district` (String), `state` (String).

---

## 4. Building the Screens (Visual Layout)

### Screen 1: `LoginPage` & `RegisterPage`
- **Widgets**:
  - Container with background color `#FAF7F2` (Cream).
  - App Logo & Title: "CowCare — ಹೈನುಗಾರಿಕೆ ನಿರ್ವಹಣೆ".
  - TextFields: Email, Password.
  - Buttons: "Sign In" (Primary Green `#1B4D3E`), "Register Farm", "Forgot Password".
- **Actions on Button Click**:
  - Call **Firebase Auth: Log In** with Email & Password.
  - Navigate to `DashboardPage`.

### Screen 2: `DashboardPage`
- **Theme**: Farm Green header `#1B4D3E` with white text.
- **Top Row KPI Cards**:
  - Total Active Cows (Count of cows where `status == 'active'`).
  - Today's Milk (Sum of today's morning + evening litres).
  - Milk Sales (₹).
  - Reminders Badge.
- **Quick Action Floating Buttons**:
  - ➕ "Add Cow"
  - 🥛 "Record Milk"
  - 💰 "Add Expense"
- **Lists / Charts**:
  - Today's Milking Status (Morning vs. Evening).
  - Recent Alerts (Vaccination due dates).

### Screen 3: `CowListPage` & `AddCowPage`
- **Cow List**:
  - Search bar to search by Cow Tag or Name.
  - Filter chips: All, Active, Pregnant, Dry, Sick.
  - Card for each cow displaying: Photo, Tag ID, Name, Breed, Status badge.
  - Tap card → Navigate to `CowDetailPage`.
- **Add / Edit Cow**:
  - TextFields: Tag ID (e.g. COW-101), Cow Name (e.g. Ganga).
  - Dropdown: Breed (Gir, Sahiwal, HF Cross, Jersey, Hallikar, Murrah Buffalo).
  - Dropdown: Status (Active, Dry, Pregnant, Sick, Sold).
  - NumberField: Purchase Cost (₹).
  - Upload Media Widget: Upload photo to Firebase Storage.

### Screen 4: `MilkRecordPage`
- **Fields**:
  - Date Picker (Defaults to Today).
  - Cow Dropdown (Populated from active cows).
  - Session Toggle: Morning (🌅) or Evening (🌙).
  - Quantity TextField: Numbers only (validation: must be > 0).
  - Fat % (Optional).
  - Notes TextField.
- **Actions**:
  - Before saving, call Custom Action `checkDuplicateMilk`.
  - If duplicate exists, show an Alert Dialog: *"A record already exists for this cow on this date and session!"*.
  - Otherwise, create document in `milk_records`.

---

## 5. Adding Custom Actions in FlutterFlow

1. In FlutterFlow, click **Custom Code** (icon with `</>`) on the left.
2. Click **+ Add Custom Action**.
3. Action Name: `checkDuplicateMilk`.
4. Copy and paste the code from `flutterflow/custom_actions/check_duplicate_milk.dart`.
5. Add another action: `calculateMilkTotals` from `flutterflow/custom_actions/calculate_milk_totals.dart`.
6. Click **Check Errors** and **Save**.
