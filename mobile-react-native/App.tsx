import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import FarmErpScreen from './src/screens/FarmErpScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FarmErpScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
});
