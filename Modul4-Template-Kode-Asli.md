# Modul 4 — Template Kode Asli (Codelab 1-5)

> File ini berisi isi asli dari seluruh link "salin kode di sini" / "template" / "skrip" pada PDF Modul 4, diambil langsung dari repo GitHub `cookedRay03/asset.praktikumMobile.2024/module4`. Bagian yang harus kamu/agent lengkapi ditandai `/* ??? */`.

**Sumber asli:**
- https://github.com/cookedRay03/asset.praktikumMobile.2024/tree/main/module4
- Contoh proyek assignment: https://github.com/cookedRay03/mobile.example.assignment2/tree/Modul4
- Doc interface SecureVaultDemo: https://docs.google.com/document/d/1-PuuUGYVQ7va7_Q0w0_T_xek3Ky_ElImSxVMTE5fQns/edit?usp=sharing
- Rubrik penilaian (spreadsheet): https://docs.google.com/spreadsheets/d/1HRMnDGSen-Jh9H5l0f-zjHHoDKFuZrHeMM859Hv0o9Y/edit?usp=sharing

---

## CODELAB 1 — Brankas Terenkripsi (Secure Token Storage)

**File tujuan:** `asset/SecureVaultDemo.tsx`
**Yang harus dilengkapi:** 3 titik `/* ??? */` → ganti dengan method SecureStore yang sesuai (`setItemAsync`, `getItemAsync`, `deleteItemAsync`).

```tsx
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
      await SecureStore./* ??? */('hero_license_token', tokenInput.trim());
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
      const token = await SecureStore./* ??? */('hero_license_token');
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
      await SecureStore./* ??? */('hero_license_token');
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
```

**Jawaban yang benar (untuk referensi/self-check, bukan untuk langsung copy-paste tanpa paham):**
- Baris save → `SecureStore.setItemAsync('hero_license_token', tokenInput.trim())`
- Baris load → `SecureStore.getItemAsync('hero_license_token')`
- Baris wipe → `SecureStore.deleteItemAsync('hero_license_token')`

---

## CODELAB 2 — Cloud Bridge & Pemeriksaan Kesehatan Sistem

**File tujuan:** `lib/supabase.ts` (sudah lengkap/tidak ada blank — ini adalah kode final yang tinggal dipakai)

```ts
// 1.1 IMPORT SECTION
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

// 1.2 HARDWARE-ENCRYPTED STORAGE ADAPTER
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing in env file!");
}

// 1.3 INITIALIZE SUPABASE CLIENT SINGLETON
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 1.4 LIVE CLOUD HEALTH CHECK FUNCTION
export async function testCloudBridge(): Promise<boolean> {
  try {
    const { error } = await supabase.from("missions").select("id").limit(1);
    if (!error) console.log("Cloud Bridge: Connection to Supabase established!");
    return true;
  } catch (err) {
    console.error("Cloud Bridge Communication Error:", err);
    return false;
  }
}
```

**UI pendamping (`CloudHealthScreen`, untuk verifikasi visual — sudah lengkap, tinggal pakai):**

```tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, testCloudBridge } from '@/lib/supabase';

interface CloudStatus {
  loading: boolean;
  message: string | null;
  success: boolean | null;
}

export default function CloudHealthScreen() {
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>({
    loading: false,
    message: null,
    success: null,
  });

  const checkConnection = async () => {
    setCloudStatus({ loading: true, message: null, success: null });

    const result = await testCloudBridge();

    setCloudStatus({
      loading: false,
      message: result
        ? 'Connection to PostgreSQL Supabase established successfully!'
        : 'Failed to establish connection to Supabase.',
      success: result,
    });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <View style={styles.cloudCard}>
            <Text style={styles.sectionHeader}>CODELAB 2: CLOUD BRIDGE</Text>
            <Text style={styles.cardTitle}>Supabase Health Check</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TARGET URL</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {(supabase as any)?.supabaseUrl || 'Missing .env configuration'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkBtn}
              onPress={checkConnection}
              disabled={cloudStatus.loading}
              activeOpacity={0.8}
            >
              {cloudStatus.loading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.checkBtnText}>Test Cloud Bridge</Text>
              )}
            </TouchableOpacity>

            {cloudStatus.message && (
              <View
                style={[
                  styles.statusBox,
                  cloudStatus.success ? styles.statusSuccess : styles.statusError,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    cloudStatus.success ? styles.textSuccess : styles.textError,
                  ]}
                >
                  {cloudStatus.message}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { padding: 20, justifyContent: 'center', flexGrow: 1 },
  cardWrapper: { maxWidth: 480, width: '100%', alignSelf: 'center' },
  sectionHeader: {
    color: '#737373', fontSize: 11, fontWeight: '800',
    letterSpacing: 1.5, marginBottom: 8, textAlign: 'center',
  },
  cloudCard: {
    padding: 24, backgroundColor: '#0a0a0a', borderRadius: 16,
    borderWidth: 1, borderColor: '#262626',
  },
  cardTitle: {
    color: '#ffffff', fontSize: 22, fontWeight: '800',
    marginBottom: 16, textAlign: 'center', letterSpacing: 0.5,
  },
  infoRow: {
    backgroundColor: '#171717', padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#333333', marginBottom: 14,
  },
  infoLabel: { color: '#737373', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  infoValue: {
    color: '#d4d4d4', fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  checkBtn: { backgroundColor: '#ffffff', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  checkBtnText: { color: '#000000', fontWeight: '700', fontSize: 14 },
  statusBox: { marginTop: 14, padding: 14, borderRadius: 10, borderWidth: 1 },
  statusSuccess: { backgroundColor: '#171717', borderColor: '#404040' },
  statusError: { backgroundColor: '#171717', borderColor: '#525252' },
  statusText: { fontSize: 13, fontWeight: '600', textAlign: 'center', lineHeight: 18 },
  textSuccess: { color: '#ffffff' },
  textError: { color: '#a3a3a3' },
});
```

