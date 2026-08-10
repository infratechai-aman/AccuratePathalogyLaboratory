'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getSlots, createSlot, updateSlot } from '@/lib/services/admin-db';
import { Slot, SlotType } from '@/lib/types';
import { Clock, Plus, X, Check, Loader2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SlotsPage() {
  const { tenantId } = useAdmin();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slotType, setSlotType] = useState<SlotType>('lab_visit');

  const [form, setForm] = useState({
    time: '09:00', endTime: '09:30', maxBookings: '5', type: 'lab_visit' as SlotType,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getSlots(tenantId);
        setSlots(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const daySlots = slots
    .filter(s => s.date === selectedDate && s.type === slotType)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleAddSlot = async () => {
    setSaving(true);
    try {
      const id = await createSlot({
        tenantId, date: selectedDate, time: form.time, endTime: form.endTime,
        type: form.type, maxBookings: parseInt(form.maxBookings) || 5,
        currentBookings: 0, available: true, duration: 30,
      });
      setSlots([...slots, {
        id, tenantId, date: selectedDate, time: form.time, endTime: form.endTime,
        type: form.type, maxBookings: parseInt(form.maxBookings), currentBookings: 0, available: true,
      }]);
      setShowAdd(false);
    } catch { alert('Failed to add slot'); }
    finally { setSaving(false); }
  };

  const generateSlots = async () => {
    if (!confirm('Generate default slots for this date?')) return;
    setSaving(true);
    const times = slotType === 'lab_visit'
      ? ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
      : ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

    for (const time of times) {
      const exists = slots.find(s => s.date === selectedDate && s.time === time && s.type === slotType);
      if (!exists) {
        const id = await createSlot({
          tenantId, date: selectedDate, time, type: slotType,
          maxBookings: 5, currentBookings: 0, available: true, duration: slotType === 'lab_visit' ? 30 : 60,
        });
        setSlots(cur => [...cur, { id, tenantId, date: selectedDate, time, type: slotType, maxBookings: 5, currentBookings: 0, available: true }]);
      }
    }
    setSaving(false);
  };

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading slots...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Slots</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Manage booking capacity and time slots</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={generateSlots} className="admin-btn admin-btn-secondary" disabled={saving}>
            {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Clock size={15} />} Generate Slots
          </button>
          <button onClick={() => setShowAdd(true)} className="admin-btn admin-btn-primary">
            <Plus size={15} /> Add Slot
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => changeDate(-1)} className="admin-btn admin-btn-ghost" style={{ padding: 8 }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} style={{ color: '#0D9488' }} />
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="admin-input" style={{ width: 'auto', fontWeight: 700, fontSize: '0.95rem' }} />
        </div>
        <button onClick={() => changeDate(1)} className="admin-btn admin-btn-ghost" style={{ padding: 8 }}>
          <ChevronRight size={18} />
        </button>
        <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
          {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Type Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${slotType === 'lab_visit' ? 'active' : ''}`} onClick={() => setSlotType('lab_visit')}>
          Lab Visit Slots
        </button>
        <button className={`admin-tab ${slotType === 'home_collection' ? 'active' : ''}`} onClick={() => setSlotType('home_collection')}>
          Home Collection Slots
        </button>
      </div>

      {/* Slots Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {daySlots.map(slot => {
          const isFull = slot.currentBookings >= slot.maxBookings;
          const pct = slot.maxBookings > 0 ? (slot.currentBookings / slot.maxBookings) * 100 : 0;
          return (
            <div key={slot.id} className="admin-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{slot.time}</span>
                <span className={`admin-badge ${isFull ? 'admin-badge-cancelled' : 'admin-badge-paid'}`}>
                  {isFull ? 'Full' : 'Open'}
                </span>
              </div>
              <div style={{
                height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden', marginBottom: 8,
              }}>
                <div style={{
                  height: '100%', borderRadius: 3, width: `${pct}%`,
                  background: isFull ? '#DC2626' : pct > 60 ? '#D97706' : '#0D9488',
                  transition: 'width 300ms',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                <span>Capacity: {slot.maxBookings}</span>
                <span>{slot.currentBookings} booked</span>
              </div>
            </div>
          );
        })}
        {daySlots.length === 0 && (
          <div className="admin-card" style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center' }}>
            <Clock size={36} style={{ color: '#CBD5E1', margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 700, color: '#0F172A' }}>No slots for this date</div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4 }}>Click &quot;Generate Slots&quot; to create default time slots</div>
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showAdd && (
        <div className="admin-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700, color: '#0F172A' }}>Add Slot</div>
              <button onClick={() => setShowAdd(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="admin-label">Start Time</label><input type="time" className="admin-input" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /></div>
                <div><label className="admin-label">End Time</label><input type="time" className="admin-input" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} /></div>
              </div>
              <div><label className="admin-label">Max Bookings</label><input type="number" className="admin-input" value={form.maxBookings} onChange={e => setForm({...form, maxBookings: e.target.value})} /></div>
              <div><label className="admin-label">Slot Type</label>
                <select className="admin-select" value={form.type} onChange={e => setForm({...form, type: e.target.value as SlotType})}>
                  <option value="lab_visit">Lab Visit</option><option value="home_collection">Home Collection</option>
                </select></div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowAdd(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleAddSlot} disabled={saving} className="admin-btn admin-btn-primary">
                {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />} Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
