'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CITIES } from '@/lib/types';

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  showCityModal: boolean;
  setShowCityModal: (show: boolean) => void;
}

const CityContext = createContext<CityContextType | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState(() => {
    if (typeof window === 'undefined') return 'Hadapsar';
    const saved = localStorage.getItem('accuratelabs-city');
    return saved && CITIES.includes(saved) ? saved : 'Hadapsar';
  });
  const [showCityModal, setShowCityModal] = useState(false);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem('accuratelabs-city', city);
    setShowCityModal(false);
  };

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, showCityModal, setShowCityModal }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
}
