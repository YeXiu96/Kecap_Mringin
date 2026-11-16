// 1.1 IMPORT SECTION
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SecureVaultDemo() {
  // 1.2 STATE DECLARATION
  const [tokenInput, setTokenInput] = useState('');
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 1.3 FUNCTION: SAVE TOKEN
  const saveToken = async () => {
    if (!tokenInput.trim()) {
      const msg = 'Please enter a valid token.';
      setStatusMessage(msg);
      Alert.alert('Error', msg);
      return;
    }

    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('hero_license_token', tokenInput.trim());
        setTokenInput('');
        const msg = 'Token stored in browser localStorage (Web Mode).';
        setStatusMessage(msg);
        Alert.alert('Success', msg);
        return;
      }

      // 1. Simpan token ke Hardware Vault
      await SecureStore.setItemAsync('hero_license_token', tokenInput.trim());
      setTokenInput('');
      const msg = 'Token encrypted and stored in SecureStore.';
      setStatusMessage(msg);
      Alert.alert('Success', msg);
    } catch (err: any) {
      setStatusMessage(`Save Error: ${err.message}`);
      Alert.alert('Error', err.message);
    }
  };

  // 1.4 FUNCTION: LOAD TOKEN
  const loadToken = async () => {
    try {
      if (Platform.OS === 'web') {
        const token = localStorage.getItem('hero_license_token');
        setStoredToken(token);
        setStatusMessage(token ? 'Token loaded from localStorage.' : 'No token found in storage.');
        return;
      }

      // 2. Baca token dari Hardware Vault
      const token = await SecureStore.getItemAsync('hero_license_token');
      setStoredToken(token);
      setStatusMessage(token ? 'Token loaded from SecureStore.' : 'No token found in vault.');
    } catch (err: any) {
      setStatusMessage(`Load Error: ${err.message}`);
      Alert.alert('Error', err.message);
    }
  };

  // 1.5 FUNCTION: WIPE TOKEN
  const wipeToken = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('hero_license_token');
        setStoredToken(null);
        const msg = 'Token wiped from storage.';
        setStatusMessage(msg);
        Alert.alert('Wiped', msg);
        return;
      }

      // 3. Hapus token dari Hardware Vault
      await SecureStore.deleteItemAsync('hero_license_token');
      setStoredToken(null);
      const msg = 'Token wiped from vault.';
      setStatusMessage(msg);
      Alert.alert('Wiped', msg);
    } catch (err: any) {
      setStatusMessage(`Wipe Error: ${err.message}`);
      Alert.alert('Error', err.message);
    }
  };

  // 1.6 MAIN UI RENDER
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encrypted Vault Demo</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          Platform: {Platform.OS === 'web' ? 'Web Browser (localStorage)' : 'Mobile Native (SecureStore)'}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Hero License Token..."
        placeholderTextColor="#666666"
        value={tokenInput}
        onChangeText={setTokenInput}
      />

      <TouchableOpacity style={styles.btnPrimary} onPress={saveToken} activeOpacity={0.8}>
        <Text style={styles.btnPrimaryText}>Save Token</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={loadToken} activeOpacity={0.8}>
        <Text style={styles.btnSecondaryText}>Load Token</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnDanger} onPress={wipeToken} activeOpacity={0.8}>
        <Text style={styles.btnDangerText}>Wipe Token</Text>
      </TouchableOpacity>

      {statusMessage && (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}

      {storedToken !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>VAULT VALUE</Text>
          <Text style={styles.tokenText}>{storedToken || '(Empty / Deleted)'}</Text>
        </View>
      )}
    </View>
  );
}

// 1.7 STYLESHEET SECTION
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262626',
    width: '100%',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#171717',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  badgeText: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#171717',
    color: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 12,
    fontSize: 14,
  },
  btnPrimary: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimaryText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  btnSecondary: {
    backgroundColor: '#171717',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  btnSecondaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnDanger: {
    backgroundColor: '#0a0a0a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#525252',
  },
  btnDangerText: {
    color: '#d4d4d4',
    fontWeight: '700',
    fontSize: 14,
  },
  statusBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#171717',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  statusText: {
    color: '#a3a3a3',
    fontSize: 13,
    fontWeight: '500',
  },
  resultBox: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#171717',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  resultLabel: {
    color: '#737373',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  tokenText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
