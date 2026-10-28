# 🥛 Amrit Dairy Farms - Complete Website, Mobile App & Farm Management Platform

A modern, responsive, end-to-end direct-to-customer (D2C) dairy farm platform providing:
1. **Public Website:** Organic farm story, cattle care, product catalog, subscription plans, interactive PIN code checker, testimonials, FAQ, SEO blog, WhatsApp support.
2. **Customer App (iOS, Android & PWA):** Phone OTP login, 14-day vacation pause/skip calendar, prepaid dairy wallet with instant recharge & passbook, live 4-stage morning delivery tracker, ratings & complaint tickets, referral bonuses & coupons.
3. **Delivery Partner App:** Morning & evening route run manifests, 1-tap "Mark Delivered", "Door Locked", UPI QR code payments, returnable glass bottle/can collector.
4. **Admin Dashboard:** Real-time milk production vs orders vs surplus reconciliation, revenue metrics, product stock manager, route planning, CSV/Excel report exports.
5. **Farm Management Module:** Cattle inventory with RFID ear tags, breeds (Gir, Sahiwal, Murrah Buffalo), lactation numbers, morning/evening milk yield logger with Fat % & SNF %, feed inventory alerts, breeding and expected calving calendar.
6. **Native Mobile App Projects:** Complete Flutter project (`mobile-flutter/`) and React Native Expo project (`mobile-react-native/`).
7. **Database Schemas:** Complete PostgreSQL / Supabase SQL schema migrations (`database/schema.sql`), triggers and RLS policies (`database/triggers_and_rls.sql`), and Indian dairy seed data (`database/seeds.sql`).
8. **Deliverables Documentation:** Complete REST API documentation (`docs/API_DOCUMENTATION.md`), OpenAPI 3.0 specification (`docs/openapi.yaml`), Step-by-step deployment guide (`docs/DEPLOYMENT_GUIDE.md`), Admin manual (`docs/ADMIN_MANUAL.md`), and Customer & Driver manual (`docs/CUSTOMER_MANUAL.md`).

---

## 🚀 Quick Start (Zero External Dependencies)

The backend server is built with pure Node.js (utilizing standard built-in modules) and requires **zero external npm package downloads** to run!

```bash
# Start the full-stack platform server:
.\node.bat backend/server.js
# Or on standard Node environments:
node backend/server.js
```

