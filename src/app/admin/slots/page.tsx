'use client';

import React, { useState } from 'react';
import { sampleSlots } from '@/lib/sample-data';
import { CITIES, Slot } from '@/lib/types';
import { Plus, Calendar, Clock, MapPin, X, Save, Trash2, Users } from 'lucide-react';

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>(sampleSlots);
  const [showAdd, setShowAdd] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [newSlot, setNewSlot] = useState({
    date: '', startTime: '07:00', endTime: '08:00', city: 'Delhi', maxBookings: 5,
  });

  // Bulk creation
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkDays, setBulkDays] = useState(7);

  const filteredSlots = slots.filter(s => {
    const matchCity = !filterCity || s.city === filterCity;
    const matchDate = !filterDate || s.date === filterDate;
    return matchCity && matchDate;
  });

  const addSlot = () => {
    const slot: Slot = {
      id: 'slot-' + Date.now(),
      date: newSlot.date,
      time: `${newSlot.startTime} AM - ${newSlot.endTime} AM`,
      city: newSlot.city,
      maxBookings: newSlot.maxBookings,
      currentBookings: 0,
      available: true,
    };
    setSlots([slot, ...slots]);
    if (!bulkMode) setShowAdd(false);
  };

  const bulkCreate = () => {
    const startDate = new Date(newSlot.date || Date.now());
    const times = ['07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM'];
    const newSlots: Slot[] = [];

    for (let d = 0; d < bulkDays; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);
      const dateStr = date.toISOString().split('T')[0];

      times.forEach((time, i) => {
        newSlots.push({
          id: `slot-bulk-${dateStr}-${i}`,
          date: dateStr,
          time,
          city: newSlot.city,
          maxBookings: newSlot.maxBookings,
          currentBookings: 0,
          available: true,
        });
      });
    }

    setSlots([...newSlots, ...slots]);
    setShowAdd(false);
  };

  const toggleAvailable = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, available: !s.available } : s));
  };

  const deleteSlot = (id: string) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  // Group by date
  const dates = [...new Set(filteredSlots.map(s => s.date))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">{filteredSlots.length} slots</p>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary rounded-xl">
          <Plus size={16} /> Create Slots
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
          className="px-4 py-3 bg-[#1a2332] border border-white/10 rounded-xl text-sm text-white outline-none">
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="px-4 py-3 bg-[#1a2332] border border-white/10 rounded-xl text-sm text-white outline-none" />
      </div>

      {/* Create form */}
      {showAdd && (
        <div className="bg-[#1a2332] rounded-2xl border border-white/5 p-6 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setBulkMode(false)} className={`text-sm font-semibold px-4 py-2 rounded-lg ${!bulkMode ? 'bg-accent/10 text-accent' : 'text-white/50'}`}>
              Single Slot
            </button>
            <button onClick={() => setBulkMode(true)} className={`text-sm font-semibold px-4 py-2 rounded-lg ${bulkMode ? 'bg-accent/10 text-accent' : 'text-white/50'}`}>
              Bulk Create
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1">{bulkMode ? 'Start Date' : 'Date'}</label>
              <input type="date" value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1">City</label>
              <select value={newSlot.city} onChange={e => setNewSlot({...newSlot, city: e.target.value})}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent">
                {CITIES.map(c => <option key={c} value={c} className="bg-[#1a2332]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1">Max Bookings</label>
              <input type="number" value={newSlot.maxBookings} onChange={e => setNewSlot({...newSlot, maxBookings: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
            </div>
            {bulkMode && (
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1">Days</label>
                <input type="number" value={bulkDays} onChange={e => setBulkDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
              </div>
            )}
          </div>

          {bulkMode ? (
            <button onClick={bulkCreate} className="btn-primary rounded-xl">
              <Plus size={14} /> Create {bulkDays * 4} Slots
            </button>
          ) : (
            <button onClick={addSlot} className="btn-primary rounded-xl">
              <Plus size={14} /> Create Slot
            </button>
          )}
        </div>
      )}

      {/* Slots by date */}
      {dates.map(date => (
        <div key={date} className="bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            <span className="text-white font-semibold text-sm">
              {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSlots.filter(s => s.date === date).map(slot => (
              <div key={slot.id} className={`p-4 rounded-xl border transition-colors ${
                slot.available ? 'bg-white/5 border-white/5' : 'bg-red-400/5 border-red-400/10'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-sm text-white">
                    <Clock size={12} className="text-accent" /> {slot.time}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleAvailable(slot.id)}
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        slot.available ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                      }`}>
                      {slot.available ? 'Active' : 'Disabled'}
                    </button>
                    <button onClick={() => deleteSlot(slot.id)} className="p-1 text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {slot.city}</span>
                  <span className="flex items-center gap-1">
                    <Users size={10} /> {slot.currentBookings}/{slot.maxBookings}
                    {slot.currentBookings >= slot.maxBookings && <span className="text-red-400 ml-1">Full</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
