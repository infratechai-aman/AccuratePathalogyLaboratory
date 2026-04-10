'use client';

import React, { useState } from 'react';
import { sampleBookings } from '@/lib/sample-data';
import { BOOKING_STATUSES, Booking } from '@/lib/types';
import { Download, Search } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchSearch =
      !search ||
      booking.patientName.toLowerCase().includes(search.toLowerCase()) ||
      booking.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || booking.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus, updatedAt: new Date() } : booking
      )
    );
  };

  const updatePhlebotomist = (bookingId: string, name: string) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId ? { ...booking, phlebotomistName: name } : booking
      )
    );
  };

  const exportBookings = () => {
    const rows = filteredBookings.map((booking) =>
      [booking.id, booking.patientName, booking.phone, booking.city, booking.date, booking.timeSlot, booking.totalAmount, booking.status].join(',')
    );
    const csv = ['id,patient,phone,city,date,time,amount,status', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'accuratelabs-bookings.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center rounded-xl border border-white/10 bg-[#1a2332] px-4">
          <Search size={16} className="text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by patient name or booking ID..."
            className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#1a2332] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="">All Status</option>
          {BOOKING_STATUSES.map((status) => (
            <option key={status.key} value={status.key}>
              {status.label}
            </option>
          ))}
        </select>
        <button
          onClick={exportBookings}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent/20 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/30"
        >
          <Download size={14} />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {BOOKING_STATUSES.map((status) => {
          const count = bookings.filter((booking) => booking.status === status.key).length;
          return (
            <button
              key={status.key}
              onClick={() => setFilterStatus(filterStatus === status.key ? '' : status.key)}
              className={`rounded-xl border p-4 text-left transition-all ${
                filterStatus === status.key
                  ? 'border-white/20 bg-white/10'
                  : 'border-white/5 bg-[#1a2332] hover:border-white/10'
              }`}
            >
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-xs" style={{ color: status.color }}>
                {status.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a2332]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase text-white/40">
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Test</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Phlebotomist</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-white/60">{booking.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{booking.patientName}</p>
                    <p className="text-xs text-white/30">{booking.phone}</p>
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-white/60">{booking.items[0]?.testName}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-white/60">{booking.date}</p>
                    <p className="text-xs text-white/40">{booking.timeSlot}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">{`\u20B9${booking.totalAmount}`}</td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <select
                      value={booking.status}
                      onChange={(event) => updateStatus(booking.id, event.target.value as Booking['status'])}
                      className={`cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold outline-none ${
                        booking.status === 'completed'
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : booking.status === 'pending'
                            ? 'bg-amber-400/10 text-amber-400'
                            : booking.status === 'processing'
                              ? 'bg-purple-400/10 text-purple-400'
                              : 'bg-blue-400/10 text-blue-400'
                      }`}
                    >
                      {BOOKING_STATUSES.map((status) => (
                        <option key={status.key} value={status.key} className="bg-[#1a2332] text-white">
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="text"
                      value={booking.phlebotomistName || ''}
                      onChange={(event) => updatePhlebotomist(booking.id, event.target.value)}
                      placeholder="Assign..."
                      className="w-28 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none focus:border-accent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#1a2332] p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Booking: {selectedBooking.id}</h2>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="mb-1 text-xs text-white/40">Patient</p>
                  <p className="font-medium text-white">{selectedBooking.patientName}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="mb-1 text-xs text-white/40">Phone</p>
                  <p className="font-medium text-white">{selectedBooking.phone}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="mb-1 text-xs text-white/40">City</p>
                  <p className="font-medium text-white">{selectedBooking.city}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="mb-1 text-xs text-white/40">Amount</p>
                  <p className="font-bold text-emerald-400">{`\u20B9${selectedBooking.totalAmount}`}</p>
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="mb-1 text-xs text-white/40">Address</p>
                <p className="text-white">{selectedBooking.address}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="mb-1 text-xs text-white/40">Tests</p>
                {selectedBooking.items.map((item) => (
                  <p key={item.testId} className="text-white">{`${item.testName} - \u20B9${item.price}`}</p>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-4 w-full rounded-xl bg-white/5 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