Once started, open your browser:
- 🌐 **Public Website & Customer App:** [http://localhost:3000](http://localhost:3000)
- 📱 **Customer App Portal:** [http://localhost:3000/#customer](http://localhost:3000/#customer)
- 🚚 **Delivery Partner Console:** [http://localhost:3000/#delivery](http://localhost:3000/#delivery)
- 📊 **Admin Executive Dashboard:** [http://localhost:3000/#admin](http://localhost:3000/#admin)
- 🐄 **Farm Cattle Management:** [http://localhost:3000/#farm](http://localhost:3000/#farm)

---

## 📁 Repository Structure

```
D:\cow\
├── backend/
│   ├── server.js               # REST API & static file server
│   └── data/
│       ├── initialData.js      # Indian dairy seed data & configs
│       └── store.json          # Persistent state store
├── public/
│   ├── index.html              # Multi-app single-page interface
│   ├── css/
│   │   └── styles.css          # Clean pasture green & dairy blue design
│   ├── js/
│   │   ├── app.js              # State manager, cart, checkout, calendar & logger
│   │   └── i18n.js             # English, Hindi (हिंदी), Kannada (ಕನ್ನಡ)
│   └── manifest.json           # PWA Progressive Web App manifest
├── mobile-flutter/             # Flutter Mobile App (iOS & Android)
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart
│       ├── models/
│       ├── screens/
│       └── services/
├── mobile-react-native/        # React Native / Expo Mobile App
│   ├── package.json
│   ├── App.tsx
│   └── src/
├── database/
│   ├── schema.sql              # Complete PostgreSQL / Supabase schema
│   ├── triggers_and_rls.sql    # RLS policies & automatic triggers
│   └── seeds.sql               # Bangalore PIN codes, products, cows & feeds
├── docs/
│   ├── API_DOCUMENTATION.md    # Complete REST API reference
│   ├── openapi.yaml            # OpenAPI 3.0 specification
│   ├── DEPLOYMENT_GUIDE.md     # Production deployment (Vercel, Supabase, VPS)
│   ├── ADMIN_MANUAL.md         # Farm Owner & Admin operational guide
│   └── CUSTOMER_MANUAL.md      # Customer & Delivery Partner guide
├── node.bat                    # Local Node runner wrapper
└── package.json                # Project scripts
```

---

## 📋 Implementation Status

| Module | Status | Verification |
|---|---|---|
| Database schema and migrations | ✅ Completed | `database/schema.sql` (22 relational tables with indexes & constraints) |
| RLS and storage policies | ✅ Completed | `database/triggers_and_rls.sql` (Row level security & stock triggers) |
| REST API Engine | ✅ Completed | `backend/server.js` (Pure Node.js, 18 endpoints, JSON persistence) |
| Public Website | ✅ Completed | Hero banner, products, subscriptions, PIN code checker, FAQ, SEO blog |
| Multi-language Support | ✅ Completed | Toggle between English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ) |
| Customer Mobile Portal (PWA) | ✅ Completed | OTP login, 14-day pause/skip calendar, wallet recharge, live tracker |
| Delivery Partner App | ✅ Completed | Route A/B manifests, mark delivered, collect UPI QR, glass bottle returns |
| Admin Panel | ✅ Completed | KPI dashboard, route assignments, expense log, CSV/Excel report exports |
| Farm Management Module | ✅ Completed | Cattle registry, morning/evening milk yield logger, feed stock alerts |
| Flutter Mobile App | ✅ Completed | `mobile-flutter/` ready for iOS & Android build |
| React Native Mobile App | ✅ Completed | `mobile-react-native/` ready for Expo & native build |
| OpenAPI 3.0 Spec & API Docs | ✅ Completed | `docs/openapi.yaml` & `docs/API_DOCUMENTATION.md` |
| Step-by-Step Deployment Guide | ✅ Completed | `docs/DEPLOYMENT_GUIDE.md` (Vercel, Supabase, VPS, Razorpay, SMS) |
| Admin & User Manuals | ✅ Completed | `docs/ADMIN_MANUAL.md` & `docs/CUSTOMER_MANUAL.md` |

---

## 🥛 Products Included

1. **Pure A2 Desi Gir Cow Milk:** Raw/cold-pasteurized in chilled returnable glass bottles (₹80/L).
2. **Creamy Murrah Buffalo Milk:** High-fat whole milk for thick curd and traditional sweets (₹88/L).
3. **Vedic Bilona Desi Ghee:** Handcrafted using wooden churners from cultured A2 curd (₹1,350/500ml).
4. **Farm-Fresh Malai Paneer:** Spongy, melt-in-mouth cottage cheese made fresh daily (₹125/200g).
5. **Thick Natural Set Curd (Dahi):** Probiotic-rich curd naturally cultured in clay containers (₹50/500g).
6. **Traditional Desi Makkhan (White Butter):** Unsalted, fragrant white butter churned from cultured malai (₹170/250g).
7. **Spiced Farm Buttermilk (Chaas):** Chilled buttermilk with roasted cumin, curry leaves, ginger & rock salt (₹25/300ml).

---

## 🔒 Security & Quality Standards
- **Zero Adulteration:** Daily batch testing for Fat %, SNF %, acidity, and adulterants.
- **Cold Chain Integrity:** Rapid chilling to 4°C within 15 minutes of milking; dispatched in insulated carriers before 5:30 AM.
- **Eco-Friendly:** Returnable sterilized glass bottles to eliminate microplastics and plastic pouch pollution.
