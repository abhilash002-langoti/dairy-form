-- ============================================================================
-- AMRIT DAIRY FARMS - SAMPLE SEED DATA
-- Real-world Indian dairy products, serviceable pin codes, cows, and transactions
-- ============================================================================

-- 1. SEED SERVICEABLE PIN CODES (Bangalore Region)
INSERT INTO service_areas (pincode, locality_name, city, hub_name, is_active, estimated_delivery_time) VALUES
('560034', 'Koramangala 1st-8th Block', 'Bangalore', 'South Bangalore Hub', true, '5:30 AM - 6:45 AM'),
('560038', 'Indiranagar & Domlur', 'Bangalore', 'East Bangalore Hub', true, '5:45 AM - 7:00 AM'),
('560102', 'HSR Layout Sectors 1-7', 'Bangalore', 'South Bangalore Hub', true, '5:30 AM - 6:30 AM'),
('560041', 'Jayanagar 1st-9th Block', 'Bangalore', 'Central Bangalore Hub', true, '5:15 AM - 6:30 AM'),
('560003', 'Malleshwaram & Vyalikaval', 'Bangalore', 'North Bangalore Hub', true, '5:30 AM - 6:45 AM'),
('560066', 'Whitefield & ITPL Road', 'Bangalore', 'East Bangalore Hub', true, '6:00 AM - 7:15 AM'),
('560076', 'JP Nagar Phases 1-8', 'Bangalore', 'South Bangalore Hub', true, '5:30 AM - 6:45 AM'),
('560100', 'Electronic City Phase 1 & 2', 'Bangalore', 'South Hub', true, '5:45 AM - 7:00 AM'),
('560103', 'Bellandur & Outer Ring Road', 'Bangalore', 'East Bangalore Hub', true, '5:45 AM - 7:00 AM'),
('560001', 'MG Road, Richmond Town, CBD', 'Bangalore', 'Central Bangalore Hub', true, '5:15 AM - 6:30 AM')
ON CONFLICT (pincode) DO NOTHING;

-- 2. SEED PRODUCT CATALOG
INSERT INTO products (sku, name, name_hi, name_kn, category, unit, price, original_price, fat_percentage, snf_percentage, stock_quantity, description, description_hi, description_kn, image_url, badge_tag, is_subscription_available) VALUES
('MILK-A2-COW-1L', 'Pure A2 Desi Gir Cow Milk', 'शुद्ध ए2 देसी गिर गाय का दूध', 'ಶುದ್ಧ ಎ2 ದೇಶಿ ಗಿರ್ ಹಸುವಿನ ಹಾಲು', 'milk', 'litre', 80.00, 90.00, 4.5, 8.8, 350, 'Single-origin, 100% natural raw/pasteurized A2 beta-casein milk from Vedic Gir and Sahiwal cows. Delivered in sterilized glass bottles within 3 hours of milking.', 'वैदिक गिर और साहिवाल गायों से प्राप्त शुद्ध ए2 दूध। बिना किसी मिलावट के ताजा कांच की बोतलों में वितरित।', 'ಗಿರ್ ಮತ್ತು ಸಾಹಿವಾಲ್ ಹಸುಗಳಿಂದ ಪಡೆದ 100% ನೈಸರ್ಗಿಕ ಶುದ್ಧ ಎ2 ಹಾಲು. ಕ್ರಿಮಿನಾಶಕ ಗಾಜಿನ ಬಾಟಲಿಗಳಲ್ಲಿ ಸರಬರಾಜು.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', 'Bestseller', true),

