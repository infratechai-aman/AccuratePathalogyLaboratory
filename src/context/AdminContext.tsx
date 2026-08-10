'use client';

// ============================================================
// Admin Context — Auth, Role, Permissions, Tenant
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { StaffUser, Tenant, StaffRole } from '@/lib/types';
import { hasPermission, hasAnyPermission, Permission } from '@/lib/permissions';

interface AdminContextType {
  firebaseUser: FirebaseUser | null;
  staffUser: StaffUser | null;
  tenant: Tenant | null;
  tenantId: string;
  loading: boolean;
  error: string | null;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  firebaseUser: null,
  staffUser: null,
  tenant: null,
  tenantId: '',
  loading: true,
  error: null,
  can: () => false,
  canAny: () => false,
  refreshUser: async () => {},
});

export const useAdmin = () => useContext(AdminContext);

// Demo tenant ID (used when no real tenant exists)
const DEMO_TENANT_ID = 'demo_lab_001';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tenantId = staffUser?.tenantId || DEMO_TENANT_ID;

  const loadStaffUser = useCallback(async (uid: string) => {
    try {
      // Try staff collection first
      const staffSnap = await getDoc(doc(db, 'staff', uid));
      if (staffSnap.exists()) {
        const data = staffSnap.data();
        const staff: StaffUser = {
          uid,
          tenantId: data.tenantId || DEMO_TENANT_ID,
          name: data.name || 'Admin',
          email: data.email || '',
          phone: data.phone || '',
          role: (data.role as StaffRole) || 'super_admin',
          permissions: data.permissions || [],
          active: data.active !== false,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
        setStaffUser(staff);

        // Load tenant
        if (staff.tenantId) {
          const tenantSnap = await getDoc(doc(db, 'tenants', staff.tenantId));
          if (tenantSnap.exists()) {
            setTenant(tenantSnap.data() as Tenant);
          }
        }
        return;
      }

      // Fallback: check users collection (legacy admin check)
      const userSnap = await getDoc(doc(db, 'users', uid));
      if (userSnap.exists() && userSnap.data()?.isAdmin === true) {
        const data = userSnap.data();
        setStaffUser({
          uid,
          tenantId: DEMO_TENANT_ID,
          name: data.name || 'Admin',
          email: data.email || '',
          phone: data.phone || '',
          role: 'super_admin',
          permissions: [],
          active: true,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        });
        return;
      }

      setError('Access denied. Not a staff member.');
    } catch (err) {
      console.error('Error loading staff user:', err);
      setError('Failed to load user data.');
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (firebaseUser) {
      await loadStaffUser(firebaseUser.uid);
    }
  }, [firebaseUser, loadStaffUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await loadStaffUser(user.uid);
      } else {
        setStaffUser(null);
        setTenant(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadStaffUser]);

  const can = useCallback((permission: Permission): boolean => {
    if (!staffUser) return false;
    return hasPermission(staffUser.role, staffUser.permissions, permission);
  }, [staffUser]);

  const canAny = useCallback((permissions: Permission[]): boolean => {
    if (!staffUser) return false;
    return hasAnyPermission(staffUser.role, staffUser.permissions, permissions);
  }, [staffUser]);

  return (
    <AdminContext.Provider value={{
      firebaseUser,
      staffUser,
      tenant,
      tenantId,
      loading,
      error,
      can,
      canAny,
      refreshUser,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
