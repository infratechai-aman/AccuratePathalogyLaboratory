'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  Home,
  MapPin,
  Menu,
  Phone,
  ShoppingCart,
  User,
  Building2,
  Headphones,
  BookOpen,
  Info,
  ShieldCheck,
  Users,
  Handshake,
  Dna,
  Newspaper,
  Activity,
  Sparkles
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/reports', label: 'My Reports', icon: FileText },
];

const sidebarItems = [
  { href: '/locations', label: 'Lab Locations', icon: Building2 },
  { href: '/support', label: 'Help & Support', icon: Headphones },
  { href: '/blog', label: 'Health Blog', icon: BookOpen },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/quality', label: 'Quality Assurance At Accurate Pathology Laboratory', icon: ShieldCheck },
  { href: '/partnerships', label: 'Partnerships', icon: Users },
  { href: '/franchise', label: 'Franchise Opportunity', icon: Handshake },
  { href: '/genetics', label: 'Genetics', icon: Dna },
  { href: '/media', label: 'Media Coverage', icon: Newspaper },
  { href: '/radiology', label: 'Radiology', icon: Activity },
];

export default function Header() {
  const { state } = useCart();
  const { selectedCity, setShowCityModal } = useCity();
  const { user, appUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Row */}
        <div className="bg-white px-6 py-4">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between">
            {/* Left: Logo & Location */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center hover:opacity-90 transition-opacity pb-1">
                 <Image src="/images/logo.png" alt="Accurate Pathology Laboratory" width={240} height={60} className="object-contain" priority />
              </Link>
              
              {/* Location Dropdown */}
              <div 
                onClick={() => setShowCityModal(true)}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
               >
                <MapPin size={16} className="text-gray-700" />
                <span className="text-sm font-bold text-gray-900">{selectedCity || 'Hadapsar'}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </div>
            </div>

            {/* Right: Cart & Profile */}
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="relative flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50 hover:border-gray-300"
              >
                Cart
                <ShoppingCart size={18} className="text-gray-700" />
                {state.totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                    {state.totalItems}
                  </span>
                )}
              </Link>
              <div className="relative group">
                {user ? (
                  <>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50 hover:border-gray-300"
                    >
                      {appUser?.name?.split(' ')[0] || 'Profile'}
                      <div className="w-5 h-5 rounded-full bg-[#1b4372] text-white flex items-center justify-center text-[10px]">
                         {appUser?.name?.[0]?.toUpperCase() || <User size={12} />}
                      </div>
                    </Link>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col overflow-hidden">
                      <Link href="/dashboard/bookings" className="px-4 py-3 text-sm font-medium hover:bg-gray-50 text-gray-700">My Bookings</Link>
                      <Link href="/dashboard/profile" className="px-4 py-3 text-sm font-medium hover:bg-gray-50 text-gray-700">Profile Settings</Link>
                      <button onClick={logout} className="px-4 py-3 text-sm font-medium text-left hover:bg-red-50 text-red-600 border-t border-gray-100">Sign Out</button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50 hover:border-gray-300 bg-white"
                  >
                    Login / Sign up
                    <User size={18} className="text-gray-700" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Navigation */}
        <div className="border-t border-gray-100 bg-[#fafafa]">
          <div className="mx-auto flex h-[56px] max-w-[1280px] items-center justify-center gap-12 lg:gap-24 px-6">
            {/* Phone Number */}
            <div className="flex items-center gap-2 text-[#0A2540] text-[15px] font-bold">
              <Phone size={18} className="text-[#0A2540]" />
              <span>884 065 8081</span>
            </div>

            <div className="flex items-center gap-10">
              {/* Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-red-600 transition-colors"
              >
                <Menu size={20} />
                Menu
              </button>

              {/* Nav Links */}
              <div className="flex items-center gap-6 lg:gap-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`${isActive(item.href) ? 'text-red-600' : 'text-gray-700'} flex items-center gap-2 text-[15px] font-bold hover:text-red-600 transition-colors whitespace-nowrap`}>
                    <item.icon size={18} className={isActive(item.href) ? 'text-red-600' : 'text-gray-500'} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex flex-col">
               <span className="text-xl font-black uppercase tracking-wider leading-none text-[#0F213E]" style={{ fontFamily: 'Georgia, serif' }}>Accurate</span>
               <span className="text-[7.5px] font-bold tracking-[0.1em] text-[#E53E3E] uppercase mt-0.5">Pathalogy Laboratory</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-full px-2 py-1" onClick={() => setShowCityModal(true)}>
                  <MapPin size={12} className="text-gray-700 mr-1" />
                  <span className="text-xs font-bold text-gray-900">{selectedCity || 'Hadapsar'}</span>
              </div>
                
              <Link
                href="/cart"
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart size={14} />
                {state.totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                    {state.totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Menu size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Menu (Mobile & Desktop) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70]" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
          <nav
            className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-[#f4f4f4] shadow-2xl transition-transform flex flex-col pt-safe pb-safe"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="px-4 py-4 flex items-center h-16 bg-white border-b border-gray-200">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-900 hover:text-red-600 transition-colors font-bold text-[16px]"
              >
                <ChevronLeft size={22} className="stroke-[2.5]" /> My Menu
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
                {sidebarItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-row items-center justify-between px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon size={18} className="text-gray-700 group-hover:text-red-600 transition-colors" />
                      <span className="text-[14px] font-medium text-gray-800">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Bottom Login Action */}
            <div className="p-4 bg-white border-t border-gray-200 mt-auto flex flex-col gap-2">
                 {user ? (
                   <>
                     <div className="flex items-center gap-3 px-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#1b4372] text-white flex items-center justify-center font-bold">
                           {appUser?.name?.[0]?.toUpperCase() || <User size={20} />}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">{appUser?.name || 'User'}</p>
                           <p className="text-xs text-gray-500">{appUser?.phone || appUser?.email}</p>
                        </div>
                     </div>
                     <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm">
                         View Profile
                     </Link>
                     <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center justify-center w-full gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-bold hover:bg-red-100 transition-colors shadow-sm">
                         Sign Out
                     </button>
                   </>
                 ) : (
                   <button onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }} className="flex items-center justify-center w-full gap-2 rounded-xl border border-[#1b4372] bg-[#1b4372] text-white px-4 py-3 text-[15px] font-bold hover:bg-[#122e50] transition-colors shadow-sm">
                       <User size={18} />   
                       Sign In / Log In
                   </button>
                 )}
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between bg-white px-6 py-2 pb-safe border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        {[
          { href: '/', icon: Home, label: 'Home' },
          { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
          { href: '/health-tools/bmi', icon: Sparkles, label: 'Care', featured: true },
          { href: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
          { href: '/dashboard/profile', icon: User, label: 'Profile' },
        ].map((item) => (
           <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1 relative z-10">
                {item.featured ? (
                   <>
                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#6b1e5b] to-[#dc2626] text-white shadow-md relative -top-1">
                          <item.icon size={24} strokeWidth={2} className="text-white fill-white/10" />
                     </div>
                     <span className="text-[10px] font-bold text-gray-800 -mt-2">{item.label}</span>
                   </>
                ) : (
                    <div className="flex flex-col items-center gap-1 pt-2 pb-1">
                        <item.icon size={22} className={isActive(item.href) ? 'text-red-600' : 'text-gray-400'} />
                        <span className={`text-[10px] font-bold ${isActive(item.href) ? 'text-red-600' : 'text-gray-500'}`}>{item.label}</span>
                    </div>
                )}
           </Link>
        ))}
      </nav>
    </>
  );
}