> Jangan lupa buat `.env` sendiri (URL & Anon Key dari project Supabase kamu sendiri, jangan hardcode/ditebak AI).

---

## CODELAB 3 — Perekrutan Pahlawan (Alur Pendaftaran & Masuk)

**File tujuan:** `app/(auth)/login.tsx`
**Yang harus dilengkapi:** 2 titik `/* ??? */` → method Supabase Auth (`signUp` untuk register, `signInWithPassword` untuk login).

```tsx
// 1.1 IMPORT SECTION
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  // 1.2 STATE DECLARATION
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1.3 CORE AUTHENTICATION ENGINE (CODELAB 3 CHALLENGE)
  const handleAuth = async () => {
    // 2.1 SANITIZE INPUTS & VALIDATION
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanCallsign = callsign.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Hold on, Operative!', 'Please provide both an email and password to proceed.');
      return;
    }

    if (isRegistering && !cleanCallsign) {
      Alert.alert('Identity Missing', 'Every operative in the field needs a tactical callsign!');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // 2.2 SIGN UP: RECRUIT NEW OPERATIVE (WITH METADATA)
        const { error } = await supabase.auth./* ??? */({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              callsign: cleanCallsign,
              role: 'hero',
            },
          },
        });

        if (error) {
          Alert.alert('Recruitment Denied', error.message);
        } else {
          Alert.alert('Enlistment Successful!', 'Credentials registered. Switch to Sign In to enter HQ!');
          setIsRegistering(false);
          setPassword('');
        }
      } else {
        // 2.3 SIGN IN: AUTHENTICATE RETURNING HERO
        const { error } = await supabase.auth./* ??? */({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          Alert.alert('Access Denied', error.message);
        } else {
          router.replace('/');
        }
      }
    } catch (err: any) {
      Alert.alert('System Malfunction', 'Unable to establish communication with HQ.');
      console.error('Auth Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1.4 MAIN UI RENDER
  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>

          <View style={styles.headerArea}>
            <Text style={styles.badgeText}>COMMAND HQ ACCESS</Text>
            <Text style={styles.headingTitle}>
              {isRegistering ? 'Hero Recruitment' : 'Operative Sign In'}
            </Text>
            <Text style={styles.subtitle}>
              {isRegistering
                ? 'Register your field credentials and claim your tactical callsign.'
                : 'Enter your verified credentials to access the tactical mission board.'}
            </Text>
          </View>

          <View style={styles.formCard}>
            {isRegistering && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TACTICAL CALLSIGN</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. ShadowRunner, Cipher"
                  placeholderTextColor="#666666"
                  value={callsign}
                  onChangeText={setCallsign}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OPERATIVE EMAIL</Text>
              <TextInput
                style={styles.textInput}
                placeholder="operative@hero.hq"
                placeholderTextColor="#666666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ACCESS PASSWORD</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Min. 6 characters..."
                placeholderTextColor="#666666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {isRegistering ? 'Enlist as Hero' : 'Authenticate & Enter HQ'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeBtn}
              onPress={() => setIsRegistering(!isRegistering)}
              activeOpacity={0.7}
            >
              <Text style={styles.switchModeText}>
                {isRegistering
                  ? 'Already have credentials? Sign in here'
                  : 'Need field credentials? Register here'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 1.5 STYLESHEET SECTION (MONOCHROME THEME)
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  cardWrapper: { maxWidth: 480, width: '100%', alignSelf: 'center' },
  headerArea: { marginBottom: 24, alignItems: 'center' },
  badgeText: { color: '#737373', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 6 },
  headingTitle: { color: '#ffffff', fontSize: 26, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#a3a3a3', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  formCard: {
    backgroundColor: '#0a0a0a', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#262626', gap: 14,
  },
  inputGroup: { gap: 6 },
  inputLabel: { color: '#737373', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  textInput: {
    backgroundColor: '#171717', color: '#ffffff', paddingHorizontal: 14,
    paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#333333', fontSize: 14,
  },
  primaryBtn: { backgroundColor: '#ffffff', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: '#000000', fontWeight: '700', fontSize: 14 },
  switchModeBtn: { paddingVertical: 10, alignItems: 'center' },
  switchModeText: { color: '#a3a3a3', fontSize: 13, fontWeight: '600' },
});
```

