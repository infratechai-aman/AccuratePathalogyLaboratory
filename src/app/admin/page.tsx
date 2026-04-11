'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Calendar, IndianRupee, Users, FlaskConical,
  ArrowUpRight, ArrowDownRight, Package, Clock, CheckCircle,
  AlertCircle, Activity, ChevronRight
} from 'lucide-react';
import { getBookings, getTests, getUsers } from '@/lib/services/db';
import { Booking, Test, User } from '@/lib/types';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [b, t, u] = await Promise.all([getBookings(), getTests(), getUsers()]);
        setBookings(b);
        setTests(t);
        setUsers(u);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length.toString(),
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-l-blue-500',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-l-emerald-500',
    },
    {
      label: 'Registered Users',
      value: users.length.toString(),
      change: '+25%',
      trend: 'up',
      icon: Users,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-l-purple-500',
    },
    {
      label: 'Completed Tests',
      value: completedBookings.toString(),
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-l-rose-500',
    },
  ];

  // Revenue bar chart data (mock monthly)
  const chartBars = [40, 65, 45, 78, 52, 90, 68, 82, 55, 95, 70, 88];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const topTests = tests
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 5);

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending:    { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Pending' },
    processing: { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Processing' },
    completed:  { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed' },
    cancelled:  { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Cancelled' },
  };

  return (
    <div className="space-y-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-4 ${stat.borderColor}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-black text-[#0A2540] mb-0.5">{stat.value}</p>
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Status quick-filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending',    count: pendingBookings,                                   color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: Clock },
          { label: 'Processing', count: bookings.filter(b=>b.status==='processing').length, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: Activity },
          { label: 'Completed',  count: completedBookings,                                  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
          { label: 'Cancelled',  count: bookings.filter(b=>b.status==='cancelled').length,  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: AlertCircle },
        ].map(s => (
          <Link
            key={s.label}
            href="/admin/bookings"
            className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow`}
          >
            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-xs font-semibold text-gray-500">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#0A2540] font-bold text-base">Revenue Trends</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 12 months overview</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+8% this month</span>
          </div>
          <div className="h-44 flex items-end justify-between gap-1.5">
            {chartBars.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#0A2540] to-[#1a5276] opacity-70 group-hover:opacity-100 transition-all"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[9px] text-gray-400 font-medium">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[#0A2540] font-bold text-base">Top Tests</h3>
              <p className="text-xs text-gray-400 mt-0.5">By discount & popularity</p>
            </div>
            <Link href="/admin/tests" className="text-xs font-bold text-[#0A2540] hover:text-[#E53E3E] flex items-center gap-1 transition-colors">
              View All <ChevronRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {topTests.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <FlaskConical size={32} className="mx-auto mb-2 text-gray-200" />
                No tests seeded yet. Go to <Link href="/admin/seed" className="text-[#0A2540] underline">Seed Data</Link>.
              </div>
            ) : topTests.map((test, i) => (
              <div key={test.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0A2540] flex items-center justify-center text-white text-xs font-black">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A2540] truncate">{test.name}</p>
                  <p className="text-xs text-gray-400">{test.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#0A2540]">₹{test.price}</p>
                  <p className="text-xs text-emerald-600 font-semibold">{test.discount}% off</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-[#0A2540] font-bold text-base">Recent Bookings</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest patient bookings</p>
          </div>
          <Link href="/admin/bookings" className="text-xs font-bold text-[#0A2540] hover:text-[#E53E3E] flex items-center gap-1 transition-colors">
            View All <ChevronRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-wider">
                <th className="text-left py-3 px-5">ID</th>
                <th className="text-left py-3 px-5">Patient</th>
                <th className="text-left py-3 px-5">Test</th>
                <th className="text-left py-3 px-5">Amount</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                    <Calendar size={36} className="mx-auto mb-3 text-gray-200" />
                    No bookings yet.
                  </td>
                </tr>
              ) : bookings.slice(0, 6).map((booking) => {
                const sc = statusConfig[booking.status] || statusConfig['pending'];
                return (
                  <tr key={booking.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs text-gray-400">{booking.id.slice(0, 8)}...</td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#0A2540]">{booking.patientName}</p>
                      <p className="text-xs text-gray-400">{booking.phone}</p>
                    </td>
                    <td className="py-4 px-5 text-gray-500 max-w-[180px] truncate">{booking.items[0]?.testName}</td>
                    <td className="py-4 px-5 font-bold text-emerald-600">₹{booking.totalAmount}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-xs">{booking.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Manage Tests',    href: '/admin/tests',    icon: FlaskConical, color: 'bg-blue-600' },
          { label: 'View Bookings',   href: '/admin/bookings', icon: Calendar,     color: 'bg-emerald-600' },
          { label: 'Seed Sample Data',href: '/admin/seed',     icon: Package,      color: 'bg-amber-500' },
          { label: 'Manage Users',    href: '/admin/users',    icon: Users,        color: 'bg-purple-600' },
        ].map(action => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col gap-3"
          >
            <div className={`w-11 h-11 ${action.color} rounded-xl flex items-center justify-center`}>
              <action.icon size={20} className="text-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#0A2540]">{action.label}</span>
              <ChevronRight size={15} className="text-gray-300 group-hover:text-[#0A2540] transition-colors" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
