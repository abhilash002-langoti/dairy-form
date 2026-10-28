// CowCare Database & Firebase Connector
// Supports both Cloud Firebase Firestore and Offline LocalStorage DB for instant local testing!

const DB_KEYS = {
  USER: 'cowcare_user',
  FARM: 'cowcare_farm',
  COWS: 'cowcare_cows',
  MILK: 'cowcare_milk',
  REMINDERS: 'cowcare_reminders',
  FEED: 'cowcare_feed',
  TRANSACTIONS: 'cowcare_transactions',
  FIREBASE_CONFIG: 'cowcare_firebase_cfg'
};

class CowCareDB {
  constructor() {
    this.isLiveFirebase = false;
    this.auth = null;
    this.firestore = null;
    this.init();
  }

  async init() {
    // Check if custom Firebase config is stored
    const storedCfg = localStorage.getItem(DB_KEYS.FIREBASE_CONFIG);
    if (storedCfg) {
      try {
        const config = JSON.parse(storedCfg);
        if (window.firebase && config.apiKey && config.projectId) {
          if (!firebase.apps.length) {
            firebase.initializeApp(config);
          }
          this.auth = firebase.auth();
          this.firestore = firebase.firestore();
          this.isLiveFirebase = true;
          console.log("CowCare connected to live Firebase!");
        }
      } catch (err) {
        console.warn("Could not connect to live Firebase, using local database:", err);
      }
    }

    // Initialize local seed data if first time
    this.initLocalSeedData();
  }

