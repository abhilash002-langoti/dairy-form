// CowCare - Authentication Module

const authManager = {
  currentUser: null,
  currentFarm: null,

  init() {
    this.currentUser = window.cowCareDb.getCurrentUser();
    this.currentFarm = window.cowCareDb.getCurrentFarm();
    this.updateUIState();
  },

  isLoggedIn() {
    return this.currentUser !== null;
  },

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    if (window.cowCareDb.isLiveFirebase) {
      const userCred = await window.cowCareDb.auth.signInWithEmailAndPassword(email, password);
      const userDoc = await window.cowCareDb.firestore.collection('users').doc(userCred.user.uid).get();
      const userData = userDoc.data();
      const farmDoc = await window.cowCareDb.firestore.collection('farms').doc(userData.farmId).get();
      
      this.currentUser = { uid: userCred.user.uid, email, ...userData };
      this.currentFarm = { id: farmDoc.id, ...farmDoc.data() };
    } else {
      // Local authentication
      const storedUser = window.cowCareDb.getCurrentUser();
      if (storedUser && storedUser.email.toLowerCase() === email.toLowerCase()) {
        this.currentUser = storedUser;
        this.currentFarm = window.cowCareDb.getCurrentFarm();
      } else {
        // If first-time demo login with any credentials, create session
        this.currentUser = {
          uid: 'user_' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          farmId: 'farm_' + Date.now(),
          role: 'owner'
        };
        this.currentFarm = {
          id: this.currentUser.farmId,
          name: this.currentUser.displayName + "'s Dairy Farm",
          phone: "+91 98000 00000",
          village: "Karnataka",
          district: "Bengaluru",
          state: "Karnataka"
        };
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(this.currentUser));
        localStorage.setItem(DB_KEYS.FARM, JSON.stringify(this.currentFarm));
      }
    }

    this.updateUIState();
    return this.currentUser;
  },

  async register(farmName, farmerName, email, password, phone, village) {
    if (!farmName || !farmerName || !email || !password) {
      throw new Error("Please fill in all required fields.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    if (window.cowCareDb.isLiveFirebase) {
      const userCred = await window.cowCareDb.auth.createUserWithEmailAndPassword(email, password);
      const farmRef = await window.cowCareDb.firestore.collection('farms').add({
        name: farmName,
        ownerUid: userCred.user.uid,
        phone: phone || '',
        village: village || '',
        district: 'Bengaluru Rural',
        state: 'Karnataka',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      const userData = {
        uid: userCred.user.uid,
        email: email,
        displayName: farmerName,
        farmId: farmRef.id,
        role: 'owner',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await window.cowCareDb.firestore.collection('users').doc(userCred.user.uid).set(userData);
      this.currentUser = userData;
      this.currentFarm = { id: farmRef.id, name: farmName, phone, village };
    } else {
      // Local registration
      const farmId = 'farm_' + Date.now();
      const uid = 'user_' + Date.now();

      this.currentFarm = {
        id: farmId,
        name: farmName,
        ownerUid: uid,
        phone: phone || '',
        village: village || '',
        district: 'Bengaluru Rural',
        state: 'Karnataka',
        createdAt: new Date().toISOString()
      };

      this.currentUser = {
        uid: uid,
        email: email,
        displayName: farmerName,
        farmId: farmId,
        role: 'owner',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(DB_KEYS.FARM, JSON.stringify(this.currentFarm));
      localStorage.setItem(DB_KEYS.USER, JSON.stringify(this.currentUser));
    }

    this.updateUIState();
    return this.currentUser;
  },

  async resetPassword(email) {
    if (!email) {
      throw new Error("Please provide your registered email address.");
    }
    if (window.cowCareDb.isLiveFirebase) {
      await window.cowCareDb.auth.sendPasswordResetEmail(email);
    }
    return true;
  },

  logout() {
    this.currentUser = null;
    this.currentFarm = null;
    localStorage.removeItem(DB_KEYS.USER);
    if (window.cowCareDb.isLiveFirebase) {
      window.cowCareDb.auth.signOut();
    }
    this.updateUIState();
  },

  updateUIState() {
    const authOverlay = document.getElementById('authOverlay');
    const appShell = document.getElementById('appShell');
    const userDisplay = document.getElementById('userDisplayName');
    const farmDisplay = document.getElementById('farmDisplayName');

    if (this.currentUser) {
      if (authOverlay) authOverlay.classList.add('hidden');
      if (appShell) appShell.classList.remove('hidden');
      if (userDisplay) userDisplay.textContent = this.currentUser.displayName || this.currentUser.email;
      if (farmDisplay) farmDisplay.textContent = this.currentFarm ? this.currentFarm.name : "My Dairy Farm";
    } else {
      if (authOverlay) authOverlay.classList.remove('hidden');
      if (appShell) appShell.classList.add('hidden');
    }
  }
};

window.authManager = authManager;
