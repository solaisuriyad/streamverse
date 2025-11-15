import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// This defines what information we'll store about the user
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

// Create the context that our app will use to get user info
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a helper function to easily access the user info anywhere in the app
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// This is the main component that will manage everything
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This checks for a user session when the app first loads
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // This listens for any changes in authentication state (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Cleanup listener when the component is unmounted
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
  };

  // Provide the user info to the rest of the app
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};