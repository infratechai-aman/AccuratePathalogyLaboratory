'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  LayoutDashboard, FlaskConical, Calendar, FileText, Clock, Users,
  ChevronRight, LogOut, Shield, Loader2, Mail, Lock, Eye, EyeOff
} from 'lucide-react';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tests', label: 'Tests', icon: FlaskConical },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/slots', label: 'Slots', icon: Clock },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('unauthorized');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Only show loading if there's a persisted session to check
    const currentUser = auth.currentUser;
    if (currentUser) {
      setStatus('checking');
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('unauthorized');
        return;
      }
      setStatus('checking');
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists() && docSnap.data()?.isAdmin === true) {
          setAdminEmail(user.email || '');
          setAdminName(docSnap.data()?.name || 'Admin');
          setStatus('authorized');
        } else {
          await signOut(auth);
          setStatus('unauthorized');
        }
      } catch {
        setStatus('unauthorized');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setStatus('unauthorized');
  };

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#0A2540] text-sm font-semibold">Verifying...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <AdminLoginGate onSuccess={(name, email) => { setAdminName(name); setAdminEmail(email); setStatus('authorized'); }} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed z-40 flex h-full w-64 flex-col border-r border-gray-200 bg-[#0A2540]">
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-center">
          <Link href="/admin" className="bg-white rounded-xl px-4 py-2 flex items-center justify-center hover:opacity-90 transition-opacity">
            <Image src="/images/logo.png" alt="Accurate Pathology Laboratory" width={130} height={55} className="object-contain" priority />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                pathname === item.href
                  ? 'bg-white text-[#0A2540]'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <ChevronRight size={17} className="rotate-180" />
            Back to Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#E53E3E]/80 hover:text-[#E53E3E] hover:bg-red-500/10 transition-all"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#0A2540] font-bold text-lg leading-none">
                {adminNav.find(n => n.href === pathname)?.label || 'Dashboard'}
              </h2>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <span>Admin</span>
                <ChevronRight size={10} />
                <span className="text-gray-600">
                  {adminNav.find(n => n.href === pathname)?.label || 'Dashboard'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-[#0A2540]">{adminName}</p>
                <p className="text-xs text-gray-400">{adminEmail}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0A2540] flex items-center justify-center text-white font-bold text-sm">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ---- Admin Login Gate ----
function AdminLoginGate({ onSuccess }: { onSuccess: (name: string, email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const docSnap = await getDoc(doc(db, 'users', cred.user.uid));
      if (docSnap.exists() && docSnap.data()?.isAdmin === true) {
        onSuccess(docSnap.data()?.name || 'Admin', cred.user.email || '');
      } else {
        await signOut(auth);
        setError('Access denied. You do not have admin privileges.');
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#0A2540] via-[#1a4a7c] to-[#E53E3E]" />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Image src="/images/logo.png" alt="Accurate Labs" width={52} height={52} className="object-contain" />
              <div>
                <h1 className="text-2xl font-black text-[#0A2540] uppercase tracking-wide leading-none" style={{ fontFamily: 'Georgia, serif' }}>Accurate</h1>
                <p className="text-[11px] font-bold text-[#E53E3E] uppercase tracking-widest mt-0.5">Pathology Laboratory</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#0A2540]">Admin Sign In</h2>
              <p className="text-sm text-gray-500 mt-1">Access restricted to authorized administrators only.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540] transition-all bg-gray-50"
                    placeholder="admin@accuratepathlabs.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540] transition-all bg-gray-50"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <Shield size={15} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A2540] hover:bg-[#0e3460] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    Sign In to Admin Panel
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-300 mt-6">
              Unauthorized access to this portal is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#0A2540] font-medium transition-colors">
            ← Back to main site
          </Link>
        </p>
      </div>
    </div>
  );
}
