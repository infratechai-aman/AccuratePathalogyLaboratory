'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { ROLE_LABELS } from '@/lib/permissions';
import './admin.css';
import {
  LayoutDashboard, Calendar, Users, FileText, Truck, FlaskConical,
  Clock, IndianRupee, MessageSquare, BarChart3, Settings, ChevronDown,
  ChevronRight, LogOut, Search, Bell, Menu, X, Mail, Lock,
  Eye, EyeOff, Shield, Loader2, HelpCircle, Receipt
} from 'lucide-react';

// ---- Sidebar Navigation Config ----
const sidebarItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/patients', label: 'Patients', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/collections', label: 'Collections', icon: Truck },
  { href: '/admin/tests', label: 'Tests & Packages', icon: FlaskConical },
  { href: '/admin/slots', label: 'Slots', icon: Clock },
  {
    label: 'Payments & Expenses',
    icon: IndianRupee,
    children: [
      { href: '/admin/payments', label: 'Payments', icon: IndianRupee },
      { href: '/admin/expenses', label: 'Expenses', icon: Receipt },
    ],
  },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: 0 },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('unauthorized');

  useEffect(() => {
    if (auth.currentUser) setStatus('checking');
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setStatus('unauthorized'); return; }
      setStatus('checking');
      try {
        // Check staff collection first
        const staffSnap = await getDoc(doc(db, 'staff', user.uid));
        if (staffSnap.exists() && staffSnap.data()?.active !== false) {
          setStatus('authorized');
          return;
        }
        // Fallback to legacy users collection
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists() && userSnap.data()?.isAdmin === true) {
          setStatus('authorized');
          return;
        }
        await signOut(auth);
        setStatus('unauthorized');
      } catch {
        setStatus('unauthorized');
      }
    });
    return () => unsub();
  }, []);

  if (status === 'checking') {
    return (
      <div className="admin-loading" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <div className="admin-spinner" />
        <p className="admin-loading-text">Verifying access...</p>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <AdminLoginGate onSuccess={() => setStatus('authorized')} />;
  }

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}