('MILK-BUFF-1L', 'Creamy Murrah Buffalo Milk', 'गाढ़ा मुर्रा भैंस का ताजा दूध', 'ಕೆನೆಭರಿತ ಮುರ್ರಾ ಎಮ್ಮೆಯ ಹಾಲು', 'milk', 'litre', 88.00, 95.00, 7.2, 9.2, 280, 'Thick, rich, and naturally creamy whole buffalo milk. Ideal for traditional Indian sweets, thick malai curd, and rich tea/coffee.', 'उच्च वसा युक्त ताजा और गाढ़ा मुर्रा भैंस का दूध। मलाईदार चाय और पारंपरिक मिठाइयों के लिए सर्वोत्तम।', 'ದಪ್ಪನೆಯ ಕೆನೆಭರಿತ ಮುರ್ರಾ ಎಮ್ಮೆ ಹಾಲು. ದಪ್ಪನೆಯ ಮೊಸರು ಮತ್ತು ಕಾಫಿ-ಟೀಗೆ ಅತ್ಯುತ್ತಮ.', 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80', 'Rich & Creamy', true),

('GHEE-BILONA-500ML', 'Desi Cow Vedic Bilona Ghee', 'वैदिक बिलोना देसी गाय का घी', 'ವೈದಿಕ ಬಿಲೋನಾ ಹಸುವಿನ ತುಪ್ಪ', 'ghee', 'pack_500g', 1350.00, 1500.00, 99.8, 0.2, 90, 'Handcrafted using ancient wooden churner (Bilona method) from curd made of A2 Gir cow milk. Golden, granular texture with authentic aroma.', 'पारंपरिक लकड़ी की मथानी द्वारा दही से बिलोना विधि द्वारा निर्मित शुद्ध ए2 गिर गाय का घी।', 'ಎ2 ಗಿರ್ ಹಸುವಿನ ಮೊಸರಿನಿಂದ ಸಾಂಪ್ರದಾಯಿಕ ಮರದ ಮಂಥನದಿಂದ ತಯಾರಿಸಿದ ಶುದ್ಧ ಸುವಾಸನೆಯ ಹಸುವಿನ ತುಪ್ಪ.', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80', 'Vedic Gold', false),

('PANEER-FRESH-200G', 'Farm-Fresh Malai Paneer', 'ताजा फार्म मलाई पनीर', 'ತಾಜಾ ಫಾರ್ಮ್ ಮಲೈ ಪನೀರ್', 'paneer', 'pack_200g', 125.00, 140.00, 24.0, 18.0, 120, 'Ultra-soft, melt-in-mouth artisanal cottage cheese made fresh every single morning from pure whole milk. No starch, no vinegar, zero preservatives.', 'सुबह के ताजे दूध से बना मखमली और अत्यंत कोमल मलाई पनीर। कोई सिरका या स्टार्च नहीं।', 'ಪ್ರತಿದಿನ ಬೆಳಗ್ಗೆ ಶುದ್ಧ ಹಾಲಿನಿಂದ ತಯಾರಿಸಿದ ಅತಿ ಮೃದುವಾದ ತಾಜಾ ಪನೀರ್. ಯಾವುದೇ ರಾಸಾಯನಿಕಗಳಿಲ್ಲ.', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', 'Made Today', true),

('CURD-POT-500G', 'Thick Natural Set Curd (Dahi)', 'गाढ़ा प्राकृतिक देसी दही', 'ದಪ್ಪ ನೈಸರ್ಗಿಕ ಗಟ್ಟಿ ಮೊಸರು', 'curd', 'pack_500g', 50.00, 55.00, 5.0, 9.0, 150, 'Naturally set artisanal curd with active live probiotics. Silky smooth, mildly sweet, and gut-friendly with zero artificial thickeners.', 'जीवंत प्रोबायोटिक्स से भरपूर प्राकृतिक रूप से जमाया हुआ मलाईदार और गाढ़ा देसी दही।', 'ನೈಸರ್ಗಿಕ ಪ್ರೋಬಯಾಟಿಕ್‌ಗಳನ್ನು ಹೊಂದಿರುವ ಗಟ್ಟಿ ಮತ್ತು ರುಚಿಕರವಾದ ಫಾರ್ಮ್-ಫ್ರೆಶ್ ಮೊಸರು.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', 'Probiotic', true),

('BUTTER-FARM-250G', 'Traditional Desi Makkhan (White Butter)', 'ताजा सफेद मक्खन', 'ತಾಜಾ ಬಿಳಿ ಬೆಣ್ಣೆ (ಮಖನ್)', 'butter', 'pack_200g', 170.00, 190.00, 82.0, 2.0, 60, 'Traditional unsalted white butter churned freshly from cultured cream. Just like Dadi maa made at home!', 'दही की मलाई से ताजा मथा हुआ बिना नमक का शुद्ध सफेद मक्खन। बचपन के स्वाद जैसा।', 'ಸಾಂಪ್ರದಾಯಿಕ ವಿಧಾನದಿಂದ ಮಂಥನ ಮಾಡಿದ ತಾಜಾ ಬಿಳಿ ಬೆಣ್ಣೆ. ಆರೋಗ್ಯಕ್ಕೆ ಅತ್ಯುತ್ತಮ.', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80', 'Artisanal', false),

('CHAAS-MASALA-300ML', 'Spiced Farm Buttermilk (Chaas)', 'मसाला छाछ', 'ಮಸಾಲೆ ಮಜ್ಜಿಗೆ', 'beverage', 'bottle_300ml', 25.00, 30.00, 1.5, 6.0, 200, 'Refreshing chilled buttermilk tempered with roasted jeera, fresh curry leaves, green chili, ginger, and pink Himalayan rock salt.', 'भुने जीरे, करी पत्ता, अदरक और सेंधा नमक के तड़के से तैयार ताजगी भरी ठंडक देने वाली मसाला छाछ।', 'ಹುರಿದ ಜೀರಿಗೆ, ಕರಿಬೇವಿನ ಸೊಪ್ಪು, ಶುಂಠಿ ಮತ್ತು ಕಲ್ಲುಪ್ಪಿನಿಂದ ಸಿದ್ಧಪಡಿಸಿದ ತಂಪಾದ ಮಸಾಲಾ ಮಜ್ಜಿಗೆ.', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', 'Refreshing', true)
ON CONFLICT (sku) DO NOTHING;

-- 3. SEED COWS (Cattle Registry)
INSERT INTO cows (tag_number, name, breed, animal_type, date_of_birth, age_years, lactation_number, lactation_stage, health_status, daily_avg_yield_litres, last_calving_date, expected_calving_date, notes) VALUES
('AMR-001', 'Kamadhenu', 'Gir', 'Cow', '2020-03-15', 4.6, 2, 'early', 'healthy', 16.5, '2026-08-10', NULL, 'High yielder, calm temperament, excellent maternal instincts.'),
('AMR-002', 'Gauri', 'Sahiwal', 'Cow', '2019-11-20', 5.0, 3, 'mid', 'healthy', 14.0, '2026-05-18', '2027-02-25', 'Confirmed pregnant. Third lactation, sweet rich milk.'),
('AMR-003', 'Yamuna', 'Murrah Buffalo', 'Buffalo', '2021-01-10', 3.8, 2, 'early', 'healthy', 18.0, '2026-09-01', NULL, 'High fat percentage (7.8%), Murrah champion bloodline.'),
('AMR-004', 'Radha', 'Gir', 'Cow', '2020-07-08', 4.3, 2, 'mid', 'healthy', 13.5, '2026-06-12', NULL, 'Grazes openly in organic green clover pasture.'),
('AMR-005', 'Kalyani', 'Red Sindhi', 'Cow', '2022-02-14', 2.7, 1, 'early', 'healthy', 11.5, '2026-07-22', NULL, 'First calving, gentle heifer with consistent morning output.'),
('AMR-006', 'Nandi Rani', 'Murrah Buffalo', 'Buffalo', '2018-09-05', 6.1, 4, 'late', 'healthy', 12.0, '2026-01-14', '2026-12-15', 'Expected calving in mid-December. Extra mineral mixture scheduled.'),
('AMR-007', 'Surabhi', 'Gir', 'Cow', '2021-05-30', 3.4, 1, 'early', 'healthy', 15.0, '2026-08-25', NULL, 'Golden hued coat, superior milk fat and protein.'),
('AMR-008', 'Kaveri', 'Tharparkar', 'Cow', '2019-04-12', 5.5, 3, 'dry', 'healthy', 0.0, '2025-11-04', '2026-11-20', 'Dry period resting before upcoming winter calving.')
ON CONFLICT (tag_number) DO NOTHING;

-- 4. SEED FEED INVENTORY
INSERT INTO feed_items (item_name, category, current_stock_kg, minimum_alert_level_kg, cost_per_kg) VALUES
('Organic Green Sorghum & Napier Grass', 'green_fodder', 1450.00, 300.00, 4.50),
('Dry Wheat Straw (Bhusa)', 'dry_fodder', 2100.00, 500.00, 8.00),
('Cattle Feed Pellets (22% Protein)', 'concentrate', 850.00, 200.00, 28.50),
('Mustard & Cottonseed Oil Cake', 'concentrate', 420.00, 150.00, 36.00),
('Chelated Mineral Mixture & Salt Licks', 'minerals_supplements', 180.00, 50.00, 95.00)
ON CONFLICT (item_name) DO NOTHING;

-- 5. SEED COUPONS & PROMOTIONS
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount_amount, is_active) VALUES
('FRESH50', 'percentage', 20.00, 200.00, 80.00, true),
('TRYMILK', 'flat_amount', 50.00, 150.00, 50.00, true),
('FARMSTART', 'percentage', 15.00, 300.00, 100.00, true)
ON CONFLICT (code) DO NOTHING;
