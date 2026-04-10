'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FlaskConical, Calendar, FileText, Clock, Users,
  ChevronRight, LogOut, Shield
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
        <div className="p-3 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <LogOut size={18} />
            Back to Site
          </Link>
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
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-white/40">admin@accuratelabs.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-bold text-sm">
                A
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
