'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getMessages } from '@/lib/services/admin-db';
import { Notification } from '@/lib/types';
import { Search, MessageSquare, Mail, Bell, Smartphone, Filter } from 'lucide-react';

export default function MessagesPage() {
  const { tenantId } = useAdmin();
  const [messages, setMessages] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try { const data = await getMessages(tenantId); setMessages(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const filtered = messages.filter(m => {
    const term = search.toLowerCase();
    return (!search || m.patientName?.toLowerCase().includes(term) || m.message?.toLowerCase().includes(term)) &&
      (!filterType || m.type === filterType) && (!filterStatus || m.status === filterStatus);
  });

  const typeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <Smartphone size={14} style={{ color: '#16A34A' }} />;
      case 'email': return <Mail size={14} style={{ color: '#2563EB' }} />;
      default: return <Bell size={14} style={{ color: '#64748B' }} />;
    }
  };

  const eventLabels: Record<string, string> = {
    booking_created: 'Booking Confirmed', payment_received: 'Payment Received',
    sample_collected: 'Sample Collected', collection_assigned: 'Collection Scheduled',
    report_uploaded: 'Report Uploaded', report_verified: 'Report Verified',
    report_ready: 'Report Ready', report_delivered: 'Report Delivered',
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading messages...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Messages</h1>
        <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Communication center — WhatsApp, Email & System notifications</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total', count: messages.length, color: '#0F172A' },
          { label: 'Sent', count: messages.filter(m => m.status === 'sent').length, color: '#059669' },
          { label: 'Delivered', count: messages.filter(m => m.status === 'delivered').length, color: '#2563EB' },
          { label: 'Pending', count: messages.filter(m => m.status === 'pending').length, color: '#D97706' },
          { label: 'Failed', count: messages.filter(m => m.status === 'failed').length, color: '#DC2626' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ padding: 14 }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div className="admin-header-search" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: '#94A3B8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." />
        </div>
        <select className="admin-select" style={{ width: 'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="system">System</option>
        </select>
        <select className="admin-select" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="sent">Sent</option><option value="delivered">Delivered</option><option value="pending">Pending</option><option value="failed">Failed</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Type</th><th>Event</th><th>Patient</th><th>Message</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td>{typeIcon(m.type)} <span className={`admin-badge admin-badge-${m.type}`} style={{ marginLeft: 4 }}>{m.type}</span></td>
                <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{eventLabels[m.event] || m.event}</td>
                <td style={{ fontWeight: 600, color: '#0F172A' }}>{m.patientName}</td>
                <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748B' }}>
                  {m.message}
                </td>
                <td><span className={`admin-badge admin-badge-${m.status}`}>{m.status}</span></td>
                <td style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  {m.createdAt instanceof Date ? m.createdAt.toLocaleString('en-IN') : '—'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6}>
              <div className="admin-empty"><MessageSquare size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} /><div className="admin-empty-title">No messages yet</div>
                <div className="admin-empty-desc">Messages will appear here as events occur</div></div>
            </td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
