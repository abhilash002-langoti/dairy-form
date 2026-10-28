import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

export default function DriverApp() {
  const [stops, setStops] = useState([
    { id: '1', stopNo: 1, name: 'Ananya Sharma', address: 'Flat 402, Green Glen Layout, Bellandur', items: '1L Pure A2 Gir Cow Milk', delivered: false },
    { id: '2', stopNo: 2, name: 'Rajesh Kulkarni', address: '#88, 14th Main, HSR Layout', items: '2L Creamy Murrah Buffalo Milk', delivered: true },
    { id: '3', stopNo: 3, name: 'Sunil Verma', address: 'Villa 12, Palm Meadows, Whitefield', items: '500ml Bilona Ghee + 200g Paneer', delivered: false },
  ]);

  function markDelivered(id: string) {
    setStops(stops.map(s => s.id === id ? { ...s, delivered: true } : s));
    Alert.alert('Status Updated', 'Delivered & empty bottles captured!');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Manifest - Route A</Text>
        <Text style={styles.headerSub}>Vehicle: KA-01-EQ-4421 (EV Loader)</Text>
      </View>

      <FlatList
        data={stops}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.card, item.delivered && styles.cardDelivered]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '800', color: '#64748b' }}>STOP #{item.stopNo}</Text>
              <Text style={{ fontWeight: '900', color: item.delivered ? '#16a34a' : '#d97706' }}>
                {item.delivered ? 'DELIVERED' : 'PENDING'}
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', marginTop: 4 }}>{item.name}</Text>
            <Text style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>📍 {item.address}</Text>
            <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 6, marginVertical: 8 }}>
              <Text style={{ fontWeight: '700', fontSize: 13 }}>📦 {item.items}</Text>
            </View>
            {!item.delivered ? (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={styles.deliveredBtn} onPress={() => markDelivered(item.id)}>
                  <Text style={styles.btnText}>✓ Mark Delivered</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.upiBtn} onPress={() => Alert.alert('UPI QR', 'Show customer static UPI QR: amritdairy@icici')}>
                  <Text style={styles.upiBtnText}>📱 Collect UPI</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: '#16a34a', fontWeight: '800', fontSize: 12 }}>✓ Bottle delivered and 1 empty glass retrieved.</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  headerSub: { fontSize: 12, color: '#64748b' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  cardDelivered: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
  deliveredBtn: { backgroundColor: '#16a34a', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  upiBtn: { borderWidth: 1, borderColor: '#cbd5e1', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  upiBtnText: { fontWeight: '700', color: '#0f172a', fontSize: 13 },
});
