# Amrit Dairy Farms - RESTful API Documentation

Version: 1.0.0  
Base URL: `http://localhost:3000/api` (or `https://your-domain.com/api`)  
Content-Type: `application/json`

---

## Overview

The Amrit Dairy Farms API powers the public website, customer mobile apps (iOS & Android), delivery partner mobile console, admin panel, and on-farm cattle yield management.

All responses are formatted in JSON. Timestamps follow ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).

---

## 1. System & Health

### `GET /api/health`
Checks server uptime, health status, and active farm entity.

**Response:**
```json
{
  "status": "ok",
  "farm": "Amrit Dairy Farms",
  "timestamp": "2026-10-28T18:22:24.220Z",
  "uptime": 128.4
}
```

### `GET /api/config`
Retrieves farm branding, operating timings, and serviceable PIN code clusters.

**Response:**
```json
{
  "farmConfig": {
    "name": "Amrit Dairy Farms",
    "fssaiLicense": "11223344556677",
    "contactPhone": "+91 98765 43210",
    "morningSlot": "05:30 AM - 07:30 AM",
    "eveningSlot": "05:30 PM - 07:30 PM"
  },
  "serviceAreas": [
    {
      "pincode": "560034",
      "locality": "Koramangala 1st-8th Block",
      "city": "Bangalore",
      "hub": "South Hub",
      "active": true
    }
  ]
}
```

---

## 2. Serviceable PIN Code Checker

### `GET /api/pincodes/check?pincode=560034`
Validates whether morning doorstep delivery operates in the requested postal area.

**Parameters:**
- `pincode` (query string, required): 6-digit postal code.

**Response (Success):**
```json
{
  "deliverable": true,
  "pincode": "560034",
  "locality": "Koramangala 1st-8th Block",
  "hub": "South Hub",
  "morningTime": "5:30 AM - 6:45 AM",
  "eveningTime": "5:30 PM - 6:30 PM",
  "message": "Delivers to Koramangala 1st-8th Block before 7:00 AM daily!"
}
```

**Response (Not Serviceable):**
```json
{
  "deliverable": false,
  "pincode": "560099",
  "message": "Pincode 560099 is currently outside our immediate morning farm run. We are expanding soon!"
}
```

---

## 3. Product Catalog

### `GET /api/products`
Retrieves active dairy products with multilingual names, pricing, fat/SNF specs, and inventory availability.

**Query Parameters:**
- `category` (optional): Filter by `milk`, `ghee`, `paneer`, `curd`, `butter`, or `beverage`.

**Response:**
```json
{
  "success": true,
  "count": 7,
  "products": [
    {
      "id": "prod-1",
      "sku": "MILK-A2-COW-1L",
      "name": "Pure A2 Desi Gir Cow Milk",
      "name_hi": "शुद्ध ए2 देसी गिर गाय का दूध",
      "name_kn": "ಶುದ್ಧ ಎ2 ದೇಶಿ ಗಿರ್ ಹಸುವಿನ ಹಾಲು",
      "category": "milk",
      "unit": "litre",
      "price": 80,
      "originalPrice": 90,
      "fat": "4.5%",
      "snf": "8.8%",
      "stock": 450,
      "badge": "Bestseller",
      "subscriptionAvailable": true,
      "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80"
    }
  ]
}
```

---

## 4. Authentication (Phone OTP)

### `POST /api/auth/send-otp`
Dispatches a 4-digit authentication code to the user's mobile number.

**Request Body:**
```json
{
  "phone": "+91 98450 12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to +91 98450 12345. For instant demo login, use OTP: 1234",
  "demoOtp": "1234"
}
```

### `POST /api/auth/verify-otp`
Verifies OTP code and yields customer profile and session token.

**Request Body:**
```json
{
  "phone": "+91 98450 12345",
  "otp": "1234",
  "name": "Ananya Sharma",
  "pincode": "560103",
  "address": "Flat 402, Green Glen Layout, Bellandur"
}
```

**Response:**
```json
{
  "success": true,
  "token": "token-cust-1-1730138900",
  "customer": {
    "id": "cust-1",
    "name": "Ananya Sharma",
    "phone": "+91 98450 12345",
    "walletBalance": 1240.0,
    "role": "customer"
  }
}
```

---

## 5. Subscriptions & Calendar Pause/Skip

### `GET /api/subscriptions?customerId=cust-1`
Retrieves customer subscriptions.

**Response:**
```json
{
  "success": true,
  "subscriptions": [
    {
      "id": "sub-101",
      "customerId": "cust-1",
      "productName": "Pure A2 Desi Gir Cow Milk",
      "frequency": "daily",
      "quantity": 1.0,
      "unitPrice": 80,
      "timeSlot": "morning",
      "status": "active",
      "skippedDates": ["2026-10-30"]
    }
  ]
}
```

### `POST /api/subscriptions`
Creates a new daily, alternate-day, or custom-schedule subscription.

**Request Body:**
```json
{
  "customerId": "cust-1",
  "productId": "prod-1",
  "frequency": "daily",
  "quantity": 2.0,
  "timeSlot": "morning",
  "bottlePreference": "glass_bottle",
  "startDate": "2026-10-29"
}
```

### `POST /api/subscriptions/:id/skip-date`
Toggles pause/resume for a specific calendar date (vacation skip).

**Request Body:**
```json
{
  "date": "2026-10-31"
}
```

**Response:**
```json
{
  "success": true,
  "action": "skipped",
  "message": "Delivery paused for 2026-10-31",
  "skippedDates": ["2026-10-30", "2026-10-31"]
}
```

---

## 6. Customer Wallet & Passbook

### `GET /api/customer/wallet?customerId=cust-1`
Returns current wallet balance and chronological transaction logs.

**Response:**
```json
{
  "success": true,
  "balance": 1240.0,
  "transactions": [
    {
      "id": "wtx-1",
      "amount": 1000,
      "type": "recharge",
      "description": "UPI Auto-Recharge (Ref: UPI-98314)",
      "balanceAfter": 1320,
      "date": "2026-10-25T10:30:00+05:30"
    }
  ]
}
```

### `POST /api/customer/wallet/recharge`
Instantly recharges customer wallet with prepaid dairy balance.

**Request Body:**
```json
{
  "customerId": "cust-1",
  "amount": 1000,
  "paymentMethod": "UPI"
}
```

---

## 7. Delivery Partner Run Manifest

### `GET /api/delivery/daily-run?slot=morning&date=2026-10-28`
Returns route sequence stops with customer address and products.

### `PUT /api/delivery/orders/:id/status`
Updates stop delivery status, collects empty glass bottles, and records payments.

**Request Body:**
```json
{
  "status": "delivered",
  "bottlesDelivered": 1,
  "bottlesReturned": 1,
  "notes": "Door step drop, empty bottle collected."
}
```

---

## 8. Farm Management (Cattle, Yield & Feed)

### `GET /api/farm/cows`
Lists all registered farm cattle, RFID ear tags, breeds, and lactation statuses.

### `POST /api/farm/milk-records`
Logs individual cow morning or evening milk yield with lab-tested Fat % and SNF %.

**Request Body:**
```json
{
  "cowId": "cow-1",
  "session": "morning",
  "yieldLitres": 9.5,
  "fat": 4.6,
  "snf": 8.9
}
```

---

## 9. Reports & Exports

### `GET /api/reports/export?type=sales`
Generates and streams a CSV report of orders, customer details, and net revenue.

### `GET /api/reports/export?type=milk`
Generates and streams a CSV report of daily milk yields per cow with Fat % and SNF % metrics.
