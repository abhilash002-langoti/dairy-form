-- ============================================================================
-- AMRIT DAIRY FARMS - COMPLETE POSTGRESQL / SUPABASE PRODUCTION DATABASE SCHEMA
-- Compatible with PostgreSQL 14+, Supabase, and AWS Aurora RDS
-- Includes Farm ERP (Cows, Milk Yields, Medicines, Withdrawal Periods, Feeds, Expenses)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ERP USERS (Admin / Farm Owner vs Staff / Worker)
CREATE TABLE IF NOT EXISTS erp_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(80) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'veterinarian')),
    title VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_erp_users_username ON erp_users(username);
CREATE INDEX IF NOT EXISTS idx_erp_users_role ON erp_users(role);

-- 2. FARM PROFILE & SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL DEFAULT 'Amrit Dairy Farms',
    tagline VARCHAR(255) DEFAULT 'Pure, Organic & Farm-Fresh Milk to Your Doorstep',
    fssai_license_no VARCHAR(50) DEFAULT '11223344556677',
    contact_phone VARCHAR(20) NOT NULL DEFAULT '+91 98765 43210',
    contact_email VARCHAR(100) DEFAULT 'care@amritdairy.com',
    address TEXT NOT NULL DEFAULT 'Survey No. 42, Green Pastures Road, Nelamangala',
    city VARCHAR(100) NOT NULL DEFAULT 'Bangalore',
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    pincode VARCHAR(10) NOT NULL DEFAULT '562123',
    milk_sale_rate_per_litre NUMERIC(6,2) NOT NULL DEFAULT 65.00,
    retail_rate_per_litre NUMERIC(6,2) NOT NULL DEFAULT 80.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COW MASTER RECORD (Master registry of cattle)
CREATE TABLE IF NOT EXISTS cows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(80) NOT NULL CHECK (breed IN ('Gir (Vedic Desi)', 'Sahiwal (Punjab Indigenous)', 'Red Sindhi', 'Murrah Buffalo', 'HF Cross (Holstein)', 'Jersey Cross', 'Tharparkar')),
    animal_type VARCHAR(30) NOT NULL DEFAULT 'Cow' CHECK (animal_type IN ('Cow', 'Buffalo', 'Calf', 'Bull')),
    status VARCHAR(30) NOT NULL DEFAULT 'milking' CHECK (status IN ('milking', 'dry', 'pregnant', 'sick', 'quarantined', 'archived')),
    date_of_birth DATE,
    age_years NUMERIC(4,1),
    purchase_date DATE,
    purchase_price NUMERIC(10,2) DEFAULT 0.00,
    calving_date DATE,
    expected_calving_date DATE,
    lactation_number INTEGER NOT NULL DEFAULT 1,
    daily_avg_yield_litres NUMERIC(5,2) DEFAULT 12.0,
    weight_kg NUMERIC(6,2),
    photo_url TEXT,
    health_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cows_tag ON cows(tag_number);
CREATE INDEX IF NOT EXISTS idx_cows_status ON cows(status);
CREATE INDEX IF NOT EXISTS idx_cows_breed ON cows(breed);

-- 4. DAILY MILK PRODUCTION RECORDS (Morning, Evening, Total, Fat %, SNF %, Kept vs Sold)
CREATE TABLE IF NOT EXISTS milk_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    production_date DATE NOT NULL DEFAULT CURRENT_DATE,
    morning_litres NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (morning_litres >= 0),
    evening_litres NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (evening_litres >= 0),
    total_litres NUMERIC(6,2) GENERATED ALWAYS AS (morning_litres + evening_litres) STORED,
    fat_percentage NUMERIC(4,2),
    snf_percentage NUMERIC(4,2),
    milk_sold_litres NUMERIC(6,2) DEFAULT 0 CHECK (milk_sold_litres >= 0),
    milk_kept_litres NUMERIC(6,2) DEFAULT 0 CHECK (milk_kept_litres >= 0),
    rate_per_litre NUMERIC(6,2) DEFAULT 65.00,
    recorded_by UUID REFERENCES erp_users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cow_id, production_date)
);

CREATE INDEX IF NOT EXISTS idx_milk_date ON milk_production(production_date);
CREATE INDEX IF NOT EXISTS idx_milk_cow ON milk_production(cow_id);

-- 5. MEDICINES INVENTORY
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(60) NOT NULL CHECK (type IN ('antibiotic', 'vitamin', 'deworming', 'vaccine', 'antiseptic', 'anti_inflammatory')),
    quantity_in_stock NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    unit VARCHAR(30) NOT NULL DEFAULT 'vials',
    min_alert_level NUMERIC(8,2) NOT NULL DEFAULT 2,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    supplier VARCHAR(150),
    withdrawal_days INTEGER NOT NULL DEFAULT 0 CHECK (withdrawal_days >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medicines_expiry ON medicines(expiry_date);
CREATE INDEX IF NOT EXISTS idx_medicines_type ON medicines(type);

-- 6. VETERINARY TREATMENTS & WITHDRAWAL PERIOD TRACKER
CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    illness VARCHAR(200) NOT NULL,
    medicine_id UUID REFERENCES medicines(id) ON DELETE SET NULL,
    medicine_name VARCHAR(200) NOT NULL,
    dose VARCHAR(100) NOT NULL,
    treatment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    veterinarian_name VARCHAR(150) NOT NULL,
    cost NUMERIC(10,2) DEFAULT 0.00,
    withdrawal_days INTEGER NOT NULL DEFAULT 0,
    withdrawal_end_date DATE,
    is_withdrawal_active BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_treatments_cow ON treatments(cow_id);
CREATE INDEX IF NOT EXISTS idx_treatments_withdrawal ON treatments(is_withdrawal_active, withdrawal_end_date);

-- 7. VACCINATION SCHEDULE & REMINDERS
CREATE TABLE IF NOT EXISTS vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cow_id UUID NOT NULL REFERENCES cows(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL,
    date_administered DATE NOT NULL,
    next_due_date DATE NOT NULL,
    veterinarian_name VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'due_soon', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vaccinations_due ON vaccinations(next_due_date);

-- 8. COW FEED INVENTORY
CREATE TABLE IF NOT EXISTS feed_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(60) NOT NULL CHECK (category IN ('green_fodder', 'dry_fodder', 'concentrate', 'minerals_supplements', 'silage')),
    stock_quantity_kg NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (stock_quantity_kg >= 0),
    minimum_alert_kg NUMERIC(10,2) NOT NULL DEFAULT 200,
    price_per_kg NUMERIC(8,2) NOT NULL DEFAULT 5.00 CHECK (price_per_kg >= 0),
    supplier VARCHAR(150),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. DAILY FEEDING RATIONS (Cost per day & Cost per litre calculation)
CREATE TABLE IF NOT EXISTS feeding_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feeding_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_cattle VARCHAR(150) NOT NULL, -- e.g. 'All Lactating Cows' or 'AMR-001'
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
    quantity_kg NUMERIC(10,2) NOT NULL CHECK (quantity_kg > 0),
    cost_per_kg NUMERIC(8,2) NOT NULL,
    total_cost NUMERIC(10,2) NOT NULL,
    recorded_by UUID REFERENCES erp_users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feeding_logs_date ON feeding_logs(feeding_date);

-- 10. EXPENSES & FINANCIAL AUDITING (Admin Only)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(60) NOT NULL CHECK (category IN ('feed', 'medicine', 'labour', 'electricity', 'other')),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    payee VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    payment_mode VARCHAR(40) DEFAULT 'Cash',
    receipt_reference VARCHAR(100),
    created_by UUID REFERENCES erp_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
