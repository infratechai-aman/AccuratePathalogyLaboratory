'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  LayoutDashboard, FlaskConical, Calendar, FileText, Clock, Users,
  ChevronRight, LogOut, Shield, Loader2
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
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('unauthorized');
        return;
      }
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data()?.isAdmin === true) {
          setAdminEmail(user.email || '');
          setAdminName(docSnap.data()?.name || 'Admin');
          setStatus('authorized');
        } else {
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
    router.push('/');
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09203d]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-white animate-spin" />
          <p className="text-white/60 text-sm font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state — show login form
  if (status === 'unauthorized') {
    return <AdminLoginGate onSuccess={() => setStatus('loading')} />;
  }

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#09203d_0%,#0b3159_100%)]">
      {/* Sidebar */}
      <aside className="fixed z-40 flex h-full w-64 flex-col border-r border-white/8 bg-[rgba(9,32,61,0.86)] backdrop-blur-xl">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0e9f6e_0%,#0e4a71_100%)]">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">AccurateLabs</p>
              <p className="text-xs text-white/40">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-accent/10 text-accent'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <ChevronRight size={18} className="rotate-180" />
            Back to Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[rgba(9,32,61,0.74)] px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">
                {adminNav.find(n => n.href === pathname)?.label || 'Admin'}
              </h2>
              <div className="flex items-center gap-1 text-xs text-white/30">
                <span>Admin</span>
                <ChevronRight size={10} />
                <span className="text-white/60">
                  {adminNav.find(n => n.href === pathname)?.label || 'Dashboard'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-white">{adminName}</p>
                <p className="text-xs text-white/40">{adminEmail}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
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

// ---- Inline Login Gate ----
function AdminLoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Check isAdmin
      const docSnap = await getDoc(doc(db, 'users', cred.user.uid));
      if (docSnap.exists() && docSnap.data()?.isAdmin === true) {
        onSuccess();
      } else {
        await signOut(auth);
        setError('Access denied. You are not an admin.');
      }
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09203d]">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none">AccurateLabs</p>
            <p className="text-xs text-white/40 mt-1">Admin Access Only</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/60 transition-colors"
              placeholder="admin@accuratepathlabs.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/60 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
            {loading ? 'Verifying...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">Unauthorized access is prohibited.</p>
      </div>
    </div>
  );
}