**Jawaban yang benar (self-check):**
- Register → `supabase.auth.signUp({...})`
- Login → `supabase.auth.signInWithPassword({...})`

---

## CODELAB 4 — Penjaga Gerbang (AuthContext & Route Guard)

**File tujuan 1:** `context/AuthContext.tsx`
**Yang harus dilengkapi:** 2 titik `/* ??? */` → method sesi Supabase (`getSession`, `onAuthStateChange`).

```tsx
// 1.1 IMPORT SECTION
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// 1.2 AUTH CONTEXT INTERFACE
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// 1.3 CREATE CONTEXT INSTANCE
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 1.4 GLOBAL AUTH PROVIDER COMPONENT (CODELAB 4 CHALLENGE)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 2.1 Rehydrate existing session from Hardware Vault on app startup
    supabase.auth./* ??? */().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2.2 Listen to real-time Auth events (LOGIN, LOGOUT, TOKEN_REFRESH)
    const { data: authListener } = supabase.auth./* ??? */((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// 1.5 CUSTOM HOOK: USEAUTH
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider!");
  }
  return context;
}
```

**Jawaban yang benar (self-check):**
- Rehidrasi startup → `supabase.auth.getSession()`
- Listener real-time → `supabase.auth.onAuthStateChange((_event, session) => {...})`

**File tujuan 2:** `app/_layout.tsx` (sudah lengkap/tidak ada blank — tinggal dipakai)

```tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // 1.2 THE NAVIGATION GATEKEEPER / ROUTE GUARD
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!session && !inAuthGroup) {
      // Intruder detected! Redirect unauthenticated operative to Login
      router.replace('/(auth)/login' as any);
    } else if (session && inAuthGroup) {
      // Authenticated Hero detected in auth screen! Escort to Command HQ
      router.replace('/');
    }
  }, [session, isLoading, segments]);

  // 1.3 INITIAL LOADING SPLASH STATE
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // 1.4 NAVIGATION STACK
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

// 1.5 ROOT APP WRAPPER WITH AUTH PROVIDER
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## CODELAB 5 — Papan Misi Taktis (Mengambil & Membuat Misi Cloud)

**File SQL** (jalankan di Supabase SQL Editor — sudah lengkap):

```sql
-- 1. Buat tabel missions
CREATE TABLE missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  reward_points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan akses data khusus per user (Auth UID)
CREATE POLICY "Operatives can view their own missions"
ON missions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Operatives can insert their own missions"
ON missions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Operatives can update their own missions"
ON missions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Operatives can delete their own missions"
ON missions FOR DELETE USING (auth.uid() = user_id);
```

**File tujuan:** `app/(app)/index.tsx`
**Yang harus dilengkapi:** 4 titik `/* ??? */` → method query Supabase (`select`, `insert`, `update`, `delete`).

```tsx
// 1.1 IMPORT SECTION
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// 1.2 INTERFACE DEFINITION
interface Mission {
  id: string;
  title: string;
  reward_points: number;
  status: 'pending' | 'completed';
  created_at: string;
}

