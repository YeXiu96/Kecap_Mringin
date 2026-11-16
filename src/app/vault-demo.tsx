import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SecureVaultDemo from '@/asset/SecureVaultDemo';

export default function VaultDemoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SecureVaultDemo />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
});
