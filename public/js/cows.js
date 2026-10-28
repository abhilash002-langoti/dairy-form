// CowCare - Cow Management Module

const cowManager = {
  cows: [],
  currentFilter: 'all',
  searchQuery: '',
  editingCowId: null,

  async loadCows() {
    const farm = window.cowCareDb.getCurrentFarm();
    if (!farm) return;
    this.cows = await window.cowCareDb.getCows(farm.id);
    this.renderCows();
    this.updateCowDropdowns();
  },

  setFilter(status) {
    this.currentFilter = status;
    document.querySelectorAll('.cow-filter-chip').forEach(btn => {
      if (btn.getAttribute('data-status') === status) {
        btn.classList.add('bg-emerald-800', 'text-white');
        btn.classList.remove('bg-emerald-100', 'text-emerald-900');
      } else {
        btn.classList.remove('bg-emerald-800', 'text-white');
        btn.classList.add('bg-emerald-100', 'text-emerald-900');
      }
    });
    this.renderCows();
  },

  setSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.renderCows();
  },

  getFilteredCows() {
    return this.cows.filter(cow => {
      // Status filter
      if (this.currentFilter !== 'all') {
        if (cow.status !== this.currentFilter) return false;
      } else {
        // If 'all', hide archived/deceased unless specifically filtered
        if (cow.status === 'archived' || cow.status === 'deceased') return false;
      }

      // Search filter
      if (this.searchQuery) {
        const tagMatch = (cow.tagId || '').toLowerCase().includes(this.searchQuery);
        const nameMatch = (cow.name || '').toLowerCase().includes(this.searchQuery);
        const breedMatch = (cow.breed || '').toLowerCase().includes(this.searchQuery);
        return tagMatch || nameMatch || breedMatch;
      }
      return true;
    });
  },

  renderCows() {
    const container = document.getElementById('cowsGrid');
    if (!container) return;

    const filtered = this.getFilteredCows();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200">
          <div class="text-4xl mb-3">🐄</div>
          <h3 class="text-lg font-bold text-stone-800">No cows found</h3>
          <p class="text-stone-500 text-sm mt-1">Try adjusting your filters or click "+ Add New Cow" to record a cow.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(cow => {
      const statusBadge = this.getStatusBadge(cow.status);
      const defaultImg = "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80";
      const photoSrc = cow.photoUrl || defaultImg;
      const ageText = this.calculateAge(cow.dob);

      return `
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
          <div>
            <div class="relative h-44 w-full bg-stone-100 overflow-hidden">
              <img src="${photoSrc}" alt="${cow.name}" class="w-full h-full object-cover transition duration-300 hover:scale-105" onerror="this.src='${defaultImg}'"/>
              <div class="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white font-mono text-xs px-2.5 py-1 rounded-full font-bold tracking-wider">
                🏷️ ${cow.tagId}
              </div>
              <div class="absolute top-3 right-3">
                ${statusBadge}
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-center justify-between mb-1">
                <h3 class="text-xl font-bold text-stone-900">${cow.name}</h3>
                <span class="text-xs bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded border border-emerald-200">${cow.breed}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs text-stone-600 mt-3 pt-3 border-t border-stone-100">
                <div>
                  <span class="text-stone-400 block">Gender & Age:</span>
                  <span class="font-semibold text-stone-800">${cow.gender || 'Female'} • ${ageText}</span>
                </div>
                <div>
                  <span class="text-stone-400 block">Purchase Cost:</span>
                  <span class="font-semibold text-stone-800">₹${(cow.purchaseCost || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              ${cow.notes ? `
                <p class="text-xs text-stone-500 mt-2.5 line-clamp-2 italic bg-stone-50 p-2 rounded-lg">
                  "${cow.notes}"
                </p>
              ` : ''}
            </div>
          </div>

          <div class="p-4 pt-0 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2 mt-2">
            <button onclick="cowManager.viewCowDetail('${cow.id}')" class="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-emerald-100/50">
              <span>View Details</span> ➔
            </button>
            <div class="flex items-center gap-1">
              <button onclick="cowManager.openEditModal('${cow.id}')" class="text-xs font-medium text-stone-600 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-200" title="Edit Cow">
                ✏️ Edit
              </button>
              <button onclick="cowManager.confirmArchive('${cow.id}')" class="text-xs font-medium text-amber-700 hover:text-amber-900 p-1.5 rounded-lg hover:bg-amber-100" title="Archive Cow">
                📦 Archive
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  getStatusBadge(status) {
    const badges = {
      active: `<span class="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Active / Lactating</span>`,
      pregnant: `<span class="bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Pregnant</span>`,
      dry: `<span class="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Dry</span>`,
      sick: `<span class="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Sick / In Treatment</span>`,
      sold: `<span class="bg-stone-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Sold</span>`,
      deceased: `<span class="bg-stone-900 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Deceased</span>`,
      archived: `<span class="bg-stone-500 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">Archived</span>`
    };
    return badges[status] || `<span class="bg-stone-400 text-white text-xs px-2 py-0.5 rounded-full">${status}</span>`;
  },

  calculateAge(dobString) {
    if (!dobString) return 'Unknown age';
    const birth = new Date(dobString);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months < 12) {
      return `${Math.max(0, months)} mo`;
    }
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years} yr ${remMonths} mo` : `${years} yrs`;
  },

  updateCowDropdowns() {
    const dropdown = document.getElementById('milkCowSelect');
    if (!dropdown) return;
    const activeCows = this.cows.filter(c => c.status === 'active' || c.status === 'pregnant');
    dropdown.innerHTML = `
      <option value="">-- Choose a cow --</option>
      ${activeCows.map(c => `
        <option value="${c.id}" data-tag="${c.tagId}">${c.tagId} — ${c.name} (${c.breed})</option>
      `).join('')}
    `;
  },

  openAddModal() {
    this.editingCowId = null;
    document.getElementById('cowModalTitle').textContent = t('add_cow');
    document.getElementById('cowForm').reset();
    document.getElementById('cowModalId').value = '';
    document.getElementById('cowPhotoPreview').src = '';
    document.getElementById('cowPhotoPreviewContainer').classList.add('hidden');
    document.getElementById('cowModal').classList.remove('hidden');
  },

  openEditModal(cowId) {
    const cow = this.cows.find(c => c.id === cowId);
    if (!cow) return;
    this.editingCowId = cowId;
    document.getElementById('cowModalTitle').textContent = `${t('edit')}: ${cow.tagId} (${cow.name})`;
    document.getElementById('cowModalId').value = cow.id;
    document.getElementById('cowTagInput').value = cow.tagId;
    document.getElementById('cowNameInput').value = cow.name;
    document.getElementById('cowBreedInput').value = cow.breed;
    document.getElementById('cowDobInput').value = cow.dob || '';
    document.getElementById('cowGenderInput').value = cow.gender || 'Female';
    document.getElementById('cowStatusInput').value = cow.status || 'active';
    document.getElementById('cowPurchaseDateInput').value = cow.purchaseDate || '';
    document.getElementById('cowPurchaseCostInput').value = cow.purchaseCost || '';
    document.getElementById('cowNotesInput').value = cow.notes || '';
    document.getElementById('cowPhotoUrlInput').value = cow.photoUrl || '';

    if (cow.photoUrl) {
      document.getElementById('cowPhotoPreview').src = cow.photoUrl;
      document.getElementById('cowPhotoPreviewContainer').classList.remove('hidden');
    } else {
      document.getElementById('cowPhotoPreviewContainer').classList.add('hidden');
    }

    document.getElementById('cowModal').classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('cowModal').classList.add('hidden');
  },

  async handleFormSubmit(e) {
    e.preventDefault();
    const farm = window.cowCareDb.getCurrentFarm();
    if (!farm) return;

    const id = document.getElementById('cowModalId').value;
    const tagId = document.getElementById('cowTagInput').value.trim().toUpperCase();
    const name = document.getElementById('cowNameInput').value.trim();
    const breed = document.getElementById('cowBreedInput').value;
    const dob = document.getElementById('cowDobInput').value;
    const gender = document.getElementById('cowGenderInput').value;
    const status = document.getElementById('cowStatusInput').value;
    const purchaseDate = document.getElementById('cowPurchaseDateInput').value;
    const purchaseCost = parseFloat(document.getElementById('cowPurchaseCostInput').value) || 0;
    const notes = document.getElementById('cowNotesInput').value.trim();
    const photoUrl = document.getElementById('cowPhotoUrlInput').value.trim();

    // Check duplicate tag ID on same farm
    const duplicateTag = this.cows.some(c => c.tagId === tagId && c.id !== id);
    if (duplicateTag) {
      app.showToast(`Error: A cow with Tag ID "${tagId}" already exists on your farm!`, 'error');
      return;
    }

    if (purchaseCost < 0) {
      app.showToast("Purchase cost cannot be negative.", "error");
      return;
    }

    const cowData = {
      id: id || undefined,
      farmId: farm.id,
      tagId,
      name,
      breed,
      dob,
      gender,
      status,
      purchaseDate,
      purchaseCost,
      notes,
      photoUrl
    };

    try {
      await window.cowCareDb.saveCow(cowData);
      app.showToast(t('success_cow_added'), 'success');
      this.closeModal();
      await this.loadCows();
      app.updateDashboardKPIs();
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  },

  confirmArchive(cowId) {
    const cow = this.cows.find(c => c.id === cowId);
    if (!cow) return;

    if (confirm(`${t('confirm_archive')} (${cow.tagId} - ${cow.name})`)) {
      window.cowCareDb.archiveCow(cowId).then(() => {
        app.showToast(`Cow ${cow.tagId} archived successfully.`, 'success');
        this.loadCows();
        app.updateDashboardKPIs();
      });
    }
  },

  async viewCowDetail(cowId) {
    const cow = this.cows.find(c => c.id === cowId);
    if (!cow) return;
    const farm = window.cowCareDb.getCurrentFarm();
    const allMilk = await window.cowCareDb.getMilkRecords(farm.id);
    const cowMilk = allMilk.filter(m => m.cowId === cowId);

    const totalLitres = cowMilk.reduce((sum, m) => sum + (m.quantityLitres || 0), 0);
    const morningCount = cowMilk.filter(m => m.session === 'morning').length;

    const modalContent = `
      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/3">
          <img src="${cow.photoUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80'}" class="w-full h-56 object-cover rounded-xl shadow-md border border-stone-200"/>
          <div class="mt-3 text-center">
            <span class="inline-block px-3 py-1 bg-stone-900 text-white font-mono font-bold rounded-full text-xs">
              🏷️ ${cow.tagId}
            </span>
            <div class="mt-2">${this.getStatusBadge(cow.status)}</div>
          </div>
        </div>

        <div class="md:w-2/3">
          <h2 class="text-2xl font-bold text-stone-900">${cow.name}</h2>
          <p class="text-sm text-stone-500">${cow.breed} • ${cow.gender} • Born: ${cow.dob || 'N/A'} (${this.calculateAge(cow.dob)})</p>

          <div class="grid grid-cols-2 gap-3 mt-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span class="text-xs text-stone-400 block">Purchase Date</span>
              <span class="font-semibold text-stone-800 text-sm">${cow.purchaseDate || 'N/A'}</span>
            </div>
            <div>
              <span class="text-xs text-stone-400 block">Purchase Cost</span>
              <span class="font-semibold text-stone-800 text-sm">₹${(cow.purchaseCost || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span class="text-xs text-stone-400 block">Total Milk Recorded</span>
              <span class="font-bold text-emerald-700 text-base">${totalLitres.toFixed(1)} Litres</span>
            </div>
            <div>
              <span class="text-xs text-stone-400 block">Recorded Milking Sessions</span>
              <span class="font-semibold text-stone-800 text-sm">${cowMilk.length} sessions</span>
            </div>
          </div>

          ${cow.notes ? `
            <div class="mt-4">
              <h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Farmer Notes</h4>
              <p class="text-sm text-stone-700 mt-1 bg-amber-50/50 p-3 rounded-lg border border-amber-200/50 italic">${cow.notes}</p>
            </div>
          ` : ''}

          <div class="mt-5 flex gap-2">
            <button onclick="cowManager.openEditModal('${cow.id}'); document.getElementById('cowDetailModal').classList.add('hidden');" class="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs px-4 py-2 rounded-lg">
              ✏️ Edit Information
            </button>
            <button onclick="document.getElementById('cowDetailModal').classList.add('hidden')" class="bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs px-4 py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('cowDetailBody').innerHTML = modalContent;
    document.getElementById('cowDetailModal').classList.remove('hidden');
  }
};

window.cowManager = cowManager;
