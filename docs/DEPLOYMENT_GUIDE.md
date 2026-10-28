# Amrit Dairy Farms - Complete Deployment & Operations Guide

This guide covers end-to-end production deployment for the **Web Platform**, **Node.js REST API**, **PostgreSQL / Supabase Database**, and **iOS / Android Mobile Applications**.

---

## 1. Architecture Overview

```
                      ┌─────────────────────────────────┐
                      │    Cloudflare / Route 53 DNS    │
                      └────────────────┬────────────────┘
                                       │
                      ┌────────────────▼────────────────┐
                      │    Nginx / Vercel Reverse Proxy  │
                      └───────┬─────────────────┬───────┘
                              │                 │
              Static Assets & │                 │ API Requests
              Public Website  │                 │
                              ▼                 ▼
                     ┌────────────────┐ ┌────────────────┐
                     │  Web Frontend  │ │ Node.js Express│
                     │  (PWA / React) │ │ REST API Engine│
                     └────────────────┘ └───┬──────┬─────┘
                                            │      │
                         ┌──────────────────┘      └──────────────────┐
                         ▼                                            ▼
               ┌──────────────────┐                         ┌──────────────────┐
               │ PostgreSQL /     │                         │ External Gateways│
               │ Supabase DB      │                         │ • Razorpay (UPI) │
               │ (Schema & RLS)   │                         │ • Fast2SMS / OTP │
               └──────────────────┘                         └──────────────────┘
```

---

## 2. Option A: Cloud Deployment (Vercel + Supabase)

### Step 1: Provision Supabase Database
1. Sign up at [supabase.com](https://supabase.com) and create a new project (e.g. `amrit-dairy-prod`).
2. Select your closest AWS region (e.g., `ap-south-1` Mumbai).
3. Open the **SQL Editor** in the Supabase Dashboard.
4. Execute `database/schema.sql` to establish tables, constraints, and indexes.
5. Execute `database/triggers_and_rls.sql` to apply Row Level Security and stock/calving triggers.
6. Execute `database/seeds.sql` to populate initial products, service areas, and breeds.
7. Note down your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from **Project Settings → API**.

### Step 2: Deploy Backend & Web Frontend on Vercel
1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Link your repository:
   ```bash
   vercel
   ```
3. Set environment variables in Vercel Dashboard:
   - `PORT`: `3000`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-anon-key`
   - `RAZORPAY_KEY_ID`: `rzp_live_...`
   - `RAZORPAY_KEY_SECRET`: `...`
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 3. Option B: Self-Hosted Ubuntu VPS with Docker & Nginx

### Prerequisites
- Ubuntu 22.04 LTS or 24.04 LTS server (2 vCPU, 4GB RAM minimum).
- Domain pointing to your VPS IP (`amritdairy.com` and `api.amritdairy.com`).

### Step 1: Server Setup & Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git nginx certbot python3-certbot-nginx postgresql postgresql-contrib
sudo npm install -g pm2
```

### Step 2: Clone & Configure Application
```bash
cd /var/www
git clone https://github.com/your-username/amrit-dairy.git
cd amrit-dairy

# Configure environment variables
cat <<EOF > .env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://amrit_user:StrongPassword@localhost:5432/amrit_dairy
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
FAST2SMS_API_KEY=xxx
EOF
```

### Step 3: Run Database Migrations
```bash
sudo -u postgres psql -c "CREATE DATABASE amrit_dairy;"
sudo -u postgres psql -c "CREATE USER amrit_user WITH ENCRYPTED PASSWORD 'StrongPassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE amrit_dairy TO amrit_user;"

# Run migrations
psql -U amrit_user -d amrit_dairy -f database/schema.sql
psql -U amrit_user -d amrit_dairy -f database/triggers_and_rls.sql
psql -U amrit_user -d amrit_dairy -f database/seeds.sql
```

### Step 4: Process Management with PM2
```bash
# Start backend service
pm2 start backend/server.js --name "amrit-dairy-api" -i max
pm2 save
pm2 startup
```

### Step 5: Configure Nginx & SSL
Create `/etc/nginx/sites-available/amritdairy.conf`:
```nginx
server {
    server_name amritdairy.com www.amritdairy.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and acquire free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/amritdairy.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d amritdairy.com -d www.amritdairy.com
```

---

## 4. Payment Gateway Setup (Razorpay & UPI)

1. Create a business account at [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Activate **UPI Instant Collection**, **Debit Cards**, and **NetBanking**.
3. Generate **API Key ID** and **Key Secret** under **Settings → API Keys**.
4. Set Webhook URL to: `https://amritdairy.com/api/payments/razorpay-webhook`.
5. Secret token events to enable:
   - `payment.captured`
   - `order.paid`
   - `refund.processed`

---

## 5. Mobile App Compilation & Release

### Flutter (Android AAB & iOS IPA)
```bash
cd mobile-flutter

# Install Flutter dependencies
flutter pub get

# 1. Build Android App Bundle (AAB) for Google Play Store
flutter build appbundle --release

# Output path: build/app/outputs/bundle/release/app-release.aab

# 2. Build iOS Archive for TestFlight / Apple App Store
flutter build ipa --release
```

### React Native (Expo EAS)
```bash
cd mobile-react-native

# Install EAS CLI
npm install -g eas-cli
eas login

# Configure credentials
eas build:configure

# Build Android APK / AAB
eas build --platform android --profile production

# Build iOS IPA
eas build --platform ios --profile production
```

---

## 6. Backup & Health Monitoring
- Daily PostgreSQL database backup cron job:
  ```bash
  0 2 * * * pg_dump -U amrit_user amrit_dairy | gzip > /var/backups/dairy_$(date +\%F).sql.gz
  ```
- Application logs can be inspected anytime via:
  ```bash
  pm2 logs amrit-dairy-api
  ```
