'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Calendar, IndianRupee, Users, FlaskConical,
  ArrowUpRight, ArrowDownRight, Package
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
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-10 text-white/50 animate-pulse text-center w-full">Loading dashboard data...</div>;
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
      color: 'from-blue-500 to-blue-400',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: IndianRupee,
      color: 'from-emerald-500 to-emerald-400',
    },
    {
      label: 'Active Users',
      value: users.filter(u => u.role === 'user').length.toString(),
      change: '+25%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-purple-400',
    },
    {
      label: 'Pending Bookings',
      value: pendingBookings.toString(),
      change: '-5%',
      trend: 'down',
      icon: Package,
      color: 'from-amber-500 to-amber-400',
    },
  ];

  // Top tests by category
  const topTests = tests
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#1a2332] rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
            <p className="text-sm text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart placeholder */}
        <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
          <h3 className="text-white font-bold mb-4">Revenue Trends (Last 30 Days)</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[65, 45, 78, 52, 90, 68, 82, 55, 95, 70, 88, 60].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent/60 to-accent/20 transition-all hover:from-accent hover:to-accent/60"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[9px] text-white/30">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top booked tests */}
        <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Top Tests</h3>
            <Link href="/admin/tests" className="text-xs text-accent hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {topTests.map((test, i) => (
              <div key={test.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-brand-red/20 flex items-center justify-center text-brand-red text-xs font-bold">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{test.name}</p>
                  <p className="text-xs text-white/40">{test.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">₹{test.price}</p>
                  <p className="text-xs text-emerald-400">{test.discount}% off</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Recent Bookings</h3>
          <Link href="/admin/bookings" className="text-xs text-accent hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase">
                <th className="text-left py-3 px-2">ID</th>
                <th className="text-left py-3 px-2">Patient</th>
                <th className="text-left py-3 px-2">Test</th>
                <th className="text-left py-3 px-2">Amount</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 text-white/60 font-mono text-xs">{booking.id}</td>
                  <td className="py-3 px-2 text-white font-medium">{booking.patientName}</td>
                  <td className="py-3 px-2 text-white/60 max-w-[200px] truncate">{booking.items[0]?.testName}</td>
                  <td className="py-3 px-2 text-emerald-400 font-semibold">₹{booking.totalAmount}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'completed' ? 'bg-emerald-400/10 text-emerald-400' :
                      booking.status === 'pending' ? 'bg-amber-400/10 text-amber-400' :
                      booking.status === 'processing' ? 'bg-purple-400/10 text-purple-400' :
                      'bg-blue-400/10 text-blue-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-white/40">{booking.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
