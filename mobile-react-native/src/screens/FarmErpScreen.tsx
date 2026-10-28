import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function FarmErpScreen() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cows' | 'milk' | 'medicine' | 'feed' | 'expenses' | 'reports'>('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'staff'>('admin');

  function handleTabSelect(tab: any) {
    if (userRole === 'staff' && (tab === 'expenses' || tab === 'reports')) {
      Alert.alert('Restricted Access', 'Financial reports are visible to Farm Owner (Admin) only.');
      return;
    }
    setActiveTab(tab);
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🐄 Amrit Dairy Farm ERP</Text>
          <Text style={styles.headerSubtitle}>Logged in as: {userRole === 'admin' ? 'Owner (Admin)' : 'Worker (Staff)'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.roleBadge, userRole === 'admin' ? styles.badgeAdmin : styles.badgeStaff]}
          onPress={() => setUserRole(userRole === 'admin' ? 'staff' : 'admin')}
        >
          <Text style={styles.roleBadgeText}>{userRole.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {['dashboard', 'cows', 'milk', 'medicine', 'feed', 'expenses', 'reports'].map(tab => {
            const isLocked = userRole === 'staff' && (tab === 'expenses' || tab === 'reports');
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                onPress={() => handleTabSelect(tab)}
              >
                <Text style={[styles.tabBtnText, activeTab === tab && styles.tabTextActive, isLocked && { color: '#94a3b8' }]}>
                  {tab.toUpperCase()} {isLocked ? '🔒' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Tab Body */}
      <ScrollView style={styles.body}>
        {activeTab === 'dashboard' && (
          <View>
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>TODAY'S MILK</Text>
                <Text style={styles.kpiVal}>74.0 L</Text>
                <Text style={styles.kpiSub}>🌅 48L | 🌇 26L</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>TOTAL COWS</Text>
                <Text style={styles.kpiVal}>6</Text>
                <Text style={styles.kpiSub}>Milking: 3 • Sick: 1</Text>
              </View>
            </View>

            {/* Antibiotic Withdrawal Alert */}
            <View style={styles.withdrawalCard}>
              <Text style={styles.withdrawalTitle}>🚫 ANTIBIOTIC WITHDRAWAL ACTIVE</Text>
              <Text style={styles.withdrawalText}>Cow AMR-005 (Kalyani) treated with Amoxicillin. Milk cannot be sold until Oct 30.</Text>
            </View>

            {/* Low feed alert */}
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>⚠️ Low Feed Stock: Concentrate Pellets</Text>
              <Text style={styles.warningText}>180 kg remaining. Reorder threshold: 200 kg.</Text>
            </View>
          </View>
        )}

        {activeTab === 'cows' && (
          <View>
            <Text style={styles.sectionHeader}>Cattle Master Registry</Text>
            {['AMR-001 (Kamadhenu) • Gir • Milking (16.5L)', 'AMR-002 (Gauri) • Sahiwal • Pregnant (14.0L)', 'AMR-003 (Yamuna) • Murrah Buffalo • Milking (18.0L)', 'AMR-005 (Kalyani) • Red Sindhi • Sick / Treated (11.0L)'].map((c, i) => (
              <View key={i} style={styles.itemCard}>
                <Text style={{ fontWeight: '800', fontSize: 14 }}>{c}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'milk' && (
          <View>
            <Text style={styles.sectionHeader}>Daily Milk Yield Records</Text>
            <View style={styles.itemCard}><Text style={{ fontWeight: '800' }}>AMR-001: 9.5L (M) + 7.0L (E) = 16.5 L (Fat 4.6%)</Text></View>
            <View style={styles.itemCard}><Text style={{ fontWeight: '800' }}>AMR-002: 8.0L (M) + 6.0L (E) = 14.0 L (Fat 4.4%)</Text></View>
            <View style={styles.itemCard}><Text style={{ fontWeight: '800' }}>AMR-003: 10.5L (M) + 7.5L (E) = 18.0 L (Fat 7.6%)</Text></View>
          </View>
        )}

        {activeTab === 'medicine' && (
          <View>
            <Text style={styles.sectionHeader}>Veterinary & Withdrawal Tracker</Text>
            <View style={styles.withdrawalCard}>
              <Text style={{ fontWeight: '900', color: '#991b1b' }}>AMR-005 (Kalyani) - Mastitis</Text>
              <Text style={{ color: '#991b1b', fontSize: 12 }}>Amoxicillin LA 15ml • Milk Barred until Oct 30</Text>
            </View>
            <View style={styles.itemCard}><Text style={{ fontWeight: '800' }}>Calcium Borogluconate 450ml • 1 bottle remaining (Near Expiry)</Text></View>
          </View>
        )}

        {activeTab === 'feed' && (
          <View>
            <Text style={styles.sectionHeader}>Feed Stock & Cost per Litre</Text>
            <View style={styles.itemCard}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Feed Cost per Litre of Milk Produced:</Text>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#0284c7', marginTop: 4 }}>₹25.64 / Litre</Text>
            </View>
          </View>
        )}

        {activeTab === 'expenses' && (
          <View>
            <Text style={styles.sectionHeader}>Expenses (Admin Only)</Text>
            <View style={styles.itemCard}><Text style={{ fontWeight: '800' }}>Daily Feed Consumption: ₹1,897.50</Text></View>
            <View style={styles.itemCard}><Text style={{ fontWeight: '800' }}>Daily Farm Hands: ₹1,200.00</Text></View>
            <View style={styles.itemCard}><Text style={{ fontWeight: '800' }}>Dr. Ramesh BVSc: ₹650.00</Text></View>
          </View>
        )}

        {activeTab === 'reports' && (
          <View>
            <Text style={styles.sectionHeader}>Monthly Profit & Loss</Text>
            <View style={styles.itemCard}>
              <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>Gross Milk Income: ₹4,815.00</Text>
              <Text style={{ color: '#dc2626', fontWeight: 'bold', marginVertical: 4 }}>Total Expenses: ₹3,747.50</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#16a34a' }}>Net Operating Margin: +₹1,067.50</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 45, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#14532d' },
  headerSubtitle: { fontSize: 11, color: '#64748b' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeAdmin: { backgroundColor: '#fef3c7' },
  badgeStaff: { backgroundColor: '#dbeafe' },
  roleBadgeText: { fontWeight: '900', fontSize: 11, color: '#0f172a' },
  tabBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0', paddingVertical: 8 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: '#f1f5f9' },
  tabBtnActive: { backgroundColor: '#16a34a' },
  tabBtnText: { fontSize: 12, fontWeight: '800', color: '#475569' },
  tabTextActive: { color: '#fff' },
  body: { padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  kpiCard: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  kpiLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
  kpiVal: { fontSize: 24, fontWeight: '900', color: '#16a34a', marginVertical: 4 },
  kpiSub: { fontSize: 10, color: '#475569' },
  withdrawalCard: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5', padding: 12, borderRadius: 10, marginBottom: 12 },
  withdrawalTitle: { color: '#991b1b', fontWeight: '900', fontSize: 13, marginBottom: 2 },
  withdrawalText: { color: '#991b1b', fontSize: 12 },
  warningCard: { backgroundColor: '#fef3c7', borderWidth: 1, borderColor: '#fde68a', padding: 12, borderRadius: 10, marginBottom: 12 },
  warningTitle: { color: '#92400e', fontWeight: '900', fontSize: 13, marginBottom: 2 },
  warningText: { color: '#92400e', fontSize: 12 },
  itemCard: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
});
