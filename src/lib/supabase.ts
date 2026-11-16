// 1.1 IMPORT SECTION
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// 1.2 HARDWARE-ENCRYPTED STORAGE ADAPTER
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
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