  initLocalSeedData() {
    if (!localStorage.getItem(DB_KEYS.COWS)) {
      // Default demo farm data
      const defaultFarm = {
        id: "farm_demo_001",
        name: "Nandi Green Dairy Farm",
        ownerUid: "user_demo_001",
        phone: "+91 98450 12345",
        village: "Shivagange",
        district: "Bengaluru Rural",
        state: "Karnataka",
        createdAt: new Date().toISOString()
      };

      const defaultUser = {
        uid: "user_demo_001",
        email: "farmer@cowcare.com",
        displayName: "Ramesh Gowda",
        farmId: "farm_demo_001",
        role: "owner"
      };

      const defaultCows = [
        {
          id: "cow_001",
          farmId: "farm_demo_001",
          tagId: "COW-101",
          name: "Ganga",
          breed: "Gir",
          dob: "2022-03-15",
          gender: "Female",
          status: "active",
          purchaseDate: "2023-01-10",
          purchaseCost: 65000,
          photoUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80",
          notes: "High milk yield indigenous Gir cow. Very calm temperament.",
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
          id: "cow_002",
          farmId: "farm_demo_001",
          tagId: "COW-102",
          name: "Kamadhenu",
          breed: "Sahiwal",
          dob: "2021-08-20",
          gender: "Female",
          status: "active",
          purchaseDate: "2022-11-05",
          purchaseCost: 58000,
          photoUrl: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80",
          notes: "Strong disease resistance, consistent 12-14 L daily yield.",
          createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
        },
        {
          id: "cow_003",
          farmId: "farm_demo_001",
          tagId: "COW-103",
          name: "Lakshmi",
          breed: "HF Cross",
          dob: "2023-01-10",
          gender: "Female",
          status: "active",
          purchaseDate: "2024-02-14",
          purchaseCost: 72000,
          photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80",
          notes: "Peak lactation phase, high morning yields.",
          createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
        },
        {
          id: "cow_004",
          farmId: "farm_demo_001",
          tagId: "COW-104",
          name: "Bhavani",
          breed: "Hallikar",
          dob: "2020-05-12",
          gender: "Female",
          status: "pregnant",
          purchaseDate: "2021-06-18",
          purchaseCost: 45000,
          photoUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80",
          notes: "Native Karnataka breed. Expected calving soon. Currently dry.",
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
        },
        {
          id: "cow_005",
          farmId: "farm_demo_001",
          tagId: "COW-105",
          name: "Shubha",
          breed: "Murrah Buffalo",
          dob: "2022-11-01",
          gender: "Female",
          status: "active",
          purchaseDate: "2024-03-20",
          purchaseCost: 80000,
          photoUrl: "https://images.unsplash.com/photo-1596733430284-f7437764b14d?auto=format&fit=crop&w=600&q=80",
          notes: "High butterfat milk (7.5% fat).",
          createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
        }
      ];

      const todayStr = new Date().toISOString().split('T')[0];
      const defaultMilk = [
        {
          id: "mr_001",
          farmId: "farm_demo_001",
          cowId: "cow_001",
          cowTag: "COW-101",
          date: todayStr,
          session: "morning",
          quantityLitres: 8.5,
          fatContent: 4.8,
          snf: 8.5,
          notes: "Healthy yield",
          recordedBy: "Ramesh Gowda",
          createdAt: new Date().toISOString()
        },
        {
          id: "mr_002",
          farmId: "farm_demo_001",
          cowId: "cow_001",
          cowTag: "COW-101",
          date: todayStr,
          session: "evening",
          quantityLitres: 6.5,
          fatContent: 4.9,
          snf: 8.6,
          notes: "",
          recordedBy: "Ramesh Gowda",
          createdAt: new Date().toISOString()
        },
        {
          id: "mr_003",
          farmId: "farm_demo_001",
          cowId: "cow_002",
          cowTag: "COW-102",
          date: todayStr,
          session: "morning",
          quantityLitres: 7.0,
          fatContent: 4.5,
          snf: 8.4,
          notes: "",
          recordedBy: "Ramesh Gowda",
          createdAt: new Date().toISOString()
        },
        {
          id: "mr_004",
          farmId: "farm_demo_001",
          cowId: "cow_003",
          cowTag: "COW-103",
          date: todayStr,
          session: "morning",
          quantityLitres: 11.0,
          fatContent: 3.8,
          snf: 8.2,
          notes: "Peak lactation",
          recordedBy: "Ramesh Gowda",
          createdAt: new Date().toISOString()
        },
        {
          id: "mr_005",
          farmId: "farm_demo_001",
          cowId: "cow_005",
          cowTag: "COW-105",
          date: todayStr,
          session: "morning",
          quantityLitres: 6.0,
          fatContent: 7.5,
          snf: 9.0,
          notes: "Buffalo milk",
          recordedBy: "Ramesh Gowda",
          createdAt: new Date().toISOString()
        }
      ];

      const defaultReminders = [
        {
          id: "rem_001",
          farmId: "farm_demo_001",
          title: "FMD Booster Vaccination for Ganga (COW-101)",
          dueDate: "2026-11-05",
          category: "vaccination",
          isCompleted: false
        },
        {
          id: "rem_002",
          farmId: "farm_demo_001",
          title: "Deworming Schedule - All Adult Cows",
          dueDate: "2026-11-10",
          category: "vet_visit",
          isCompleted": false
        },
        {
          id: "rem_003",
          farmId: "farm_demo_001",
          title: "Expected Calving for Bhavani (COW-104)",
          dueDate: "2026-12-08",
          category": "breeding",
          isCompleted": false
        }
      ];

      const defaultTransactions = [
        {
          id: "tx_001",
          farmId: "farm_demo_001",
          date: todayStr,
          type: "income",
          category: "milk_sales",
          amount: 1950,
          paymentMethod: "upi",
          status: "paid",
          customerOrSupplier: "KMF Dairy Cooperative",
          notes: "Morning milk batch"
        },
        {
          id: "tx_002",
          farmId: "farm_demo_001",
          date: todayStr,
          type: "expense",
          category: "feed",
          amount: 650,
          paymentMethod: "cash",
          status: "paid",
          customerOrSupplier: "Agro Store",
          notes: "Cattle feed concentrate"
        }
      ];

      localStorage.setItem(DB_KEYS.FARM, JSON.stringify(defaultFarm));
      localStorage.setItem(DB_KEYS.USER, JSON.stringify(defaultUser));
      localStorage.setItem(DB_KEYS.COWS, JSON.stringify(defaultCows));
      localStorage.setItem(DB_KEYS.MILK, JSON.stringify(defaultMilk));
      localStorage.setItem(DB_KEYS.REMINDERS, JSON.stringify(defaultReminders));
      localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(defaultTransactions));
    }
  }

  // Get current logged in user & farm
  getCurrentUser() {
    const raw = localStorage.getItem(DB_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  }

  getCurrentFarm() {
    const raw = localStorage.getItem(DB_KEYS.FARM);
    return raw ? JSON.parse(raw) : null;
  }

  // Cows CRUD
  async getCows(farmId) {
    if (this.isLiveFirebase) {
      const snap = await this.firestore.collection('cows').where('farmId', '==', farmId).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const cows = JSON.parse(localStorage.getItem(DB_KEYS.COWS) || '[]');
    return cows.filter(c => c.farmId === farmId);
  }

  async saveCow(cowData) {
    if (this.isLiveFirebase) {
      if (cowData.id) {
        await this.firestore.collection('cows').doc(cowData.id).set(cowData, { merge: true });
        return cowData;
      } else {
        const docRef = await this.firestore.collection('cows').add({
          ...cowData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...cowData };
      }
    }

    const cows = JSON.parse(localStorage.getItem(DB_KEYS.COWS) || '[]');
    if (cowData.id) {
      const idx = cows.findIndex(c => c.id === cowData.id);
      if (idx !== -1) {
        cows[idx] = { ...cows[idx], ...cowData, updatedAt: new Date().toISOString() };
      } else {
        cows.push(cowData);
      }
    } else {
      cowData.id = 'cow_' + Date.now();
      cowData.createdAt = new Date().toISOString();
      cowData.updatedAt = new Date().toISOString();
      cows.push(cowData);
    }
    localStorage.setItem(DB_KEYS.COWS, JSON.stringify(cows));
    return cowData;
  }

  async archiveCow(cowId) {
    const cows = JSON.parse(localStorage.getItem(DB_KEYS.COWS) || '[]');
    const idx = cows.findIndex(c => c.id === cowId);
    if (idx !== -1) {
      cows[idx].status = 'archived';
      cows[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(DB_KEYS.COWS, JSON.stringify(cows));
    }
    if (this.isLiveFirebase) {
      await this.firestore.collection('cows').doc(cowId).update({ status: 'archived' });
    }
    return true;
  }

  // Milk Records CRUD
  async getMilkRecords(farmId, date = null) {
    if (this.isLiveFirebase) {
      let query = this.firestore.collection('milk_records').where('farmId', '==', farmId);
      if (date) query = query.where('date', '==', date);
      const snap = await query.get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    const records = JSON.parse(localStorage.getItem(DB_KEYS.MILK) || '[]');
    let filtered = records.filter(r => r.farmId === farmId);
    if (date) {
      filtered = filtered.filter(r => r.date === date);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async checkDuplicateMilk(farmId, cowId, date, session, currentRecordId = null) {
    const records = await this.getMilkRecords(farmId, date);
    return records.some(r => 
      r.cowId === cowId && 
      r.date === date && 
      r.session === session && 
      (!currentRecordId || r.id !== currentRecordId)
    );
  }

  async saveMilkRecord(recordData) {
    if (recordData.quantityLitres < 0) {
      throw new Error("Milk quantity cannot be negative!");
    }

    // Check duplicate
    const isDup = await this.checkDuplicateMilk(
      recordData.farmId,
      recordData.cowId,
      recordData.date,
      recordData.session,
      recordData.id
    );
    if (isDup) {
      throw new Error(`DUPLICATE: A ${recordData.session} record for this cow on ${recordData.date} already exists!`);
    }

    if (this.isLiveFirebase) {
      if (recordData.id) {
        await this.firestore.collection('milk_records').doc(recordData.id).set(recordData, { merge: true });
        return recordData;
      } else {
        const docRef = await this.firestore.collection('milk_records').add({
          ...recordData,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, ...recordData };
      }
    }

    const records = JSON.parse(localStorage.getItem(DB_KEYS.MILK) || '[]');
    if (recordData.id) {
      const idx = records.findIndex(r => r.id === recordData.id);
      if (idx !== -1) {
        records[idx] = { ...records[idx], ...recordData, updatedAt: new Date().toISOString() };
      } else {
        records.push(recordData);
      }
    } else {
      recordData.id = 'mr_' + Date.now();
      recordData.createdAt = new Date().toISOString();
      records.push(recordData);
    }
    localStorage.setItem(DB_KEYS.MILK, JSON.stringify(records));
    return recordData;
  }

  async deleteMilkRecord(recordId) {
    const records = JSON.parse(localStorage.getItem(DB_KEYS.MILK) || '[]');
    const filtered = records.filter(r => r.id !== recordId);
    localStorage.setItem(DB_KEYS.MILK, JSON.stringify(filtered));
    if (this.isLiveFirebase) {
      await this.firestore.collection('milk_records').doc(recordId).delete();
    }
    return true;
  }

  // Reminders
  async getReminders(farmId) {
    const raw = JSON.parse(localStorage.getItem(DB_KEYS.REMINDERS) || '[]');
    return raw.filter(r => r.farmId === farmId);
  }

  // Transactions (for dashboard stats)
  async getTransactions(farmId) {
    const raw = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
    return raw.filter(t => t.farmId === farmId);
  }

  // Save custom Firebase config
  setFirebaseConfig(cfg) {
    localStorage.setItem(DB_KEYS.FIREBASE_CONFIG, JSON.stringify(cfg));
    window.location.reload();
  }

  // Reset to default sample data
  resetSampleData() {
    localStorage.removeItem(DB_KEYS.COWS);
    localStorage.removeItem(DB_KEYS.MILK);
    localStorage.removeItem(DB_KEYS.FARM);
    localStorage.removeItem(DB_KEYS.USER);
    localStorage.removeItem(DB_KEYS.REMINDERS);
    localStorage.removeItem(DB_KEYS.TRANSACTIONS);
    this.initLocalSeedData();
    window.location.reload();
  }
}

const db = new CowCareDB();
window.cowCareDb = db;