export default function TacticalHQScreen() {
  // 1.3 COMPONENT STATE
  const { user, signOut } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [missionTitle, setMissionTitle] = useState('');
  const [rewardXP, setRewardXP] = useState('150');
  const [submitting, setSubmitting] = useState(false);

  // 1.4 SUPABASE CRUD OPERATIONS
  // 2.1 READ: FETCH MISSIONS (PROTECTED BY RLS)
  const fetchMissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        ./* ??? */('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
          Alert.alert(
            'Database Setup Required',
            'Table "missions" not found! Run the SQL schema (code4.sql) in your Supabase SQL Editor.'
          );
        } else {
          throw error;
        }
      }
      setMissions(data || []);
    } catch (error: any) {
      Alert.alert('Sync Error', error.message || 'Failed to fetch mission board.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMissions();
  };

  // 2.2 CREATE: INSERT MISSION
  const handleCreateMission = async () => {
    if (!missionTitle.trim()) {
      Alert.alert('Objective Missing', 'Please enter an objective for the mission.');
      return;
    }

    const points = parseInt(rewardXP, 10) || 100;
    try {
      setSubmitting(true);
      const { error } = await supabase.from('missions')./* ??? */([
        {
          title: missionTitle.trim(),
          reward_points: points,
          user_id: user?.id,
        },
      ]);

      if (error) throw error;
      setMissionTitle('');
      setRewardXP('150');
      Keyboard.dismiss();
      fetchMissions();
    } catch (error: any) {
      Alert.alert('Dispatch Failed', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 2.3 UPDATE: TOGGLE STATUS (OPTIMISTIC UI)
  const handleToggleStatus = async (item: Mission) => {
    const nextStatus = item.status === 'completed' ? 'pending' : 'completed';

    // Instant local UI state update
    setMissions((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: nextStatus } : m))
    );

    try {
      const { error } = await supabase
        .from('missions')
        ./* ??? */({ status: nextStatus })
        .eq('id', item.id);

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Update Failed', error.message);
      fetchMissions();
    }
  };

  // 2.4 DELETE: REMOVE MISSION (OPTIMISTIC UI)
  const handleDeleteMission = async (id: string) => {
    // Instant local removal
    setMissions((prev) => prev.filter((m) => m.id !== id));

    try {
      const { error } = await supabase.from('missions')./* ??? */().eq('id', id);
      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Deletion Failed', error.message);
      fetchMissions();
    }
  };

  // 1.5 LIST ITEM RENDER
  const renderMissionItem = ({ item }: { item: Mission }) => {
    const isDone = item.status === 'completed';
    return (
      <View style={styles.missionCard}>
        <TouchableOpacity
          style={styles.missionMainTouch}
          onPress={() => handleToggleStatus(item)}
          activeOpacity={0.75}
        >
          <View style={[styles.statusChip, isDone ? styles.statusChipDone : styles.statusChipActive]}>
            <View style={[styles.statusDot, isDone ? styles.statusDotDone : styles.statusDotActive]} />
            <Text style={[styles.statusChipText, isDone ? styles.statusTextDone : styles.statusTextActive]}>
              {isDone ? 'DONE' : 'ACTIVE'}
            </Text>
          </View>

          <View style={styles.missionTextContent}>
            <Text
              style={[styles.missionTitle, isDone && styles.missionTitleDone]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text style={styles.rewardText}>+{item.reward_points} XP</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteChip}
          onPress={() => handleDeleteMission(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteChipText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 1.6 COMPACT SCREEN RENDER
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.statusIndicatorRow}>
              <View style={styles.livePulseDot} />
              <Text style={styles.statusLabel}>COMMAND HQ ACTIVE</Text>
            </View>
            <Text style={styles.callsignHeading}>
              {user?.user_metadata?.callsign || user?.email?.split('@')[0] || 'Operative'}
            </Text>
            <Text style={styles.emailSub} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={signOut} activeOpacity={0.8}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dispatchCard}>
          <Text style={styles.cardHeaderLabel}>DISPATCH NEW MISSION</Text>
          <TextInput
            style={styles.mainInput}
            placeholder="Mission objective..."
            placeholderTextColor="#71717a"
            value={missionTitle}
            onChangeText={setMissionTitle}
          />
          <View style={styles.dispatchRow}>
            <TextInput
              style={[styles.mainInput, styles.xpInput]}
              placeholder="XP"
              placeholderTextColor="#71717a"
              value={rewardXP}
              onChangeText={setRewardXP}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.dispatchButton, submitting && styles.buttonDisabled]}
              onPress={handleCreateMission}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#09090b" size="small" />
              ) : (
                <Text style={styles.dispatchButtonText}>Dispatch</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listSectionHeader}>
          <Text style={styles.listTitle}>TACTICAL MISSIONS</Text>
          <View style={styles.badgeCountPill}>
            <Text style={styles.badgeCountText}>{missions.length} QUEUED</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fafafa" />
            <Text style={styles.loadingText}>Syncing with PostgreSQL...</Text>
          </View>
        ) : (
          <FlatList
            data={missions}
            keyExtractor={(item) => item.id}
            renderItem={renderMissionItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fafafa" />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No active missions</Text>
                <Text style={styles.emptySubtitle}>
                  All sectors are secure. Dispatch a new objective above.
                </Text>
              </View>
            }
          />
        )}

      </View>
    </SafeAreaView>
  );
}

