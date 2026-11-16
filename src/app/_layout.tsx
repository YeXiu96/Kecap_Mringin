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
      router.replace('/' as any);
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
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(app)/index" />
      <Stack.Screen name="vault-demo" options={{ presentation: 'modal', title: 'Codelab 1: Secure Vault' }} />
      <Stack.Screen name="cloud-health" options={{ presentation: 'modal', title: 'Codelab 2: Cloud Health' }} />
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
