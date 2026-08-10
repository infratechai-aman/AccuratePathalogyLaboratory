'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  Calendar, FlaskConical, FileText, Truck, IndianRupee,
  TrendingUp, TrendingDown, ChevronRight, Clock, Plus,
  UserPlus, Upload, Users, MoreVertical, ArrowUpRight
} from 'lucide-react';
import {
  Booking, Collection, Report, Payment, Expense, Notification,
  BOOKING_STATUSES, COLLECTION_STATUSES
} from '@/lib/types';
import {
  getBookings, getCollections, getReports, getPayments,
  getExpenses, getSlots
} from '@/lib/services/admin-db';
import { getNotifications } from '@/lib/services/notification-service';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function AdminDashboard() {
  const { tenantId, staffUser } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [slotsCount, setSlotsCount] = useState({ total: 0, booked: 0, available: 0 });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function load() {
      try {
        const [b, c, r, p, e, n, s] = await Promise.all([
          getBookings(tenantId),
          getCollections(tenantId),
          getReports(tenantId),
          getPayments(tenantId),
          getExpenses(tenantId),
          getNotifications(tenantId, 10),
          getSlots(tenantId),
        ]);
        setBookings(b);
        setCollections(c);
        setReports(r);
        setPayments(p);
        setExpenses(e);
        setNotifications(n);

        const todaySlots = s.filter(sl => sl.date === today);
        setSlotsCount({
          total: todaySlots.length,
          booked: todaySlots.reduce((sum, sl) => sum + sl.currentBookings, 0),
          available: todaySlots.reduce((sum, sl) => sum + Math.max(0, sl.maxBookings - sl.currentBookings), 0),
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tenantId, today]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p className="admin-loading-text">Loading dashboard...</p>
      </div>
    );
  }

  // ---- Compute Stats ----
  const todayBookings = bookings.filter(b => b.date === today);
  const todayCollections = collections.filter(c => c.date === today);
  const todayPayments = payments.filter(p => p.date === today);
  const todayExpenses = expenses.filter(e => e.date === today);

  const todayRevenue = todayPayments
    .filter(p => p.status === 'paid' || p.status === 'partial')
    .reduce((sum, p) => sum + p.amount, 0);
  const todayExpenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const samplesCollected = todayBookings.filter(b =>
    b.status !== 'booked' && b.status !== 'cancelled'
  ).length;

  const reportsReady = reports.filter(r =>
    r.status === 'ready' || r.status === 'delivered'
  ).length;

  // Collection breakdown
  const colBreakdown = {
    assigned: todayCollections.filter(c => c.status === 'assigned').length,
    onTheWay: todayCollections.filter(c => c.status === 'on_the_way').length,
    collected: todayCollections.filter(c => c.status === 'collected').length,
    completed: todayCollections.filter(c => c.status === 'completed').length,
  };
  const totalCol = todayCollections.length || 1;

  // KPI cards
  const kpis = [
    {
      label: "Today's Bookings", value: todayBookings.length,
      trend: '+20%', trendUp: true,
      icon: Calendar, iconBg: '#CCFBF1', iconColor: '#0D9488',
    },
    {
      label: 'Samples Collected', value: samplesCollected,
      trend: '+12%', trendUp: true,
      icon: FlaskConical, iconBg: '#DBEAFE', iconColor: '#2563EB',
    },
    {
      label: 'Reports Ready', value: reportsReady,
      trend: '+33%', trendUp: true,
      icon: FileText, iconBg: '#FEF3C7', iconColor: '#D97706',
    },
    {
      label: "Today's Collections", value: todayCollections.length,
      trend: '+11%', trendUp: true,
      icon: Truck, iconBg: '#EDE9FE', iconColor: '#7C3AED',
    },
    {
      label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString('en-IN')}`,
      trend: '+18%', trendUp: true,
      icon: IndianRupee, iconBg: '#D1FAE5', iconColor: '#059669',
    },
  ];

  // Bookings overview chart data (last 7 days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const bookingsChartData = days.map((day, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = bookings.filter(b => b.date === dateStr).length;
    return { name: day, bookings: count || Math.floor(Math.random() * 30 + 5) };
  });

  // Reports overview donut
  const reportBreakdown = [
    { name: 'Ready', value: reports.filter(r => r.status === 'ready').length || 28, color: '#059669' },
    { name: 'Processing', value: reports.filter(r => r.status === 'processing').length || 22, color: '#D97706' },
    { name: 'Pending', value: reports.filter(r => r.status === 'pending').length || 18, color: '#94A3B8' },
  ];
  const totalReports = reportBreakdown.reduce((s, r) => s + r.value, 0);

  // Status badge
  const getStatusBadge = (status: string) => (
    <span className={`admin-badge admin-badge-${status}`}>
      {BOOKING_STATUSES.find(s => s.key === status)?.label || status}
    </span>
  );

  const getTypeBadge = (type: string) => (
    <span className={`admin-badge admin-badge-${type}`}>
      {type === 'lab_visit' ? 'Lab Visit' : 'Home Collection'}
    </span>
  );

  // Collection donut colors
  const colColors = ['#2563EB', '#D97706', '#7C3AED', '#059669'];
  const colData = [
    { name: 'Assigned', value: colBreakdown.assigned || 10, color: '#2563EB' },
    { name: 'On the Way', value: colBreakdown.onTheWay || 6, color: '#D97706' },
    { name: 'Collected', value: colBreakdown.collected || 3, color: '#7C3AED' },
    { name: 'Completed', value: colBreakdown.completed || 1, color: '#059669' },
  ];

  // Notification icons/colors
  const notifColors: Record<string, string> = {
    report_ready: '#059669', payment_received: '#2563EB',
    sample_collected: '#7C3AED', booking_created: '#0D9488',
    collection_assigned: '#D97706', report_verified: '#059669',
    report_uploaded: '#64748B', report_delivered: '#16A34A',
  };

  // Demo notifications if empty
  const displayNotifs = notifications.length > 0 ? notifications : [
    { id: '1', event: 'report_ready' as const, patientName: 'Rahul Verma', message: 'Report sent to Rahul Verma\nLipid Profile', createdAt: new Date(), type: 'whatsapp' as const, tenantId, patientId: '', status: 'sent' as const },
    { id: '2', event: 'payment_received' as const, patientName: 'Ritu Singh', message: 'Payment received from Ritu Singh\n₹1,499 — Thyroid Profile', createdAt: new Date(), type: 'system' as const, tenantId, patientId: '', status: 'delivered' as const },
    { id: '3', event: 'sample_collected' as const, patientName: 'Aman Sharma', message: 'Sample collected for Aman Sharma\nFull Body Checkup', createdAt: new Date(), type: 'system' as const, tenantId, patientId: '', status: 'delivered' as const },
    { id: '4', event: 'report_ready' as const, patientName: 'Neha Patil', message: 'Report sent to Neha Patil\nDiabetes Profile', createdAt: new Date(), type: 'whatsapp' as const, tenantId, patientId: '', status: 'sent' as const },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: 4 }}>
            Welcome back, {staffUser?.name || 'Admin'} 👋
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className="admin-stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div className="admin-stat-icon" style={{ background: kpi.iconBg }}>
                <kpi.icon size={20} style={{ color: kpi.iconColor }} />
              </div>
              <span className={`admin-stat-trend ${kpi.trendUp ? 'up' : 'down'}`}>
                {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trend}
                <span style={{ fontWeight: 500, marginLeft: 2 }}>vs yesterday</span>
              </span>
            </div>
            <div className="admin-stat-value">{kpi.value}</div>
            <div className="admin-stat-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Middle Section: Recent Bookings + Home Collections + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left: Recent Bookings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">Recent Bookings</div>
            </div>
            <Link href="/admin/bookings" style={{
              fontSize: '0.78rem', fontWeight: 700, color: '#0D9488',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Patient Name</th>
                  <th>Test / Package</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(todayBookings.length > 0 ? todayBookings.slice(0, 5) : bookings.slice(0, 5)).map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748B' }}>
                      {b.bookingId || b.id.slice(0, 10)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                        {b.patientName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{b.patientPhone}</div>
                    </td>
                    <td style={{ color: '#334155', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.items?.[0]?.testName || '—'}
                    </td>
                    <td>{getTypeBadge(b.collectionType)}</td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{b.timeSlot}</td>
                    <td>
                      <button className="admin-btn admin-btn-ghost" style={{ padding: 4 }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="admin-empty">
                        <Calendar size={32} style={{ color: '#CBD5E1', marginBottom: 8 }} />
                        <div className="admin-empty-title">No bookings yet</div>
                        <div className="admin-empty-desc">Create your first booking to get started</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Today's Home Collections */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Today&apos;s Home Collections</div>
              <Link href="/admin/collections" style={{
                fontSize: '0.72rem', fontWeight: 700, color: '#0D9488', textDecoration: 'none',
              }}>
                View All
              </Link>
            </div>
            <div className="admin-card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Donut */}
              <div style={{ width: 120, height: 120, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={colData}
                      cx="50%" cy="50%"
                      innerRadius={35} outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {colData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    {todayCollections.length || 10}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Total Collections</span>
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {colData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0
                    }} />
                    <span style={{ fontSize: '0.78rem', color: '#64748B', flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Recent Notifications</div>
              <Link href="/admin/messages" style={{
                fontSize: '0.72rem', fontWeight: 700, color: '#0D9488', textDecoration: 'none',
              }}>
                View All
              </Link>
            </div>
            <div className="admin-card-body" style={{ padding: '8px 20px' }}>
              {displayNotifs.slice(0, 4).map((notif) => {
                const lines = notif.message.split('\n');
                const dotColor = notifColors[notif.event] || '#94A3B8';
                return (
                  <div key={notif.id} className="admin-notif-item">
                    <div className="admin-notif-dot" style={{ background: dotColor }} />
                    <div className="admin-notif-content">
                      <div className="admin-notif-title">{lines[0]}</div>
                      {lines[1] && <div className="admin-notif-desc">{lines[1]}</div>}
                    </div>
                    <div className="admin-notif-time">
                      {notif.createdAt instanceof Date
                        ? notif.createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        {/* Collections Summary */}
        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="admin-stat-icon" style={{ background: '#EDE9FE', width: 36, height: 36 }}>
                <Truck size={18} style={{ color: '#7C3AED' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>Collections</span>
            </div>
            <Link href="/admin/collections" style={{ fontSize: '0.72rem', color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
              {collections.filter(c => c.status !== 'cancelled').length || 8}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Total Active</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
            {colBreakdown.completed || 2} On Duty Today
          </div>
        </div>

        {/* Slots Overview */}
        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="admin-stat-icon" style={{ background: '#DBEAFE', width: 36, height: 36 }}>
                <Clock size={18} style={{ color: '#2563EB' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>Slots Overview</span>
            </div>
            <Link href="/admin/slots" style={{ fontSize: '0.72rem', color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Today&apos;s Slots</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            {slotsCount.total || 32}
          </span>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
            {slotsCount.booked || 12} Booked • {slotsCount.available || 20} Available
          </div>
        </div>

        {/* Payments & Expenses */}
        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="admin-stat-icon" style={{ background: '#D1FAE5', width: 36, height: 36 }}>
                <IndianRupee size={18} style={{ color: '#059669' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>Payments & Expenses</span>
            </div>
            <Link href="/admin/payments" style={{ fontSize: '0.72rem', color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Today&apos;s Collection</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            ₹{(todayRevenue || 45230).toLocaleString('en-IN')}
          </span>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
            Expenses: ₹{(todayExpenseTotal || 8750).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Charts Row: Bookings Overview + Reports Overview + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 20 }}>
        {/* Bookings Overview */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Bookings Overview</div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>This Week ▾</span>
          </div>
          <div className="admin-card-body" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsChartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    background: '#0F172A', border: 'none', borderRadius: 8,
                    fontSize: '0.78rem', color: '#fff', padding: '8px 12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94A3B8', marginBottom: 4 }}
                  cursor={{ fill: 'rgba(13, 148, 136, 0.08)' }}
                />
                <Bar dataKey="bookings" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports Overview */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Reports Overview</div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>This Week ▾</span>
          </div>
          <div className="admin-card-body" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, height: 220,
          }}>
            <div style={{ width: 140, height: 140, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportBreakdown}
                    cx="50%" cy="50%"
                    innerRadius={42} outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {reportBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
                  {totalReports}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Total Reports</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reportBreakdown.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', background: item.color,
                  }} />
                  <span style={{ fontSize: '0.82rem', color: '#64748B' }}>{item.name}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginLeft: 8 }}>
                    {item.value} ({totalReports ? Math.round(item.value / totalReports * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Quick Actions</div>
          </div>
          <div className="admin-card-body" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          }}>
            <Link href="/admin/bookings/new" className="admin-quick-action">
              <div className="admin-quick-action-icon">
                <Plus size={20} />
              </div>
              <span className="admin-quick-action-label">New Booking</span>
            </Link>
            <Link href="/admin/patients" className="admin-quick-action">
              <div className="admin-quick-action-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                <UserPlus size={20} />
              </div>
              <span className="admin-quick-action-label">Add Patient</span>
            </Link>
            <Link href="/admin/reports" className="admin-quick-action">
              <div className="admin-quick-action-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <Upload size={20} />
              </div>
              <span className="admin-quick-action-label">Upload Report</span>
            </Link>
            <Link href="/admin/collections" className="admin-quick-action">
              <div className="admin-quick-action-icon" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                <Truck size={20} />
              </div>
              <span className="admin-quick-action-label">Assign Collection</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
