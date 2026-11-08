import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#78350f',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Katalog Kecap Mringin",
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: "Detail Produk",
            headerBackTitle: "Kembali",
          }}
        />
        {/* TUGAS 1: halaman data dari External API (Apify) */}
        <Stack.Screen
          name="market"
          options={{
            title: "Produk Kecap Mringin",
            headerBackTitle: "Kembali",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}