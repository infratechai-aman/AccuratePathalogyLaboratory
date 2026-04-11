'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { CityProvider } from '@/context/CityContext';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CityProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </CityProvider>
  );
}
