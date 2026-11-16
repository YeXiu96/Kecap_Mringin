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

  // 1.3 CORE AUTHENTICATION ENGINE
  const handleAuth = async () => {
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
        // SIGN UP
        const { error } = await supabase.auth.signUp({
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
          if (error.message.toLowerCase().includes('already registered')) {
            Alert.alert(
              'User Already Registered',
              'Email ini sudah terdaftar! Mengalihkan ke mode Sign In agar Anda bisa langsung login.',
              [
                {
                  text: 'Sign In Sekarang',
                  onPress: () => {
                    setIsRegistering(false);
                    setPassword('');
                  },
                },
              ]
            );
          } else {
            Alert.alert('Recruitment Denied', error.message);
          }
        } else {
          Alert.alert(
            'Enlistment Successful!',
            'Akun berhasil dibuat. Silakan login untuk masuk ke HQ.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsRegistering(false);
                  setPassword('');
                },
              },
            ]
          );
        }
      } else {
        // SIGN IN
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          Alert.alert('Access Denied', error.message);
        } else {
          router.replace('/' as any);
        }
      }
    } catch (err: any) {
      Alert.alert('System Malfunction', 'Unable to establish communication with HQ.');
      console.error('Auth Exception:', err);
    } finally {
      setLoading(false);
    }
  };

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
