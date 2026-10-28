// ============================================================================
// AMRIT DAIRY FARMS - COMPLETE SEED & ERP DATA STORE
// ============================================================================

module.exports = {
  farmConfig: {
    name: "Amrit Dairy Farms",
    tagline: "Pure, Organic & Farm-Fresh Milk from Our Pastures to Your Doorstep within 3 Hours",
    fssaiLicense: "11223344556677",
    contactPhone: "+91 98765 43210",
    contactEmail: "care@amritdairy.com",
    whatsappNumber: "+919876543210",
    address: "Survey No. 42, Green Pastures Road, Nelamangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "562123",
    morningSlot: "05:30 AM - 07:30 AM",
    eveningSlot: "05:30 PM - 07:30 PM",
    currency: "₹",
    freeDeliveryThreshold: 0
  },

  // 1. ERP USERS (Admin / Farm Owner vs Staff / Worker)
  erpUsers: [
    {
      id: "usr-admin",
      username: "admin",
      phone: "9876543210",
      email: "admin@amritdairy.com",
      password: "admin123",
      name: "Sardar Gurmeet Singh",
      role: "admin", // full access: can edit, delete, and view financial reports
      title: "Farm Owner & Executive Director",
      createdAt: "2026-01-01"
    },
    {
      id: "usr-staff",
      username: "staff",
      phone: "9886012345",
      email: "staff@amritdairy.com",
      password: "staff123",
      name: "Ramesh Kumar Gowda",
      role: "staff", // can add entries, cannot delete records or view financial profit/loss
      title: "Head Dairy Supervisor & Herd Manager",
      createdAt: "2026-02-15"
    }
  ],

  // 2. MASTER SETTINGS & TAXONOMY
  masterSettings: {
    farmName: "Amrit Dairy Farms",
    location: "Nelamangala, Bangalore Rural",
    currency: "₹",
    milkSaleRatePerLitre: 65.0, // Wholesale/dispatch bulk rate
    retailRatePerLitre: 80.0,
    breeds: [
      "Gir (Vedic Desi)",
      "Sahiwal (Punjab Indigenous)",
      "Red Sindhi",
      "Murrah Buffalo",
      "Tharparkar",
      "HF Cross (Holstein)",
      "Jersey Cross"
    ],
    feedTypes: [
      "Green Fodder (Napier & Clover)",
      "Dry Fodder (Wheat Straw / Bhusa)",
      "Concentrate Pellets (22% Protein)",
      "Mustard & Cottonseed Oil Cake",
      "Chelated Mineral Mixture & Salt Licks",
      "Fermented Corn Silage"
    ],
    medicineCategories: [
      "Antibiotic",
      "Vitamin / Supplement",
      "Deworming",
      "Vaccine",
      "Antiseptic / Topical",
      "Pain Relief / Anti-inflammatory"
    ]
  },

  // 3. COW MASTER RECORDS (Tag, Status, DOB, Purchase, Calving, Full History)
  cows: [
    {
      id: "cow-1",
      tagNumber: "AMR-001",
      name: "Kamadhenu",
      breed: "Gir (Vedic Desi)",
      type: "Cow",
      status: "milking", // milking, dry, pregnant, sick
      dob: "2020-03-15",
      ageYears: 4.6,
      purchaseDate: "2022-04-10",
      purchasePrice: 65000,
      calvingDate: "2026-08-10",
      expectedCalvingDate: null,
      lactationNumber: 2,
      dailyAvgYield: 16.5,
      weightKg: 420,
      healthNotes: "Very healthy. High producer, calm temperament.",
      photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cow-2",
      tagNumber: "AMR-002",
      name: "Gauri",
      breed: "Sahiwal (Punjab Indigenous)",
      type: "Cow",
      status: "pregnant",
      dob: "2019-11-20",
      ageYears: 5.0,
      purchaseDate: "2021-12-05",
      purchasePrice: 72000,
      calvingDate: "2026-05-18",
      expectedCalvingDate: "2027-02-25",
      lactationNumber: 3,
      dailyAvgYield: 14.0,
      weightKg: 440,
      healthNotes: "Confirmed pregnant via ultrasound. 3rd lactation.",
      photoUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cow-3",
      tagNumber: "AMR-003",
      name: "Yamuna",
      breed: "Murrah Buffalo",
      type: "Buffalo",
      status: "milking",
      dob: "2021-01-10",
      ageYears: 3.8,
      purchaseDate: "2023-01-20",
      purchasePrice: 95000,
      calvingDate: "2026-09-01",
      expectedCalvingDate: null,
      lactationNumber: 2,
      dailyAvgYield: 18.0,
      weightKg: 580,
      healthNotes: "Exceptional fat yield (7.8%). Murrah champion bloodline.",
      photoUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cow-4",
      tagNumber: "AMR-004",
      name: "Radha",
      breed: "Gir (Vedic Desi)",
      type: "Cow",
      status: "milking",
      dob: "2020-07-08",
      ageYears: 4.3,
      purchaseDate: "2022-08-15",
      purchasePrice: 62000,
      calvingDate: "2026-06-12",
      expectedCalvingDate: null,
      lactationNumber: 2,
      dailyAvgYield: 13.5,
      weightKg: 395,
      healthNotes: "Gentle mother cow. Loves open organic pasture grazing.",
      photoUrl: "https://images.unsplash.com/photo-1596733430284-f7437764b149?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cow-5",
      tagNumber: "AMR-005",
      name: "Kalyani",
      breed: "Red Sindhi",
      type: "Cow",
      status: "sick", // Under observation
      dob: "2022-02-14",
      ageYears: 2.7,
      purchaseDate: "2024-03-01",
      purchasePrice: 58000,
      calvingDate: "2026-07-22",
      expectedCalvingDate: null,
      lactationNumber: 1,
      dailyAvgYield: 11.5,
      weightKg: 360,
      healthNotes: "Mild left quarter mastitis under antibiotic treatment. Milk discarded (Withdrawal active).",
      photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cow-6",
      tagNumber: "AMR-006",
      name: "Nandi Rani",
      breed: "Murrah Buffalo",
      type: "Buffalo",
      status: "dry", // Dry period before calving
      dob: "2018-09-05",
      ageYears: 6.1,
      purchaseDate: "2021-06-11",
      purchasePrice: 88000,
      calvingDate: "2025-11-20",
      expectedCalvingDate: "2026-12-15",
      lactationNumber: 4,
      dailyAvgYield: 0.0,
      weightKg: 610,
      healthNotes: "Dry period. Due for calving in mid-December. Extra mineral mixture scheduled.",
      photoUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // 4. DAILY MILK PRODUCTION RECORDS (Morning, Evening, Total, Fat %, SNF %, Kept vs Sold)
  milkProduction: [
    { id: "mlp-1", date: "2026-10-28", cowId: "cow-1", cowTag: "AMR-001", cowName: "Kamadhenu", morningLitres: 9.5, eveningLitres: 7.0, totalLitres: 16.5, fat: 4.6, snf: 8.9, milkSold: 15.0, milkKept: 1.5, ratePerLitre: 65, notes: "Excellent yield" },
    { id: "mlp-2", date: "2026-10-28", cowId: "cow-2", cowTag: "AMR-002", cowName: "Gauri", morningLitres: 8.0, eveningLitres: 6.0, totalLitres: 14.0, fat: 4.4, snf: 8.7, milkSold: 13.0, milkKept: 1.0, ratePerLitre: 65, notes: "Normal" },
    { id: "mlp-3", date: "2026-10-28", cowId: "cow-3", cowTag: "AMR-003", cowName: "Yamuna", morningLitres: 10.5, eveningLitres: 7.5, totalLitres: 18.0, fat: 7.6, snf: 9.4, milkSold: 16.0, milkKept: 2.0, ratePerLitre: 75, notes: "High fat buffalo milk" },
    { id: "mlp-4", date: "2026-10-28", cowId: "cow-4", cowTag: "AMR-004", cowName: "Radha", morningLitres: 7.5, eveningLitres: 6.0, totalLitres: 13.5, fat: 4.3, snf: 8.6, milkSold: 12.0, milkKept: 1.5, ratePerLitre: 65, notes: "Good morning session" },
    { id: "mlp-5", date: "2026-10-28", cowId: "cow-5", cowTag: "AMR-005", cowName: "Kalyani", morningLitres: 6.5, eveningLitres: 4.5, totalLitres: 11.0, fat: 4.2, snf: 8.5, milkSold: 0.0, milkKept: 11.0, ratePerLitre: 0, notes: "DISCARDED: Antibiotic withdrawal active" },

    { id: "mlp-6", date: "2026-10-27", cowId: "cow-1", cowTag: "AMR-001", cowName: "Kamadhenu", morningLitres: 9.2, eveningLitres: 7.1, totalLitres: 16.3, fat: 4.5, snf: 8.8, milkSold: 15.0, milkKept: 1.3, ratePerLitre: 65, notes: "" },
    { id: "mlp-7", date: "2026-10-27", cowId: "cow-2", cowTag: "AMR-002", cowName: "Gauri", morningLitres: 8.1, eveningLitres: 5.9, totalLitres: 14.0, fat: 4.4, snf: 8.7, milkSold: 13.0, milkKept: 1.0, ratePerLitre: 65, notes: "" },
    { id: "mlp-8", date: "2026-10-27", cowId: "cow-3", cowTag: "AMR-003", cowName: "Yamuna", morningLitres: 10.2, eveningLitres: 7.6, totalLitres: 17.8, fat: 7.5, snf: 9.3, milkSold: 16.0, milkKept: 1.8, ratePerLitre: 75, notes: "" },
    { id: "mlp-9", date: "2026-10-27", cowId: "cow-4", cowTag: "AMR-004", cowName: "Radha", morningLitres: 7.8, eveningLitres: 5.8, totalLitres: 13.6, fat: 4.3, snf: 8.6, milkSold: 12.0, milkKept: 1.6, ratePerLitre: 65, notes: "" },
    { id: "mlp-10", date: "2026-10-27", cowId: "cow-5", cowTag: "AMR-005", cowName: "Kalyani", morningLitres: 6.8, eveningLitres: 4.6, totalLitres: 11.4, fat: 4.3, snf: 8.6, milkSold: 0.0, milkKept: 11.4, ratePerLitre: 0, notes: "DISCARDED: Antibiotic withdrawal" }
  ],

  // 5. MEDICINES INVENTORY
  medicines: [
    {
      id: "med-1",
      name: "Amoxicillin LA Injection (100ml)",
      type: "antibiotic",
      quantity: 3,
      unit: "vials",
      minAlertLevel: 2,
      purchaseDate: "2026-08-14",
      expiryDate: "2027-08-14",
      price: 450,
      supplier: "Karnataka Vet Medicos",
      withdrawalDays: 4, // 4 days withdrawal period
      notes: "Broad-spectrum long acting antibiotic for respiratory & mastitis infections"
    },
    {
      id: "med-2",
      name: "Ivermectin 1% Injection (50ml)",
      type: "deworming",
      quantity: 5,
      unit: "bottles",
      minAlertLevel: 2,
      purchaseDate: "2026-05-10",
      expiryDate: "2027-11-30",
      price: 320,
      supplier: "Kisan Veterinary Supplies",
      withdrawalDays: 14,
      notes: "Ecto and endo parasite control"
    },
    {
      id: "med-3",
      name: "Calcium Borogluconate 450ml (Calci-Fast)",
      type: "vitamin",
      quantity: 1, // LOW STOCK
      unit: "bottles",
      minAlertLevel: 3,
      purchaseDate: "2026-07-20",
      expiryDate: "2026-11-15", // NEAR EXPIRY!
      price: 280,
      supplier: "Karnataka Vet Medicos",
      withdrawalDays: 0,
      notes: "Emergency IV for milk fever and hypocalcemia"
    },
    {
      id: "med-4",
      name: "Raksha-Ovac FMD (Foot and Mouth) Vaccine",
      type: "vaccine",
      quantity: 20,
      unit: "doses",
      minAlertLevel: 10,
      purchaseDate: "2026-09-01",
      expiryDate: "2027-09-01",
      price: 750,
      supplier: "Indian Immunologicals Ltd",
      withdrawalDays: 0,
      notes: "Store at 2°C to 8°C in farm medical refrigerator"
    },
    {
      id: "med-5",
      name: "Belamyl Liver Extract & B-Complex (100ml)",
      type: "vitamin",
      quantity: 6,
      unit: "vials",
      minAlertLevel: 2,
      purchaseDate: "2026-08-20",
      expiryDate: "2028-02-28",
      price: 190,
      supplier: "Karnataka Vet Medicos",
      withdrawalDays: 0,
      notes: "Energy booster, anorexia recovery, and rumen stimulator"
    }
  ],

  // 6. TREATMENT RECORDS & WITHDRAWAL PERIOD TRACKER
  treatments: [
    {
      id: "trt-1",
      cowId: "cow-5",
      cowTag: "AMR-005",
      cowName: "Kalyani",
      illness: "Acute Left Quarter Mastitis",
      medicineId: "med-1",
      medicineName: "Amoxicillin LA Injection (100ml)",
      dose: "15 ml Deep IM",
      treatmentDate: "2026-10-26",
      vetName: "Dr. Ramesh BVSc (Govt Vet Hospital)",
      cost: 650,
      withdrawalDays: 4,
      withdrawalEndDate: "2026-10-30", // Active withdrawal until Oct 30!
      isWithdrawalActive: true,
      notes: "Milk strictly barred from human consumption until Oct 30."
    },
    {
      id: "trt-2",
      cowId: "cow-1",
      cowTag: "AMR-001",
      cowName: "Kamadhenu",
      illness: "Routine Deworming & Liver Tonic",
      medicineId: "med-2",
      medicineName: "Ivermectin 1% Injection",
      dose: "8 ml SC",
      treatmentDate: "2026-09-10",
      vetName: "Dr. Ramesh BVSc",
      cost: 400,
      withdrawalDays: 14,
      withdrawalEndDate: "2026-09-24",
      isWithdrawalActive: false,
      notes: "Completed successfully with zero side effects."
    }
  ],

  // 7. VACCINATION SCHEDULE & REMINDERS
  vaccinations: [
    {
      id: "vac-1",
      cowId: "cow-1",
      cowTag: "AMR-001",
      cowName: "Kamadhenu",
      vaccineName: "FMD (Foot & Mouth Disease) Booster",
      dateAdministered: "2026-05-15",
      nextDueDate: "2026-11-15", // UPCOMING in 18 days!
      vetName: "Dr. Ramesh BVSc",
      status: "due_soon"
    },
    {
      id: "vac-2",
      cowId: "cow-2",
      cowTag: "AMR-002",
      cowName: "Gauri",
      vaccineName: "Brucellosis S19 Strain",
      dateAdministered: "2022-01-10",
      nextDueDate: "2027-01-10",
      vetName: "Dr. Ramesh BVSc",
      status: "completed"
    },
    {
      id: "vac-3",
      cowId: "cow-3",
      cowTag: "AMR-003",
      cowName: "Yamuna",
      vaccineName: "HS (Haemorrhagic Septicaemia)",
      dateAdministered: "2026-06-01",
      nextDueDate: "2026-11-05", // UPCOMING in 8 days!
      vetName: "Dr. Ramesh BVSc",
      status: "due_soon"
    },
    {
      id: "vac-4",
      cowId: "cow-4",
      cowTag: "AMR-004",
      cowName: "Radha",
      vaccineName: "Black Quarter (BQ)",
      dateAdministered: "2026-06-01",
      nextDueDate: "2026-12-01",
      vetName: "Dr. Ramesh BVSc",
      status: "completed"
    }
  ],

  // 8. COW FEED INVENTORY
  feedInventory: [
    {
      id: "feed-1",
      name: "Organic Green Napier & Sorghum Fodder",
      category: "green_fodder",
      stockKg: 1450,
      alertKg: 300,
      pricePerKg: 4.50,
      supplier: "Amrit On-Farm Organic Pasture",
      purchaseDate: "2026-10-25"
    },
    {
      id: "feed-2",
      name: "Dry Wheat Straw (Bhusa)",
      category: "dry_fodder",
      stockKg: 2100,
      alertKg: 500,
      pricePerKg: 8.00,
      supplier: "Kisan Cattle Feeds",
      purchaseDate: "2026-10-20"
    },
    {
      id: "feed-3",
      name: "Concentrate Pellets (22% Crude Protein)",
      category: "concentrate",
      stockKg: 180, // LOW STOCK ALERT!
      alertKg: 200,
      pricePerKg: 28.50,
      supplier: "Godrej Agrovet",
      purchaseDate: "2026-10-18"
    },
    {
      id: "feed-4",
      name: "Mustard & Cottonseed Oil Cake",
      category: "concentrate",
      stockKg: 420,
      alertKg: 150,
      pricePerKg: 36.00,
      supplier: "Sri Lakshmi Oil Mills",
      purchaseDate: "2026-10-22"
    },
    {
      id: "feed-5",
      name: "Chelated Mineral Mixture & Salt Licks",
      category: "minerals_supplements",
      stockKg: 160,
      alertKg: 50,
      pricePerKg: 95.00,
      supplier: "Virbac Animal Health",
      purchaseDate: "2026-09-28"
    },
    {
      id: "feed-6",
      name: "Fermented Sweet Corn Silage",
      category: "silage",
      stockKg: 3200,
      alertKg: 800,
      pricePerKg: 6.50,
      supplier: "Silage Agro Hub Nelamangala",
      purchaseDate: "2026-10-15"
    }
  ],

  // 9. DAILY FEEDING LOGS & FEED COST PER LITRE
  feedingLogs: [
    {
      id: "fdl-1",
      date: "2026-10-28",
      target: "All Lactating Cows (5 Cows)",
      feedId: "feed-1",
      feedName: "Organic Green Napier & Sorghum",
      quantityKg: 150,
      costPerKg: 4.5,
      totalCost: 675.0,
      notes: "Morning 8:00 AM pasture ration"
    },
    {
      id: "fdl-2",
      date: "2026-10-28",
      target: "All Lactating Cows (5 Cows)",
      feedId: "feed-3",
      feedName: "Concentrate Pellets (22% Protein)",
      quantityKg: 25,
      costPerKg: 28.5,
      totalCost: 712.5,
      notes: "Milking time ration"
    },
    {
      id: "fdl-3",
      date: "2026-10-28",
      target: "All Herd (6 Animals)",
      feedId: "feed-2",
      feedName: "Dry Wheat Straw (Bhusa)",
      quantityKg: 40,
      costPerKg: 8.0,
      totalCost: 320.0,
      notes: "Afternoon cudding"
    },
    {
      id: "fdl-4",
      date: "2026-10-28",
      target: "All Herd",
      feedId: "feed-5",
      feedName: "Chelated Mineral Mixture & Salt Licks",
      quantityKg: 2.0,
      costPerKg: 95.0,
      totalCost: 190.0,
      notes: "Mixed with wet mash"
    }
  ],

  // 10. FARM EXPENSES & ACCOUNTS (Admin Only)
  expenses: [
    {
      id: "exp-1",
      date: "2026-10-28",
      category: "feed",
      amount: 1897.50,
      payee: "Daily Feed Consumption",
      description: "150kg Napier, 25kg Pellets, 40kg Straw, 2kg Minerals",
      paymentMode: "Internal Stock Debit"
    },
    {
      id: "exp-2",
      date: "2026-10-28",
      category: "labour",
      amount: 1200.00,
      payee: "Daily Farm Hands (2 Workers)",
      description: "Milking, stall washing & cattle bath wages",
      paymentMode: "Cash / UPI"
    },
    {
      id: "exp-3",
      date: "2026-10-26",
      category: "medicine",
      amount: 650.00,
      payee: "Dr. Ramesh BVSc",
      description: "Mastitis treatment and Amoxicillin injection for AMR-005",
      paymentMode: "UPI"
    },
    {
      id: "exp-4",
      date: "2026-10-24",
      category: "electricity",
      amount: 3450.00,
      payee: "BESCOM Rural Power",
      description: "Monthly chiller & automated milking machine electricity bill",
      paymentMode: "Net Banking"
    },
    {
      id: "exp-5",
      date: "2026-10-22",
      category: "other",
      amount: 1800.00,
      payee: "Nelamangala Hardware",
      description: "Water pipe replacement and disinfectant floor chemicals",
      paymentMode: "Cash"
    }
  ],

  // Supporting retail and direct delivery state
  serviceAreas: [
    { pincode: "560034", locality: "Koramangala 1st-8th Block", city: "Bangalore", hub: "South Hub", active: true, morningTime: "5:30 AM - 6:45 AM", eveningTime: "5:30 PM - 6:30 PM" },
    { pincode: "560038", locality: "Indiranagar & Domlur", city: "Bangalore", hub: "East Hub", active: true, morningTime: "5:45 AM - 7:00 AM", eveningTime: "5:45 PM - 6:45 PM" },
    { pincode: "560102", locality: "HSR Layout Sectors 1-7", city: "Bangalore", hub: "South Hub", active: true, morningTime: "5:30 AM - 6:30 AM", eveningTime: "5:30 PM - 6:30 PM" },
    { pincode: "560041", locality: "Jayanagar 1st-9th Block", city: "Bangalore", hub: "Central Hub", active: true, morningTime: "5:15 AM - 6:30 AM", eveningTime: "5:15 PM - 6:15 PM" },
    { pincode: "560003", locality: "Malleshwaram & Vyalikaval", city: "Bangalore", hub: "North Hub", active: true, morningTime: "5:30 AM - 6:45 AM", eveningTime: "5:30 PM - 6:30 PM" },
    { pincode: "560066", locality: "Whitefield & ITPL Road", city: "Bangalore", hub: "East Hub", active: true, morningTime: "6:00 AM - 7:15 AM", eveningTime: "6:00 PM - 7:00 PM" },
    { pincode: "560076", locality: "JP Nagar Phases 1-8", city: "Bangalore", hub: "South Hub", active: true, morningTime: "5:30 AM - 6:45 AM", eveningTime: "5:30 PM - 6:30 PM" },
    { pincode: "560100", locality: "Electronic City Phase 1 & 2", city: "Bangalore", hub: "South Hub", active: true, morningTime: "5:45 AM - 7:00 AM", eveningTime: "5:45 PM - 6:45 PM" },
    { pincode: "560103", locality: "Bellandur & Outer Ring Road", city: "Bangalore", hub: "East Hub", active: true, morningTime: "5:45 AM - 7:00 AM", eveningTime: "5:45 PM - 6:45 PM" },
    { pincode: "560001", locality: "MG Road, Richmond Town, CBD", city: "Bangalore", hub: "Central Hub", active: true, morningTime: "5:15 AM - 6:30 AM", eveningTime: "5:15 PM - 6:15 PM" }
  ],
  products: [
    {
      id: "prod-1",
      sku: "MILK-A2-COW-1L",
      name: "Pure A2 Desi Gir Cow Milk",
      name_hi: "शुद्ध ए2 देसी गिर गाय का दूध",
      name_kn: "ಶುದ್ಧ ಎ2 ದೇಶಿ ಗಿರ್ ಹಸುವಿನ ಹಾಲು",
      category: "milk",
      unit: "litre",
      price: 80,
      originalPrice: 90,
      fat: "4.5%",
      snf: "8.8%",
      stock: 450,
      badge: "Bestseller",
      subscriptionAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
      description: "100% natural, single-origin A2 beta-casein milk directly from Vedic Gir cows.",
      benefits: ["A2 Protein for easy digestion", "No synthetic hormones or oxytocin", "Lab tested every single morning", "Glass bottle packaging"]
    },
    {
      id: "prod-2",
      sku: "MILK-BUFF-1L",
      name: "Creamy Murrah Buffalo Milk",
      name_hi: "गाढ़ा मुर्रा भैंस का ताजा दूध",
      name_kn: "ಕೆನೆಭರಿತ ಮುರ್ರಾ ಎಮ್ಮೆಯ ಹಾಲು",
      category: "milk",
      unit: "litre",
      price: 88,
      originalPrice: 98,
      fat: "7.2%",
      snf: "9.2%",
      stock: 320,
      badge: "Rich & Creamy",
      subscriptionAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80",
      description: "Rich, thick, and velvety whole buffalo milk from prime Murrah breed.",
      benefits: ["High natural fat (7.2%)", "Thick layer of golden malai", "Ideal for making paneer & rabdi", "Unprocessed freshness"]
    },
    {
      id: "prod-3",
      sku: "GHEE-BILONA-500ML",
      name: "Desi Cow Vedic Bilona Ghee",
      name_hi: "वैदिक बिलोना देसी गाय का घी",
      name_kn: "ವೈದಿಕ ಬಿಲೋನಾ ಹಸುವಿನ ತುಪ್ಪ",
      category: "ghee",
      unit: "500ml jar",
      price: 1350,
      originalPrice: 1500,
      fat: "99.8%",
      snf: "0.2%",
      stock: 95,
      badge: "Vedic Gold",
      subscriptionAvailable: false,
      imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
      description: "Handcrafted using ancient wooden churners from cultured A2 curd.",
      benefits: ["Churned in clay & wooden churners", "A2 Gir cow cultured curd base", "Immunity boosting & gut friendly", "Zero preservatives or artificial flavors"]
    },
    {
      id: "prod-4",
      sku: "PANEER-FRESH-200G",
      name: "Farm-Fresh Malai Paneer",
      name_hi: "ताजा फार्म मलाई पनीर",
      name_kn: "ತಾಜಾ ಫಾರ್ಮ್ ಮಲೈ ಪನೀರ್",
      category: "paneer",
      unit: "200g pack",
      price: 125,
      originalPrice: 140,
      fat: "24%",
      snf: "18%",
      stock: 140,
      badge: "Made Today",
      subscriptionAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
      description: "Melt-in-your-mouth artisanal cottage cheese made fresh every morning.",
      benefits: ["High biological protein (18g/100g)", "Curdled naturally without chemicals", "Spongy and soft texture", "Vacuum sealed same-day freshness"]
    },
    {
      id: "prod-5",
      sku: "CURD-POT-500G",
      name: "Thick Natural Set Curd (Dahi)",
      name_hi: "गाढ़ा प्राकृतिक देसी दही",
      name_kn: "ದಪ್ಪ ನೈಸರ್ಗಿಕ ಗಟ್ಟಿ ಮೊಸರು",
      category: "curd",
      unit: "500g clay tub",
      price: 50,
      originalPrice: 58,
      fat: "5.0%",
      snf: "9.0%",
      stock: 180,
      badge: "Probiotic",
      subscriptionAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
      description: "Naturally fermented whole milk curd with active live probiotics.",
      benefits: ["Over 1 billion CFUs of natural gut bacteria", "Naturally thick without gelatin or starch", "Cooling for digestion", "Eco-friendly clay container"]
    },
    {
      id: "prod-6",
      sku: "BUTTER-FARM-250G",
      name: "Traditional Desi Makkhan (White Butter)",
      name_hi: "ताजा सफेद मक्खन",
      name_kn: "ತಾಜಾ ಬಿಳಿ ಬೆಣ್ಣೆ (ಮಖನ್)",
      category: "butter",
      unit: "250g pack",
      price: 170,
      originalPrice: 195,
      fat: "82%",
      snf: "2.0%",
      stock: 75,
      badge: "Artisanal",
      subscriptionAvailable: false,
      imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
      description: "Nostalgic unsalted white butter churned from cultured malai.",
      benefits: ["100% unsalted & preservative free", "Rich in fat-soluble vitamins A, D, E", "Freshly hand-churned", "Traditional taste"]
    },
    {
      id: "prod-7",
      sku: "CHAAS-MASALA-300ML",
      name: "Spiced Farm Buttermilk (Chaas)",
      name_hi: "मसाला छाछ",
      name_kn: "ಮಸಾಲೆ ಮಜ್ಜಿಗೆ",
      category: "beverage",
      unit: "300ml bottle",
      price: 25,
      originalPrice: 30,
      fat: "1.5%",
      snf: "6.0%",
      stock: 220,
      badge: "Refreshing",
      subscriptionAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
      description: "Chilled organic buttermilk tempered with roasted cumin seeds and fresh curry leaves.",
      benefits: ["Instantly cools the body", "Zero added sugars or stabilizers", "Boosts post-meal digestion", "Rich in electrolytes"]
    }
  ],
  customers: [
    {
      id: "cust-1",
      name: "Ananya Sharma",
      phone: "+91 98450 12345",
      email: "ananya.sharma@gmail.com",
      address: "Flat 402, Green Glen Layout, Bellandur",
      pincode: "560103",
      walletBalance: 1240.00,
      role: "customer",
      referralCode: "ANANYA20",
      language: "en"
    }
  ],
  subscriptions: [
    {
      id: "sub-101",
      customerId: "cust-1",
      customerName: "Ananya Sharma",
      customerPhone: "+91 98450 12345",
      productId: "prod-1",
      productName: "Pure A2 Desi Gir Cow Milk",
      frequency: "daily",
      quantity: 1.0,
      unitPrice: 80,
      timeSlot: "morning",
      startDate: "2026-10-01",
      status: "active",
      deliveryAddress: "Flat 402, Green Glen Layout, Bellandur, Bangalore - 560103",
      pincode: "560103",
      bottlePreference: "glass_bottle",
      skippedDates: ["2026-10-30"]
    }
  ],
  orders: [
    {
      id: "ord-801",
      orderNumber: "AMR-2026-801",
      customerId: "cust-1",
      customerName: "Ananya Sharma",
      customerPhone: "+91 98450 12345",
      orderType: "subscription_daily",
      deliveryDate: "2026-10-28",
      timeSlot: "morning",
      items: [
        { productId: "prod-1", productName: "Pure A2 Desi Gir Cow Milk", quantity: 1, unitPrice: 80, totalPrice: 80 }
      ],
      subtotal: 80,
      discount: 0,
      netAmount: 80,
      paymentMode: "wallet",
      paymentStatus: "paid",
      deliveryStatus: "delivered",
      deliveryAddress: "Flat 402, Green Glen Layout, Bellandur",
      pincode: "560103",
      driverName: "Mahesh Kumar (Route A)",
      bottlesDelivered: 1,
      bottlesReturned: 1,
      deliveredAt: "2026-10-28T06:14:00+05:30"
    }
  ],
  walletTransactions: [
    { id: "wtx-1", customerId: "cust-1", amount: 1000, type: "recharge", description: "UPI Auto-Recharge (Ref: UPI-98314)", balanceAfter: 1320, date: "2026-10-25T10:30:00+05:30" },
    { id: "wtx-2", customerId: "cust-1", amount: -80, type: "order_debit", description: "Subscription Order #AMR-2026-801", balanceAfter: 1240, date: "2026-10-28T05:00:00+05:30" }
  ],
  deliveryPartners: [
    { id: "drv-1", name: "Mahesh Kumar", phone: "+91 98860 33445", route: "Route A - South Bangalore", vehicle: "EV Loader KA-01-EQ-4421", active: true }
  ],
  complaints: [],
  coupons: [
    { code: "FRESH50", discountPercentage: 20, maxDiscount: 80, minOrder: 200, active: true },
    { code: "TRYMILK", flatDiscount: 50, minOrder: 150, active: true }
  ]
};