// ================================================================
// Admin Shell (Sidebar + Header + Content)
// ================================================================
function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { staffUser, tenant, can } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-expand payments submenu if on a payments/expenses page
  useEffect(() => {
    if (pathname?.startsWith('/admin/payments') || pathname?.startsWith('/admin/expenses')) {
      setPaymentsOpen(true);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = '/admin';
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href) || false;
  };

  const roleName = staffUser ? ROLE_LABELS[staffUser.role] : 'Admin';
  const userName = staffUser?.name || 'Admin';
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="admin-panel" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 39, background: 'rgba(0,0,0,0.3)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <Link href="/admin" style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
            <div className="admin-sidebar-logo-text">
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #0D9488, #0F766E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '0.8rem'
              }}>
                IT
              </div>
              InfraTechAI
            </div>
            <span className="admin-sidebar-logo-tagline">Smart Labs. Stronger Tomorrow.</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item) => {
            // Items with children (Payments & Expenses)
            if ('children' in item && item.children) {
              const isChildActive = item.children.some(c => isActive(c.href));
              return (
                <div key={item.label}>
                  <button
                    className={`admin-nav-item ${isChildActive ? 'active' : ''}`}
                    onClick={() => setPaymentsOpen(!paymentsOpen)}
                  >
                    <item.icon size={18} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <ChevronDown
                      size={14}
                      style={{
                        transform: paymentsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms',
                      }}
                    />
                  </button>
                  {paymentsOpen && (
                    <div className="admin-nav-submenu">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`admin-nav-item ${isActive(child.href) ? 'active' : ''}`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <child.icon size={16} />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Regular items
            const navItem = item as { href: string; label: string; icon: any; badge?: number };
            return (
              <Link
                key={navItem.href}
                href={navItem.href}
                className={`admin-nav-item ${isActive(navItem.href) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <navItem.icon size={18} />
                <span style={{ flex: 1 }}>{navItem.label}</span>
                {navItem.badge !== undefined && navItem.badge > 0 && (
                  <span className="admin-nav-badge">{navItem.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-help-card">
            <p><HelpCircle size={16} style={{ display: 'inline', verticalAlign: -3, marginRight: 4 }} />Need Help?</p>
            <span>We&apos;re here to support you</span>
            <button className="admin-help-btn">Contact Support</button>
          </div>

          <button
            onClick={handleSignOut}
            className="admin-nav-item"
            style={{ marginTop: 8, color: '#DC2626' }}
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <div className="admin-version">© 2025 InfraTechAI. All rights reserved.</div>
          <div className="admin-version">Version 1.0.0</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          {/* Mobile menu toggle */}
          <button
            className="admin-mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Search */}
          <div className="admin-header-search">
            <Search size={16} style={{ color: '#94A3B8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search patients, bookings, tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right side */}
          <div className="admin-header-actions">
            {/* Date */}
            <div className="admin-date-picker" style={{ display: 'none' }}>
              {/* Hidden on mobile */}
            </div>
            <span className="admin-date-picker" suppressHydrationWarning>
              <Calendar size={14} />
              {today}
            </span>

            {/* Notifications */}
            <Link href="/admin/messages" className="admin-header-notif">
              <Bell size={20} />
              <span className="admin-header-notif-badge">3</span>
            </Link>

            {/* User */}
            <div className="admin-header-user">
              <div className="admin-header-user-info">
                <div className="admin-header-user-name">{userName}</div>
                <div className="admin-header-user-role">{roleName}</div>
              </div>
              <div className="admin-header-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

// ================================================================
// Admin Login Gate
// ================================================================
function AdminLoginGate({ onSuccess }: { onSuccess: () => void }) {
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

      // Check staff collection first
      const staffSnap = await getDoc(doc(db, 'staff', cred.user.uid));
      if (staffSnap.exists() && staffSnap.data()?.active !== false) {
        onSuccess();
        return;
      }

      // Fallback to legacy users collection
      const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
      if (userSnap.exists() && userSnap.data()?.isAdmin === true) {
        onSuccess();
        return;
      }

      await signOut(auth);
      setError('Access denied. You do not have admin privileges.');
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
    <div className="admin-panel" style={{
      minHeight: '100vh', background: '#F8FAFC',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="admin-card" style={{ overflow: 'hidden' }}>
          {/* Top accent */}
          <div style={{
            height: 4,
            background: 'linear-gradient(90deg, #0D9488, #059669, #0F766E)'
          }} />

          <div style={{ padding: 32 }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #0D9488, #0F766E)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: 12
              }}>
                IT
              </div>
              <h1 style={{
                fontSize: '1.3rem', fontWeight: 800, color: '#0F172A',
                margin: '0 0 4px', letterSpacing: '-0.02em'
              }}>
                InfraTechAI
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Smart Labs. Stronger Tomorrow.
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                Admin Sign In
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4 }}>
                Access restricted to authorized staff only.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="admin-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="admin-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="admin@lab.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="admin-input"
                    style={{ paddingLeft: 36, paddingRight: 40 }}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#FEE2E2', borderRadius: 10, padding: '10px 14px'
                }}>
                  <Shield size={15} style={{ color: '#DC2626', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.82rem', color: '#DC2626', margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn-primary"
                style={{
                  width: '100%', padding: '12px 16px', fontSize: '0.875rem',
                  marginTop: 4, opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'admin-spin 0.7s linear infinite' }} />
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

            <p style={{
              textAlign: 'center', fontSize: '0.68rem', color: '#94A3B8', marginTop: 24
            }}>
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link
            href="/"
            style={{ fontSize: '0.82rem', color: '#64748B', textDecoration: 'none', fontWeight: 600 }}
          >
            ← Back to main site
          </Link>
        </p>
      </div>
    </div>
  );
}
