'use client';

import React, { useState } from 'react';
import { sampleSlots } from '@/lib/sample-data';
import { CITIES, Slot } from '@/lib/types';
import { Plus, Calendar, Clock, MapPin, Trash2, Users } from 'lucide-react';

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
        <p className="text-gray-500 font-semibold text-sm bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm">{filteredSlots.length} slots found</p>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-[#0A2540] hover:bg-[#0e3460] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={16} /> Create Slots
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#0A2540] font-semibold outline-none shadow-sm focus:border-[#0A2540]">
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#0A2540] font-semibold outline-none shadow-sm focus:border-[#0A2540]" />
      </div>

      {/* Create form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setBulkMode(false)} className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${!bulkMode ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-[#0A2540]'}`}>
              Single Slot
            </button>
            <button onClick={() => setBulkMode(true)} className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${bulkMode ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-[#0A2540]'}`}>
              Bulk Create
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">{bulkMode ? 'Start Date' : 'Date'}</label>
              <input type="date" value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm outline-none focus:border-[#0A2540]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">City</label>
              <select value={newSlot.city} onChange={e => setNewSlot({...newSlot, city: e.target.value})}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm outline-none focus:border-[#0A2540]">
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Max Bookings</label>
              <input type="number" value={newSlot.maxBookings} onChange={e => setNewSlot({...newSlot, maxBookings: Number(e.target.value)})}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm outline-none focus:border-[#0A2540]" />
            </div>
            {bulkMode && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Days</label>
                <input type="number" value={bulkDays} onChange={e => setBulkDays(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm outline-none focus:border-[#0A2540]" />
              </div>
            )}
          </div>

          {bulkMode ? (
            <button onClick={bulkCreate} className="bg-[#E53E3E] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} /> Create {bulkDays * 4} Slots
            </button>
          ) : (
            <button onClick={addSlot} className="bg-[#E53E3E] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} /> Create Slot
            </button>
          )}
        </div>
      )}

      {/* Slots by date */}
      {dates.map(date => (
        <div key={date} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Calendar size={16} className="text-[#0A2540]" />
            <span className="text-[#0A2540] font-black text-sm">
              {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSlots.filter(s => s.date === date).map(slot => (
              <div key={slot.id} className={`p-4 rounded-xl border transition-colors ${
                slot.available ? 'bg-white border-gray-200 hover:border-[#0A2540]' : 'bg-red-50/50 border-red-100'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`flex items-center gap-1.5 text-sm font-bold ${slot.available ? 'text-[#0A2540]' : 'text-gray-400'}`}>
                    <Clock size={14} className={slot.available ? 'text-[#0A2540]' : 'text-gray-400'} /> {slot.time}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleAvailable(slot.id)}
                      className={`text-[10px] uppercase font-black px-2 py-1 rounded-full tracking-wider ${
                        slot.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {slot.available ? 'Active' : 'Disabled'}
                    </button>
                    <button onClick={() => deleteSlot(slot.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {slot.city}</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {slot.currentBookings}/{slot.maxBookings}
                    {slot.currentBookings >= slot.maxBookings && <span className="text-red-500 font-bold ml-1">FULL</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {dates.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-gray-400">
          <Calendar size={48} className="mb-4 text-gray-200" />
          <p className="font-semibold text-gray-500">No slots found</p>
          <p className="text-sm mt-1">Adjust your filters or create new slots.</p>
        </div>
      )}
    </div>
  );
}
