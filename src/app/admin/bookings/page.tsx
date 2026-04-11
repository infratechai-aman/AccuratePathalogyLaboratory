'use client';

import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '@/lib/services/db';
import { BOOKING_STATUSES, Booking } from '@/lib/types';
import { Download, Search, X, Phone, MapPin, Calendar, Clock, IndianRupee, FlaskConical } from 'lucide-react';

const statusStyle: Record<string, { bg: string; text: string; selectBg: string }> = {
  pending:    { bg: 'bg-amber-100',   text: 'text-amber-700',   selectBg: 'bg-amber-50' },
  processing: { bg: 'bg-blue-100',    text: 'text-blue-700',    selectBg: 'bg-blue-50' },
  completed:  { bg: 'bg-emerald-100', text: 'text-emerald-700', selectBg: 'bg-emerald-50' },
  cancelled:  { bg: 'bg-red-100',     text: 'text-red-700',     selectBg: 'bg-red-50' },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.patientName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(cur =>
        cur.map(b => b.id === bookingId ? { ...b, status: newStatus, updatedAt: new Date() } : b)
      );
    } catch {
      alert('Failed to update booking status. Please check Firestore rules.');
    }
  };

  const exportBookings = () => {
    const rows = filteredBookings.map(b =>
      [b.id, b.patientName, b.phone, b.city, b.date, b.timeSlot, b.totalAmount, b.status].join(',')
    );
    const csv = ['id,patient,phone,city,date,time,amount,status', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'accuratelabs-bookings.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Status Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BOOKING_STATUSES.map((s) => {
          const count = bookings.filter(b => b.status === s.key).length;
          const active = filterStatus === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setFilterStatus(active ? '' : s.key)}
              className={`rounded-2xl border-2 p-4 text-left transition-all shadow-sm ${
                active ? 'border-[#0A2540] bg-[#0A2540] text-white shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <p className={`text-3xl font-black mb-1 ${active ? 'text-white' : 'text-[#0A2540]'}`}>{count}</p>
              <p className={`text-xs font-semibold ${active ? 'text-white/70' : 'text-gray-400'}`} style={{ color: active ? undefined : s.color }}>
                {s.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search + Filter + Export */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name or booking ID..."
            className="w-full py-3 text-sm text-[#0A2540] outline-none placeholder:text-gray-300 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={15} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0A2540] outline-none shadow-sm"
        >
          <option value="">All Statuses</option>
          {BOOKING_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button
          onClick={exportBookings}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-5 py-3 text-sm font-bold text-white hover:bg-[#0e3460] transition-colors shadow-sm"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#0A2540]">All Bookings</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-semibold">{filteredBookings.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-wider">
                <th className="text-left py-3 px-5">Booking ID</th>
                <th className="text-left py-3 px-5">Patient</th>
                <th className="text-left py-3 px-5">Test</th>
                <th className="text-left py-3 px-5">Schedule</th>
                <th className="text-left py-3 px-5">Amount</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Phlebotomist</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                    <Calendar size={36} className="mx-auto mb-3 text-gray-200" />
                    {search || filterStatus ? 'No bookings match your filters.' : 'No bookings yet.'}
                  </td>
                </tr>
              ) : filteredBookings.map((b) => {
                const sc = statusStyle[b.status] || statusStyle['pending'];
                return (
                  <tr
                    key={b.id}
                    className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td className="py-4 px-5 font-mono text-xs text-gray-400">{b.id.slice(0, 10)}...</td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#0A2540]">{b.patientName}</p>
                      <p className="text-xs text-gray-400">{b.phone}</p>
                    </td>
                    <td className="py-4 px-5 text-gray-500 max-w-[200px] truncate">{b.items[0]?.testName || '—'}</td>
                    <td className="py-4 px-5">
                      <p className="text-xs font-semibold text-gray-600">{b.date}</p>
                      <p className="text-xs text-gray-400">{b.timeSlot}</p>
                    </td>
                    <td className="py-4 px-5 font-bold text-emerald-600">₹{b.totalAmount}</td>
                    <td className="py-4 px-5" onClick={e => e.stopPropagation()}>
                      <select
                        value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value as Booking['status'])}
                        className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold outline-none border-0 ${sc.bg} ${sc.text}`}
                      >
                        {BOOKING_STATUSES.map(s => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-5" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={b.phlebotomistName || ''}
                        onChange={e => setBookings(cur => cur.map(bk => bk.id === b.id ? { ...bk, phlebotomistName: e.target.value } : bk))}
                        placeholder="Assign..."
                        className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-[#0A2540] outline-none focus:border-[#0A2540] transition-colors"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-[#0A2540] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">Booking Details</p>
                <p className="text-white/50 text-xs font-mono mt-0.5">{selectedBooking.id}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X size={15} className="text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1"><FlaskConical size={11}/> Patient</p>
                  <p className="font-bold text-[#0A2540]">{selectedBooking.patientName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1"><Phone size={11}/> Phone</p>
                  <p className="font-bold text-[#0A2540]">{selectedBooking.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1"><MapPin size={11}/> City</p>
                  <p className="font-bold text-[#0A2540]">{selectedBooking.city}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1"><IndianRupee size={11}/> Amount</p>
                  <p className="font-black text-emerald-600 text-lg">₹{selectedBooking.totalAmount}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1"><Calendar size={11}/> Date</p>
                  <p className="font-bold text-[#0A2540]">{selectedBooking.date}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1"><Clock size={11}/> Time Slot</p>
                  <p className="font-bold text-[#0A2540]">{selectedBooking.timeSlot}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1"><MapPin size={11}/> Address</p>
                <p className="text-sm text-[#0A2540]">{selectedBooking.address}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-2">Tests Booked</p>
                <div className="space-y-2">
                  {selectedBooking.items.map(item => (
                    <div key={item.testId} className="flex items-center justify-between">
                      <p className="text-sm text-[#0A2540] font-medium">{item.testName}</p>
                      <p className="text-sm font-bold text-emerald-600">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-[#0A2540] hover:bg-[#0e3460] text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
