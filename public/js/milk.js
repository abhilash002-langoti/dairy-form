// CowCare - Milk Production Module

const milkManager = {
  currentDate: new Date().toISOString().split('T')[0],
  milkRecords: [],
  editingMilkId: null,

  async loadMilkRecords() {
    const farm = window.cowCareDb.getCurrentFarm();
    if (!farm) return;

    this.milkRecords = await window.cowCareDb.getMilkRecords(farm.id);
    this.renderDailyMilkSheet();
    this.renderMilkHistory();
    app.updateDashboardKPIs();
  },

  setDate(dateStr) {
    this.currentDate = dateStr;
    const dateInput = document.getElementById('milkDateFilter');
    if (dateInput) dateInput.value = dateStr;
    const formDateInput = document.getElementById('milkFormDate');
    if (formDateInput) formDateInput.value = dateStr;
    this.renderDailyMilkSheet();
  },

  renderDailyMilkSheet() {
    const container = document.getElementById('dailyMilkTableBody');
    if (!container) return;

    const farm = window.cowCareDb.getCurrentFarm();
    const cows = window.cowManager.cows.filter(c => c.status === 'active' || c.status === 'pregnant');

    const dayRecords = this.milkRecords.filter(r => r.date === this.currentDate);

    let totalMorning = 0;
    let totalEvening = 0;

    const rowsHtml = cows.map(cow => {
      const morningRecord = dayRecords.find(r => r.cowId === cow.id && r.session === 'morning');
      const eveningRecord = dayRecords.find(r => r.cowId === cow.id && r.session === 'evening');

      const morningQty = morningRecord ? morningRecord.quantityLitres : 0;
      const eveningQty = eveningRecord ? eveningRecord.quantityLitres : 0;
      const cowDailyTotal = morningQty + eveningQty;

      totalMorning += morningQty;
      totalEvening += eveningQty;

      return `
        <tr class="hover:bg-stone-50 border-b border-stone-200">
          <td class="py-3 px-4 font-mono font-bold text-xs text-stone-900">${cow.tagId}</td>
          <td class="py-3 px-4 font-semibold text-sm text-stone-800">${cow.name} <span class="text-xs text-stone-400 font-normal">(${cow.breed})</span></td>
          <td class="py-3 px-4 text-center">
            ${morningRecord ? `
              <span class="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-xs">
                🌅 ${morningQty.toFixed(1)} L
              </span>
            ` : `
              <button onclick="milkManager.quickRecord('${cow.id}', 'morning')" class="text-xs text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded border border-dashed border-stone-300">
                + Add
              </button>
            `}
          </td>
          <td class="py-3 px-4 text-center">
            ${eveningRecord ? `
              <span class="inline-flex items-center gap-1 font-semibold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 text-xs">
                🌙 ${eveningQty.toFixed(1)} L
              </span>
            ` : `
              <button onclick="milkManager.quickRecord('${cow.id}', 'evening')" class="text-xs text-stone-400 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded border border-dashed border-stone-300">
                + Add
              </button>
            `}
          </td>
          <td class="py-3 px-4 text-right font-bold text-sm ${cowDailyTotal > 0 ? 'text-stone-900' : 'text-stone-300'}">
            ${cowDailyTotal > 0 ? cowDailyTotal.toFixed(1) + ' L' : '0.0 L'}
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = rowsHtml || `<tr><td colspan="5" class="py-6 text-center text-stone-400 text-sm">No active cows recorded yet.</td></tr>`;

    // Update Totals
    const farmGrandTotal = totalMorning + totalEvening;
    document.getElementById('morningTotalBadge').textContent = `${totalMorning.toFixed(1)} L`;
    document.getElementById('eveningTotalBadge').textContent = `${totalEvening.toFixed(1)} L`;
    document.getElementById('dailyGrandTotalBadge').textContent = `${farmGrandTotal.toFixed(1)} L`;
  },

  renderMilkHistory() {
    const container = document.getElementById('milkHistoryTableBody');
    if (!container) return;

    if (this.milkRecords.length === 0) {
      container.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-stone-400 text-sm">No milk records entered yet.</td></tr>`;
      return;
    }

    container.innerHTML = this.milkRecords.slice(0, 15).map(record => {
      const sessionBadge = record.session === 'morning' 
        ? `<span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs font-semibold">🌅 Morning</span>`
        : `<span class="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded text-xs font-semibold">🌙 Evening</span>`;

      return `
        <tr class="hover:bg-stone-50 border-b border-stone-200 text-xs">
          <td class="py-2.5 px-4 text-stone-600">${record.date}</td>
          <td class="py-2.5 px-4 font-mono font-bold text-stone-900">${record.cowTag}</td>
          <td class="py-2.5 px-4">${sessionBadge}</td>
          <td class="py-2.5 px-4 font-bold text-emerald-800 text-sm">${(record.quantityLitres || 0).toFixed(1)} Litres</td>
          <td class="py-2.5 px-4 text-stone-500">${record.fatContent ? record.fatContent + '%' : '—'}</td>
          <td class="py-2.5 px-4 text-right">
            <button onclick="milkManager.openEditModal('${record.id}')" class="text-stone-500 hover:text-stone-900 font-medium px-2 py-1 rounded">✏️ Edit</button>
            <button onclick="milkManager.confirmDelete('${record.id}')" class="text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  quickRecord(cowId, session) {
    this.openAddModal();
    const cowSelect = document.getElementById('milkCowSelect');
    if (cowSelect) cowSelect.value = cowId;
    const sessionRadio = document.querySelector(`input[name="milkSession"][value="${session}"]`);
    if (sessionRadio) sessionRadio.checked = true;
    const qtyInput = document.getElementById('milkQuantityInput');
    if (qtyInput) qtyInput.focus();
  },

  openAddModal() {
    this.editingMilkId = null;
    document.getElementById('milkModalTitle').textContent = t('record_milk');
    document.getElementById('milkForm').reset();
    document.getElementById('milkModalRecordId').value = '';
    document.getElementById('milkFormDate').value = this.currentDate;
    document.getElementById('milkModal').classList.remove('hidden');
  },

  openEditModal(recordId) {
    const record = this.milkRecords.find(r => r.id === recordId);
    if (!record) return;

    this.editingMilkId = recordId;
    document.getElementById('milkModalTitle').textContent = `Edit Milk Record: ${record.cowTag}`;
    document.getElementById('milkModalRecordId').value = record.id;
    document.getElementById('milkFormDate').value = record.date;
    document.getElementById('milkCowSelect').value = record.cowId;
    
    const radio = document.querySelector(`input[name="milkSession"][value="${record.session}"]`);
    if (radio) radio.checked = true;

    document.getElementById('milkQuantityInput').value = record.quantityLitres;
    document.getElementById('milkFatInput').value = record.fatContent || '';
    document.getElementById('milkSnfInput').value = record.snf || '';
    document.getElementById('milkNotesInput').value = record.notes || '';

    document.getElementById('milkModal').classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('milkModal').classList.add('hidden');
  },

  async handleFormSubmit(e) {
    e.preventDefault();
    const farm = window.cowCareDb.getCurrentFarm();
    if (!farm) return;

    const recordId = document.getElementById('milkModalRecordId').value;
    const date = document.getElementById('milkFormDate').value;
    const cowSelect = document.getElementById('milkCowSelect');
    const cowId = cowSelect.value;
    const selectedOption = cowSelect.options[cowSelect.selectedIndex];
    const cowTag = selectedOption ? selectedOption.getAttribute('data-tag') : '';
    
    const sessionInput = document.querySelector('input[name="milkSession"]:checked');
    const session = sessionInput ? sessionInput.value : 'morning';

    const quantityLitres = parseFloat(document.getElementById('milkQuantityInput').value);
    const fatContent = parseFloat(document.getElementById('milkFatInput').value) || null;
    const snf = parseFloat(document.getElementById('milkSnfInput').value) || null;
    const notes = document.getElementById('milkNotesInput').value.trim();

    if (!cowId) {
      app.showToast("Please choose a cow.", "error");
      return;
    }

    if (isNaN(quantityLitres) || quantityLitres <= 0) {
      app.showToast(t('negative_warning'), "error");
      return;
    }

    const recordData = {
      id: recordId || undefined,
      farmId: farm.id,
      cowId,
      cowTag,
      date,
      session,
      quantityLitres,
      fatContent,
      snf,
      notes,
      recordedBy: window.cowCareDb.getCurrentUser()?.displayName || "Farmer"
    };

    try {
      await window.cowCareDb.saveMilkRecord(recordData);
      app.showToast(t('success_milk_added'), "success");
      this.closeModal();
      await this.loadMilkRecords();
    } catch (err) {
      if (err.message.includes("DUPLICATE")) {
        if (confirm(`${t('duplicate_warning')}\n(${cowTag} on ${date} [${session}])`)) {
          // Find existing record and open it for edit
          const existing = this.milkRecords.find(r => r.cowId === cowId && r.date === date && r.session === session);
          if (existing) {
            this.openEditModal(existing.id);
          }
        }
      } else {
        app.showToast(err.message, "error");
      }
    }
  },

  confirmDelete(recordId) {
    if (confirm("Are you sure you want to delete this milk record? This cannot be undone.")) {
      window.cowCareDb.deleteMilkRecord(recordId).then(() => {
        app.showToast("Milk record deleted.", "success");
        this.loadMilkRecords();
      });
    }
  }
};

window.milkManager = milkManager;
