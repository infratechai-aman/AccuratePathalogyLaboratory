'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CitySelector from '@/components/layout/CitySelector';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CitySelector />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
