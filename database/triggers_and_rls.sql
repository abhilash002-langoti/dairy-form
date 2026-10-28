-- ============================================================================
-- AMRIT DAIRY FARMS - TRIGGERS, VIEWS & ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- 1. AUTOMATIC UPDATED_AT TIMESTAMP FUNCTION
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subscriptions
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_orders
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_wallets
BEFORE UPDATE ON wallets
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 2. GESTATION & EXPECTED CALVING DATE AUTO-CALCULATOR
CREATE OR REPLACE FUNCTION auto_calculate_expected_calving()
RETURNS TRIGGER AS $$
DECLARE
    v_breed VARCHAR(80);
BEGIN
    SELECT breed INTO v_breed FROM cows WHERE id = NEW.cow_id;
    -- Buffalo gestation ~310 days; Desi / Cross Cow gestation ~283 days
    IF NEW.is_confirmed_pregnant = true AND NEW.expected_calving_date IS NULL THEN
        IF v_breed ILIKE '%Buffalo%' THEN
            NEW.expected_calving_date := NEW.insemination_date + INTERVAL '310 days';
        ELSE
            NEW.expected_calving_date := NEW.insemination_date + INTERVAL '283 days';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_calving
BEFORE INSERT OR UPDATE ON breeding_records
FOR EACH ROW
EXECUTE PROCEDURE auto_calculate_expected_calving();

-- 3. FEED INVENTORY STOCK SYNC TRIGGER
CREATE OR REPLACE FUNCTION update_feed_stock_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'purchase' THEN
        UPDATE feed_items 
        SET current_stock_kg = current_stock_kg + NEW.quantity_kg,
            last_restocked_at = NOW()
        WHERE id = NEW.feed_item_id;
    ELSIF NEW.type = 'consumption' OR NEW.type = 'spoilage_adjustment' THEN
        IF (SELECT current_stock_kg FROM feed_items WHERE id = NEW.feed_item_id) < NEW.quantity_kg THEN
            RAISE EXCEPTION 'Insufficient feed stock available for this transaction!';
        END IF;
        UPDATE feed_items 
        SET current_stock_kg = current_stock_kg - NEW.quantity_kg 
        WHERE id = NEW.feed_item_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_feed_stock_sync
AFTER INSERT ON feed_transactions
FOR EACH ROW
EXECUTE PROCEDURE update_feed_stock_balance();

-- 4. DAILY PRODUCTION VS SALES RECONCILIATION VIEW
CREATE OR REPLACE VIEW v_daily_milk_reconciliation AS
SELECT 
    m.record_date,
    COALESCE(SUM(CASE WHEN m.session = 'morning' THEN m.yield_litres ELSE 0 END), 0) AS total_morning_yield_litres,
    COALESCE(SUM(CASE WHEN m.session = 'evening' THEN m.yield_litres ELSE 0 END), 0) AS total_evening_yield_litres,
    COALESCE(SUM(m.yield_litres), 0) AS total_daily_yield_litres,
    ROUND(AVG(m.fat_percentage), 2) AS avg_fat_percentage,
    ROUND(AVG(m.snf_percentage), 2) AS avg_snf_percentage,
    COALESCE(o.bottles_dispatched, 0) AS total_litres_dispatched,
    COALESCE(SUM(m.yield_litres), 0) - COALESCE(o.bottles_dispatched, 0) AS surplus_for_processing_litres
FROM milk_records m
LEFT JOIN (
    SELECT 
        delivery_date, 
        SUM(bottles_delivered) AS bottles_dispatched
    FROM orders
    WHERE delivery_status = 'delivered'
    GROUP BY delivery_date
) o ON m.record_date = o.delivery_date
GROUP BY m.record_date, o.bottles_dispatched
ORDER BY m.record_date DESC;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES (Supabase / Postgres)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_pauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints_and_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cows ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Customer can read and edit own profile
CREATE POLICY customer_profile_policy ON profiles
    FOR ALL
    USING (auth.uid() = auth_user_id);

-- Customer can read own wallet
CREATE POLICY customer_wallet_policy ON wallets
    FOR SELECT
    USING (customer_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Customer can manage own subscriptions
CREATE POLICY customer_subscription_policy ON subscriptions
    FOR ALL
    USING (customer_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Customer can view own orders
CREATE POLICY customer_orders_policy ON orders
    FOR SELECT
    USING (customer_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Admin & Farm staff full access policies
CREATE POLICY admin_full_access_cows ON cows
    FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('admin', 'farmer')));

CREATE POLICY admin_full_access_milk ON milk_records
    FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('admin', 'farmer')));

CREATE POLICY admin_full_access_orders ON orders
    FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('admin', 'driver')));