// 1.7 BULLETPROOF STYLESHEET
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#09090b' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8, maxWidth: 420, width: '100%', alignSelf: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#18181b',
  },
  headerLeft: { flex: 1, marginRight: 10 },
  statusIndicatorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  livePulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e', marginRight: 6 },
  statusLabel: { color: '#71717a', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  callsignHeading: { color: '#fafafa', fontSize: 18, fontWeight: '800' },
  emailSub: { color: '#71717a', fontSize: 11, marginTop: 1 },
  signOutButton: {
    backgroundColor: '#18181b', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: '#27272a',
  },
  signOutButtonText: { color: '#a1a1aa', fontWeight: '700', fontSize: 11 },
  dispatchCard: {
    backgroundColor: '#121215', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#27272a', marginBottom: 12,
  },
  cardHeaderLabel: { color: '#71717a', fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginBottom: 6 },
  mainInput: {
    backgroundColor: '#18181b', color: '#fafafa', height: 40, paddingHorizontal: 12,
    borderRadius: 8, borderWidth: 1, borderColor: '#27272a', fontSize: 13, marginBottom: 8,
  },
  dispatchRow: { flexDirection: 'row' },
  xpInput: { flex: 1, marginRight: 8, marginBottom: 0 },
  dispatchButton: {
    backgroundColor: '#fafafa', height: 40, paddingHorizontal: 16,
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  dispatchButtonText: { color: '#09090b', fontWeight: '700', fontSize: 13 },
  listSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  listTitle: { color: '#71717a', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  badgeCountPill: {
    backgroundColor: '#18181b', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, borderWidth: 1, borderColor: '#27272a',
  },
  badgeCountText: { color: '#a1a1aa', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  listContent: { paddingBottom: 20 },
  missionCard: {
    backgroundColor: '#121215', borderRadius: 10, padding: 10, flexDirection: 'row',
    alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#27272a',
  },
  missionMainTouch: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6,
    paddingVertical: 3, borderRadius: 6, marginRight: 8, borderWidth: 1,
  },
  statusChipActive: { backgroundColor: '#18181b', borderColor: '#3f3f46' },
  statusChipDone: { backgroundColor: '#18181b', borderColor: '#27272a' },
  statusDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 4 },
  statusDotActive: { backgroundColor: '#fafafa' },
  statusDotDone: { backgroundColor: '#52525b' },
  statusChipText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  statusTextActive: { color: '#fafafa' },
  statusTextDone: { color: '#71717a' },
  missionTextContent: { flex: 1, marginRight: 6 },
  missionTitle: { color: '#fafafa', fontSize: 13, fontWeight: '600', lineHeight: 16 },
  missionTitleDone: { textDecorationLine: 'line-through', color: '#52525b' },
  rewardText: { color: '#71717a', fontSize: 10, fontWeight: '600', marginTop: 1 },
  deleteChip: {
    width: 26, height: 26, borderRadius: 6, justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a',
  },
  deleteChipText: { color: '#71717a', fontSize: 10, fontWeight: '700' },
  loadingContainer: { alignItems: 'center', marginTop: 30 },
  loadingText: { color: '#71717a', fontSize: 11, marginTop: 6 },
  emptyState: { alignItems: 'center', marginTop: 30, paddingHorizontal: 16 },
  emptyTitle: { color: '#fafafa', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  emptySubtitle: { color: '#71717a', fontSize: 11, textAlign: 'center', lineHeight: 14 },
});
```

**Jawaban yang benar (self-check):**
- Read → `.select('*')`
- Create → `.insert([...])`
- Update → `.update({ status: nextStatus })`
- Delete → `.delete()`

---

## Ringkasan Total Blank yang Harus Dilengkapi

| Codelab | File | Jumlah `/* ??? */` | Method yang dipakai |
|---|---|---|---|
| 1 | `SecureVaultDemo.tsx` | 3 | `setItemAsync`, `getItemAsync`, `deleteItemAsync` |
| 2 | `lib/supabase.ts` | 0 (sudah lengkap) | — |
| 3 | `login.tsx` | 2 | `signUp`, `signInWithPassword` |
| 4 | `AuthContext.tsx` | 2 | `getSession`, `onAuthStateChange` |
| 4 | `_layout.tsx` | 0 (sudah lengkap) | — |
| 5 | `index.tsx` | 4 | `select`, `insert`, `update`, `delete` |

**Total: 11 blank** yang perlu dilengkapi agent kamu di seluruh Modul 4.
