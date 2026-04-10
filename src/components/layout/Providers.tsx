'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { CityProvider } from '@/context/CityContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CityProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </CityProvider>
  );
}
