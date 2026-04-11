'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserByUid } from '@/lib/services/db';
import { User as AppUser } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  logout: async () => {},
  refreshAppUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAppUser = async (uid: string) => {
    try {
      const dbUser = await getUserByUid(uid);
      setAppUser(dbUser);
    } catch (error) {
      console.error("Error fetching app user:", error);
      setAppUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchAppUser(firebaseUser.uid);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAppUser = async () => {
    if (user) {
      await fetchAppUser(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, logout, refreshAppUser }}>
      {children}
    </AuthContext.Provider>
  );
}
