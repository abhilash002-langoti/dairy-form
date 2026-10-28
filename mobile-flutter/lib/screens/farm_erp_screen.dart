import 'package:flutter/material.dart';

class FarmErpScreen extends StatefulWidget {
  const FarmErpScreen({super.key});

  @override
  State<FarmErpScreen> createState() => _FarmErpScreenState();
}

class _FarmErpScreenState extends State<FarmErpScreen> {
  String _activeTab = 'dashboard';
  String _userRole = 'admin'; // 'admin' or 'staff'
  String _userName = 'Sardar Gurmeet Singh';

  void _switchTab(String tab) {
    if (_userRole == 'staff' && (tab == 'expenses' || tab == 'reports')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🔒 Restricted: Financials visible to Farm Owner (Admin) only.')),
      );
      return;
    }
    setState(() {
      _activeTab = tab;
    });
    Navigator.of(context).pop(); // close drawer
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_getTabTitle(_activeTab)),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.account_circle),
            onSelected: (role) {
              setState(() {
                _userRole = role;
                _userName = role == 'admin' ? 'Sardar Gurmeet Singh (Admin)' : 'Ramesh Kumar (Staff)';
                if (role == 'staff' && (_activeTab == 'expenses' || _activeTab == 'reports')) {
                  _activeTab = 'dashboard';
                }
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Switched to ${role.toUpperCase()} mode')),
              );
            },
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'admin', child: Text('👑 Owner (Admin)')),
              PopupMenuItem(value: 'staff', child: Text('👷 Worker (Staff)')),
            ],
          )
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(color: Color(0xFF14532D)),
              accountName: Text(_userName, style: const TextStyle(fontWeight: FontWeight.bold)),
              accountEmail: Text('Role: ${_userRole.toUpperCase()}', style: const TextStyle(color: Color(0xFFBBF7D0))),
              currentAccountPicture: CircleAvatar(
                backgroundColor: const Color(0xFF16A34A),
                child: Text(_userName[0], style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              ),
            ),
            _drawerTile('Dashboard', 'dashboard', Icons.dashboard_outlined),
            _drawerTile('Cows (Master Record)', 'cows', Icons.pets_outlined),
            _drawerTile('Milk Production', 'milk', Icons.water_drop_outlined),
            _drawerTile('Medicine & Health', 'medicine', Icons.medication_outlined),
            _drawerTile('Cow Feed & Rations', 'feed', Icons.grass_outlined),
            _drawerTile('Expenses (Admin)', 'expenses', Icons.attach_money_outlined, isLocked: _userRole == 'staff'),
            _drawerTile('Reports & P&L (Admin)', 'reports', Icons.bar_chart_outlined, isLocked: _userRole == 'staff'),
            _drawerTile('Settings', 'settings', Icons.settings_outlined),
          ],
        ),
      ),
      body: _buildTabBody(),
    );
  }

  Widget _drawerTile(String title, String tabKey, IconData icon, {bool isLocked = false}) {
    final isSelected = _activeTab === tabKey;
    return ListTile(
      leading: Icon(icon, color: isLocked ? Colors.grey : (isSelected ? const Color(0xFF16A34A) : Colors.black87)),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isLocked ? Colors.grey : Colors.black87,
        ),
      ),
      trailing: isLocked ? const Icon(Icons.lock, size: 16, color: Colors.grey) : null,
      selected: isSelected,
      onTap: () => _switchTab(tabKey),
    );
  }

  String _getTabTitle(String tab) {
    switch (tab) {
      case 'dashboard': return 'Farm Dashboard';
      case 'cows': return 'Cattle Master Registry';
      case 'milk': return 'Daily Milk Production';
      case 'medicine': return 'Medicines & Health';
      case 'feed': return 'Cow Feed Inventory';
      case 'expenses': return 'Farm Expenses';
      case 'reports': return 'Profit & Loss Reports';
      case 'settings': return 'Farm Settings';
      default: return 'Farm Management';
    }
  }

  Widget _buildTabBody() {
    switch (_activeTab) {
      case 'dashboard':
        return _buildDashboard();
      case 'cows':
        return _buildCowsList();
      case 'milk':
        return _buildMilkList();
      case 'medicine':
        return _buildMedicineList();
      case 'feed':
        return _buildFeedList();
      case 'expenses':
        return _buildExpensesList();
      case 'reports':
        return _buildReportsList();
      case 'settings':
        return _buildSettingsList();
      default:
        return const Center(child: Text('Section under construction'));
    }
  }

  Widget _buildDashboard() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // KPI Grid
          Row(
            children: [
              Expanded(
                child: _kpiCard('Today\'s Milk', '74.0 L', '🌅 48L | 🌇 26L', const Color(0xFF16A34A)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _kpiCard('Total Cattle', '6', 'In Milk: 3 • Sick: 1', const Color(0xFF0284C7)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _kpiCard('Today\'s Expenses', '₹3,097.50', 'Feed, Labour, Electricity', const Color(0xFFDC2626)),

          const SizedBox(height: 20),
          const Text('⚠️ Farm Alerts & Reminders', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 10),

          // Active Withdrawal Alert Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFEE2E2),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFFCA5A5)),
            ),
            child: const Row(
              children: [
                Icon(Icons.block, color: Color(0xFF991B1B), size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('WITHDRAWAL ACTIVE: COW AMR-005', style: TextStyle(color: Color(0xFF991B1B), fontWeight: FontWeight.bold)),
                      Text('Treated with Amoxicillin. Milk cannot be sold until Oct 30.', style: TextStyle(fontSize: 12, color: Color(0xFF991B1B))),
                    ],
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Low feed alert
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF3C7),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFFDE68A)),
            ),
            child: const Row(
              children: [
                Icon(Icons.warning_amber_rounded, color: Color(0xFF92400E), size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Low Stock: Concentrate Pellets', style: TextStyle(color: Color(0xFF92400E), fontWeight: FontWeight.bold)),
                      Text('180 kg remaining. Threshold: 200 kg.', style: TextStyle(fontSize: 12, color: Color(0xFF92400E))),
                    ],
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _kpiCard(String label, String value, String sub, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(height: 4),
          Text(sub, style: const TextStyle(fontSize: 11, color: Colors.black54)),
        ],
      ),
    );
  }

  Widget _buildCowsList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Cattle Master List (6)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A), foregroundColor: Colors.white),
              onPressed: () {},
              icon: const Icon(Icons.add, size: 16),
              label: const Text('Add Cow'),
            )
          ],
        ),
        const SizedBox(height: 12),
        _cowTile('AMR-001', 'Kamadhenu', 'Gir (Vedic Desi)', 'MILKING', '16.5 L/day'),
        _cowTile('AMR-002', 'Gauri', 'Sahiwal', 'PREGNANT', '14.0 L/day'),
        _cowTile('AMR-003', 'Yamuna', 'Murrah Buffalo', 'MILKING', '18.0 L/day'),
        _cowTile('AMR-004', 'Radha', 'Gir', 'MILKING', '13.5 L/day'),
        _cowTile('AMR-005', 'Kalyani', 'Red Sindhi', 'SICK', '11.0 L/day', isAlert: true),
        _cowTile('AMR-006', 'Nandi Rani', 'Murrah Buffalo', 'DRY', '0.0 L/day'),
      ],
    );
  }

  Widget _cowTile(String tag, String name, String breed, String status, String yieldAvg, {bool isAlert = false}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: isAlert ? Colors.red.shade100 : const Color(0xFFDCFCE7),
          child: Text(tag.substring(4), style: TextStyle(fontWeight: FontWeight.bold, color: isAlert ? Colors.red : const Color(0xFF166534))),
        ),
        title: Text('$tag - $name', style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text('$breed • Avg $yieldAvg'),
        trailing: Chip(
          label: Text(status, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
          backgroundColor: isAlert ? Colors.red.shade100 : const Color(0xFFDCFCE7),
        ),
      ),
    );
  }

  Widget _buildMilkList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Daily Milk Yield Entries', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A), foregroundColor: Colors.white),
              onPressed: () {},
              icon: const Icon(Icons.add, size: 16),
              label: const Text('Log Milk'),
            )
          ],
        ),
        const SizedBox(height: 12),
        const ListTile(title: Text('AMR-001 (Kamadhenu)'), subtitle: Text('Morning: 9.5L • Evening: 7.0L • Fat 4.6%'), trailing: Text('16.5 L', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF16A34A)))),
        const Divider(),
        const ListTile(title: Text('AMR-002 (Gauri)'), subtitle: Text('Morning: 8.0L • Evening: 6.0L • Fat 4.4%'), trailing: Text('14.0 L', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF16A34A)))),
        const Divider(),
        const ListTile(title: Text('AMR-003 (Yamuna Buffalo)'), subtitle: Text('Morning: 10.5L • Evening: 7.5L • Fat 7.6%'), trailing: Text('18.0 L', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF16A34A)))),
      ],
    );
  }

  Widget _buildMedicineList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Veterinary Treatments & Withdrawal', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Card(
          color: const Color(0xFFFEE2E2),
          child: ListTile(
            leading: const Icon(Icons.medication, color: Colors.red),
            title: const Text('AMR-005 (Kalyani) - Mastitis', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: const Text('Amoxicillin LA 15ml • Dr. Ramesh BVSc'),
            trailing: const Text('WITHDRAWAL\nUNTIL OCT 30', textAlign: TextAlign.right, style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 11)),
          ),
        ),
        const SizedBox(height: 16),
        const Text('Medicine Inventory Stock', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        const ListTile(title: Text('Amoxicillin LA (100ml)'), subtitle: Text('Type: Antibiotic • Exp: 2027-08'), trailing: Text('3 vials', style: TextStyle(fontWeight: FontWeight.bold))),
        const Divider(),
        const ListTile(title: Text('Calcium Borogluconate 450ml'), subtitle: Text('Type: Vitamin • Exp: 2026-11 (NEAR EXPIRY)'), trailing: Text('1 bottle ⚠️', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red))),
      ],
    );
  }

  Widget _buildFeedList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Cow Feed Rations & Cost per Litre', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        const Card(
          child: ListTile(
            title: Text('Feed Cost per Litre of Milk'),
            subtitle: Text('Calculated against 74L daily production'),
            trailing: Text('₹25.64 / L', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF0284C7))),
          ),
        ),
        const SizedBox(height: 16),
        const Text('Feed Stock Available', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        const ListTile(title: Text('Green Napier & Sorghum'), subtitle: Text('Green Fodder • Alert: 300kg'), trailing: Text('1,450 kg', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green))),
        const Divider(),
        const ListTile(title: Text('Concentrate Pellets (22% Protein)'), subtitle: Text('Pellets • Alert: 200kg'), trailing: Text('180 kg ⚠️', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red))),
      ],
    );
  }

  Widget _buildExpensesList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text('Expenses & Accounts (Admin Only)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        SizedBox(height: 10),
        ListTile(title: Text('Daily Feed Consumption'), subtitle: Text('Feed • Internal Stock Debit'), trailing: Text('₹1,897.50', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red))),
        Divider(),
        ListTile(title: Text('Daily Farm Hands (2 Workers)'), subtitle: Text('Labour • Milking & Cleaning'), trailing: Text('₹1,200.00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red))),
        Divider(),
        ListTile(title: Text('Dr. Ramesh BVSc'), subtitle: Text('Medicine • Mastitis treatment for AMR-005'), trailing: Text('₹650.00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red))),
      ],
    );
  }

  Widget _buildReportsList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text('Monthly Profit & Loss Report', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        SizedBox(height: 10),
        Card(
          child: ListTile(
            title: Text('Gross Milk Sales Income'),
            subtitle: Text('71.0 Litres Sold Today'),
            trailing: Text('₹4,815.00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 16)),
          ),
        ),
        Card(
          child: ListTile(
            title: Text('Total Recorded Expenses'),
            subtitle: Text('Feed, Labour, Vet & Utilities'),
            trailing: Text('₹3,747.50', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red, fontSize: 16)),
          ),
        ),
        Card(
          color: Color(0xFFF0FDF4),
          child: ListTile(
            title: Text('Net Operating Margin'),
            subtitle: Text('Recorded Profit'),
            trailing: Text('+₹1,067.50', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF16A34A), fontSize: 18)),
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Users & Access Control', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        const ListTile(leading: Icon(Icons.shield), title: Text('Sardar Gurmeet Singh'), subtitle: Text('Role: ADMIN (Full Control)'), trailing: Chip(label: Text('OWNER'))),
        const Divider(),
        const ListTile(leading: Icon(Icons.person), title: Text('Ramesh Kumar'), subtitle: Text('Role: STAFF (Data Entry Only)'), trailing: Chip(label: Text('STAFF'))),
        const SizedBox(height: 20),
        const Text('Backup & Restore', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A), foregroundColor: Colors.white),
          onPressed: () {},
          icon: const Icon(Icons.download),
          label: const Text('Download Full Farm Database Backup (JSON)'),
        )
      ],
    );
  }
}
