'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import { Calendar, FileText, User, Users, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/reports', label: 'My Reports', icon: FileText },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ClientLayout>
      <div className="min-h-screen bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-[180px] bg-white rounded-2xl border border-border/50 overflow-hidden">
                {/* User info */}
                <div className="p-5 bg-gradient-to-br from-primary to-primary-light text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <User size={20} />
                  </div>
                  <p className="font-bold">Rahul Sharma</p>
                  <p className="text-white/70 text-xs">rahul@example.com</p>
                </div>
                <nav className="p-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-muted hover:text-primary hover:bg-surface'
                      }`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile nav */}
              <div className="lg:hidden flex gap-2 overflow-x-auto scroll-container pb-4 mb-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap ${
                      pathname === item.href
                        ? 'bg-primary text-white'
                        : 'bg-white text-text-muted border border-border'
                    }`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </Link>
                ))}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
