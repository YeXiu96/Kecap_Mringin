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
