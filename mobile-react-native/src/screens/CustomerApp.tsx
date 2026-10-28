import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { fetchProducts, checkPincode, fetchSubscriptions, toggleSkipDate, rechargeWallet } from '../services/api';

export default function CustomerApp() {
  const [products, setProducts] = useState<any[]>([]);
  const [pincode, setPincode] = useState('560034');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [walletBalance, setWalletBalance] = useState(1240);
  const [activeTab, setActiveTab] = useState<'shop' | 'calendar' | 'wallet'>('shop');
  const [skippedDates, setSkippedDates] = useState<string[]>(['2026-10-30']);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const p = await fetchProducts();
      if (p.products) setProducts(p.products);
      const s = await fetchSubscriptions('cust-1');
      if (s.subscriptions && s.subscriptions[0]) {
        setSkippedDates(s.subscriptions[0].skippedDates || []);
      }
    } catch (e) {}
  }

  async function handleVerifyPin() {
    const res = await checkPincode(pincode);
    setPincodeMsg(res.message || '');
  }

  async function handleToggleDate(dateStr: string) {
    if (skippedDates.includes(dateStr)) {
      setSkippedDates(skippedDates.filter(d => d !== dateStr));
    } else {
      setSkippedDates([...skippedDates, dateStr]);
    }
    await toggleSkipDate('sub-101', dateStr);
  }

  async function handleRecharge(amount: number) {
    const res = await rechargeWallet('cust-1', amount);
    if (res.success) {
      setWalletBalance(res.balance);
      Alert.alert('Success', `₹${amount} added to wallet!`);
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Amrit Dairy Farms 🐄</Text>
          <Text style={styles.headerSubtitle}>Pure A2 Milk Delivered Daily Before 7 AM</Text>
        </View>
        <TouchableOpacity style={styles.walletBadge} onPress={() => setActiveTab('wallet')}>
          <Text style={styles.walletText}>₹{walletBalance}</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs Bar */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'shop' && styles.tabActive]} onPress={() => setActiveTab('shop')}>
          <Text style={[styles.tabBtnText, activeTab === 'shop' && styles.tabTextActive]}>Shop Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'calendar' && styles.tabActive]} onPress={() => setActiveTab('calendar')}>
          <Text style={[styles.tabBtnText, activeTab === 'calendar' && styles.tabTextActive]}>Vacation Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'wallet' && styles.tabActive]} onPress={() => setActiveTab('wallet')}>
          <Text style={[styles.tabBtnText, activeTab === 'wallet' && styles.tabTextActive]}>Wallet</Text>
        </TouchableOpacity>
      </View>

      {/* Main Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'shop' && (
          <View>
            {/* PIN Code Verification */}
            <View style={styles.pincodeBox}>
              <Text style={styles.sectionTitle}>Check Delivery Area</Text>
              <View style={styles.pinRow}>
                <TextInput
                  style={styles.pinInput}
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="number-pad"
                  placeholder="Enter 6-digit PIN"
                />
                <TouchableOpacity style={styles.pinBtn} onPress={handleVerifyPin}>
                  <Text style={styles.pinBtnText}>Check</Text>
                </TouchableOpacity>
              </View>
              {pincodeMsg ? <Text style={styles.pinResultText}>{pincodeMsg}</Text> : null}
            </View>

            {/* Products List */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Farm-Fresh Catalog</Text>
            {products.map(item => (
              <View key={item.id} style={styles.productCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productBadge}>{item.badge}</Text>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productNutri}>Fat {item.fat} • SNF {item.snf}</Text>
                  <Text style={styles.productPrice}>₹{item.price} / {item.unit}</Text>
                </View>
                <TouchableOpacity
                  style={styles.subscribeBtn}
                  onPress={() => Alert.alert('Subscribed', `Started daily delivery for ${item.name}!`)}
                >
                  <Text style={styles.subBtnText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'calendar' && (
          <View>
            <Text style={styles.sectionTitle}>Pause / Skip Delivery Calendar</Text>
            <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
              Tap any date to pause morning milk delivery while travelling.
            </Text>
            <View style={styles.calendarGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(day => {
                const dateStr = `2026-10-${(day + 25).toString().padStart(2, '0')}`;
                const isSkipped = skippedDates.includes(dateStr);
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.calCell, isSkipped ? styles.calSkipped : styles.calActive]}
                    onPress={() => handleToggleDate(dateStr)}
                  >
                    <Text style={{ fontSize: 10, color: isSkipped ? '#991b1b' : '#166534' }}>OCT</Text>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: isSkipped ? '#991b1b' : '#0f172a' }}>{day + 25}</Text>
                    <Text style={{ fontSize: 9, color: isSkipped ? '#dc2626' : '#16a34a' }}>{isSkipped ? 'PAUSED' : 'ACTIVE'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'wallet' && (
          <View>
            <View style={styles.walletCard}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>CURRENT BALANCE</Text>
              <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900', marginVertical: 6 }}>₹{walletBalance}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Auto-deducted daily upon glass bottle dropoff.</Text>
            </View>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Quick Recharge</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={styles.rechargeBtn} onPress={() => handleRecharge(500)}>
                <Text style={styles.rechargeBtnText}>+ ₹500</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rechargeBtn} onPress={() => handleRecharge(1000)}>
                <Text style={styles.rechargeBtnText}>+ ₹1,000</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rechargeBtn} onPress={() => handleRecharge(2000)}>
                <Text style={styles.rechargeBtnText}>+ ₹2,000</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#14532d' },
  headerSubtitle: { fontSize: 11, color: '#64748b' },
  walletBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  walletText: { fontWeight: '900', color: '#166534', fontSize: 14 },
  tabsRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#16a34a' },
  tabBtnText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  tabTextActive: { color: '#16a34a' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  pincodeBox: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0' },
  pinRow: { flexDirection: 'row', gap: 8 },
  pinInput: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, height: 40, fontWeight: '700' },
  pinBtn: { backgroundColor: '#16a34a', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  pinBtnText: { color: '#fff', fontWeight: '800' },
  pinResultText: { marginTop: 8, fontSize: 12, color: '#166534', fontWeight: '700' },
  productCard: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  productBadge: { fontSize: 10, fontWeight: '800', color: '#166534', textTransform: 'uppercase' },
  productName: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  productNutri: { fontSize: 11, color: '#64748b', marginVertical: 2 },
  productPrice: { fontSize: 16, fontWeight: '900', color: '#16a34a', marginTop: 4 },
  subscribeBtn: { backgroundColor: '#16a34a', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  subBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  calCell: { width: '22%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1 },
  calActive: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
  calSkipped: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  walletCard: { backgroundColor: '#15803d', padding: 20, borderRadius: 16 },
  rechargeBtn: { flex: 1, backgroundColor: '#16a34a', paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  rechargeBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
