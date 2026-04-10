'use client';

import React from 'react';
import { useCity } from '@/context/CityContext';
import { CITIES } from '@/lib/types';
import { X, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

export default function CitySelector() {
  const { showCityModal, setShowCityModal, selectedCity, setSelectedCity } = useCity();
  const [search, setSearch] = useState('');

  if (!showCityModal) return null;

  const filtered = search
    ? CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : CITIES;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCityModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <h2 className="text-lg font-bold text-primary">Select Your City</h2>
          <button onClick={() => setShowCityModal(false)} className="p-1.5 rounded-lg hover:bg-surface transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5 border border-border/50 focus-within:border-accent transition-colors">
            <Search size={16} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Cities grid */}
        <div className="p-4 grid grid-cols-2 gap-2 max-h-[300px] overflow-auto">
          {filtered.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all ${
                selectedCity === city
                  ? 'bg-accent/10 border-2 border-accent text-accent'
                  : 'bg-surface hover:bg-surface-alt border-2 border-transparent text-primary'
              }`}
            >
              <MapPin size={16} className={selectedCity === city ? 'text-accent' : 'text-text-muted'} />
              <span className="text-sm font-medium">{city}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-text-muted text-sm">
            No cities found for &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
