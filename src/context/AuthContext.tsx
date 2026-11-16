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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2.2 Listen to real-time Auth events (LOGIN, LOGOUT, TOKEN_REFRESH)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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
