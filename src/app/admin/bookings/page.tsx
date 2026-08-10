'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { getBookings, updateBookingStatus } from '@/lib/services/admin-db';
import { Booking, BOOKING_STATUSES, BookingStatus } from '@/lib/types';
import {
  Search, X, Calendar, Download, Plus, Filter,
  ChevronRight, MoreVertical, Phone, MapPin, Clock,
  IndianRupee, FlaskConical, Eye
} from 'lucide-react';

export default function AdminBookingsPage() {
  const { tenantId, staffUser } = useAdmin();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBookings(tenantId);
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tenantId]);

  const filteredBookings = bookings.filter((b) => {
    const term = search.toLowerCase();
    const matchSearch = !search ||
      b.patientName.toLowerCase().includes(term) ||
      b.patientPhone?.includes(term) ||
      (b.bookingId || b.id).toLowerCase().includes(term);
    const matchStatus = !filterStatus || b.status === filterStatus;
    const matchType = !filterType || b.collectionType === filterType;
    const matchSource = !filterSource || b.source === filterSource;
    const matchDate = !filterDate || b.date === filterDate;
    return matchSearch && matchStatus && matchType && matchSource && matchDate;
  });

  const handleStatusChange = async (bookingId: string, firestoreId: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(firestoreId, newStatus);
      setBookings(cur =>
        cur.map(b => b.id === firestoreId ? { ...b, status: newStatus, updatedAt: new Date() } : b)
      );
    } catch {
      alert('Failed to update status.');
    }
  };

  const exportCSV = () => {
    const header = 'Booking ID,Patient,Phone,Test,Type,Source,Date,Time,Amount,Status,Payment';
    const rows = filteredBookings.map(b => [
      b.bookingId || b.id, b.patientName, b.patientPhone,
      b.items?.[0]?.testName || '', b.collectionType, b.source,
      b.date, b.timeSlot, b.totalAmount, b.status, b.paymentStatus
    ].join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bookings.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p className="admin-loading-text">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Bookings</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Manage all lab and home collection bookings</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportCSV} className="admin-btn admin-btn-secondary">
            <Download size={15} /> Export
          </button>
          <Link href="/admin/bookings/new" className="admin-btn admin-btn-primary">
            <Plus size={15} /> New Booking
          </Link>
        </div>
      </div>

      {/* Status Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        {BOOKING_STATUSES.map((s) => {
          const count = bookings.filter(b => b.status === s.key).length;
          const isActive = filterStatus === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setFilterStatus(isActive ? '' : s.key)}
              className="admin-stat-card"
              style={{
                cursor: 'pointer', border: isActive ? `2px solid ${s.color}` : undefined,
                padding: 14, textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{count}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: s.color }}>{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div className="admin-header-search" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ color: '#94A3B8', flexShrink: 0 }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, or booking ID..."
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={14} style={{ color: '#94A3B8' }} />
            </button>
          )}
        </div>

        {/* Quick date filters */}
        <div className="admin-filter-bar">
          <button
            className={`admin-filter-chip ${filterDate === today ? 'active' : ''}`}
            onClick={() => setFilterDate(filterDate === today ? '' : today)}
          >Today</button>
          <button
            className={`admin-filter-chip ${filterDate === tomorrow ? 'active' : ''}`}
            onClick={() => setFilterDate(filterDate === tomorrow ? '' : tomorrow)}
          >Tomorrow</button>
        </div>

        {/* Type filter */}
        <select
          value={filterType} onChange={e => setFilterType(e.target.value)}
          className="admin-select" style={{ width: 'auto', minWidth: 140 }}
        >
          <option value="">All Types</option>
          <option value="lab_visit">Lab Visit</option>
          <option value="home_collection">Home Collection</option>
        </select>

        {/* Source filter */}
        <select
          value={filterSource} onChange={e => setFilterSource(e.target.value)}
          className="admin-select" style={{ width: 'auto', minWidth: 140 }}
        >
          <option value="">All Sources</option>
          <option value="online">Online</option>
          <option value="walk_in">Walk-in</option>
          <option value="phone">Phone</option>
          <option value="staff_created">Staff Created</option>
        </select>

        {/* Date picker */}
        <input
          type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="admin-input" style={{ width: 'auto', maxWidth: 160 }}
        />

        {(filterStatus || filterType || filterSource || filterDate || search) && (
          <button
            className="admin-btn admin-btn-ghost"
            onClick={() => { setFilterStatus(''); setFilterType(''); setFilterSource(''); setFilterDate(''); setSearch(''); }}
          >
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Bookings Table */}
      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-card-header">
          <div className="admin-card-title">All Bookings</div>
          <span style={{
            fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9',
            padding: '4px 10px', borderRadius: 20, fontWeight: 600,
          }}>
            {filteredBookings.length} records
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient</th>
                <th>Test / Package</th>
                <th>Type</th>
                <th>Source</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="admin-empty">
                      <Calendar size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} />
                      <div className="admin-empty-title">No bookings found</div>
                      <div className="admin-empty-desc">
                        {search || filterStatus ? 'Try adjusting your filters' : 'Create your first booking'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.map((b) => (
                <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedBooking(b)}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#0D9488', fontWeight: 600 }}>
                    {b.bookingId || b.id.slice(0, 10)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{b.patientName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{b.patientPhone}</div>
                  </td>
                  <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.items?.map(i => i.testName).join(', ') || '—'}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${b.collectionType}`}>
                      {b.collectionType === 'lab_visit' ? 'Lab Visit' : 'Home Collection'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${b.source}`}>
                      {b.source === 'walk_in' ? 'Walk-in' : b.source === 'staff_created' ? 'Staff' : b.source?.charAt(0).toUpperCase() + b.source?.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>{b.date}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{b.timeSlot}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>
                    ₹{b.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${b.paymentStatus}`}>
                      {b.paymentStatus?.charAt(0).toUpperCase() + b.paymentStatus?.slice(1)}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      value={b.status}
                      onChange={e => handleStatusChange(b.bookingId, b.id, e.target.value as BookingStatus)}
                      className={`admin-badge admin-badge-${b.status}`}
                      style={{
                        cursor: 'pointer', border: 'none', outline: 'none',
                        padding: '4px 8px', fontSize: '0.72rem',
                      }}
                    >
                      {BOOKING_STATUSES.map(s => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="admin-btn admin-btn-ghost" style={{ padding: 6 }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="admin-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header" style={{ background: '#0F172A', color: 'white' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Booking Details</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace', marginTop: 2 }}>
                  {selectedBooking.bookingId || selectedBooking.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                  border: 'none', color: 'white', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoCard icon={<FlaskConical size={13} />} label="Patient" value={selectedBooking.patientName} />
                <InfoCard icon={<Phone size={13} />} label="Phone" value={selectedBooking.patientPhone} />
                <InfoCard icon={<MapPin size={13} />} label="City" value={selectedBooking.city || '—'} />
                <InfoCard icon={<IndianRupee size={13} />} label="Amount" value={`₹${selectedBooking.totalAmount}`} valueColor="#059669" />
                <InfoCard icon={<Calendar size={13} />} label="Date" value={selectedBooking.date} />
                <InfoCard icon={<Clock size={13} />} label="Time Slot" value={selectedBooking.timeSlot} />
              </div>

              {selectedBooking.address && (
                <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 14, marginTop: 12 }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> Address
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#0F172A' }}>{selectedBooking.address}</div>
                </div>
              )}

              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 14, marginTop: 12 }}>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginBottom: 8 }}>Tests Booked</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedBooking.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>{item.testName}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <div style={{ flex: 1, background: '#F8FAFC', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Source</div>
                  <span className={`admin-badge admin-badge-${selectedBooking.source}`}>
                    {selectedBooking.source === 'walk_in' ? 'Walk-in' : selectedBooking.source}
                  </span>
                </div>
                <div style={{ flex: 1, background: '#F8FAFC', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Type</div>
                  <span className={`admin-badge admin-badge-${selectedBooking.collectionType}`}>
                    {selectedBooking.collectionType === 'lab_visit' ? 'Lab Visit' : 'Home Collection'}
                  </span>
                </div>
                <div style={{ flex: 1, background: '#F8FAFC', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>Payment</div>
                  <span className={`admin-badge admin-badge-${selectedBooking.paymentStatus}`}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button onClick={() => setSelectedBooking(null)} className="admin-btn admin-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value, valueColor }: {
  icon: React.ReactNode; label: string; value: string; valueColor?: string;
}) {
  return (
    <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 700, color: valueColor || '#0F172A', fontSize: valueColor ? '1.1rem' : '0.875rem' }}>
        {value}
      </div>
    </div>
  );
}
