'use client';

import React, { useState } from 'react';
import { sampleUsers, sampleBookings } from '@/lib/sample-data';
import { User } from '@/lib/types';
import { Search, Shield, ShieldOff, Calendar, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState(sampleUsers);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof sampleUsers[0] | null>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const toggleRole = (uid: string) => {
    setUsers(users.map(u =>
      u.uid === uid ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } as typeof u : u
    ));
  };

  const getUserBookings = (uid: string) => sampleBookings.filter(b => b.userId === uid);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center bg-[#1a2332] rounded-xl border border-white/10 px-4">
        <Search size={16} className="text-white/30" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name, email, or phone..."
          className="w-full px-3 py-3 bg-transparent outline-none text-sm text-white placeholder:text-white/30" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a2332] rounded-xl border border-white/5 p-4">
          <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'user').length}</p>
          <p className="text-xs text-white/40">Total Users</p>
        </div>
        <div className="bg-[#1a2332] rounded-xl border border-white/5 p-4">
          <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
          <p className="text-xs text-white/40">Admins</p>
        </div>
        <div className="bg-[#1a2332] rounded-xl border border-white/5 p-4">
          <p className="text-2xl font-bold text-white">{users.reduce((sum, u) => sum + u.familyMembers.length, 0)}</p>
          <p className="text-xs text-white/40">Family Members</p>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">City</th>
                <th className="text-left py-3 px-4">Bookings</th>
                <th className="text-left py-3 px-4">Family</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                        {user.name[0]}
                      </div>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-white/60 text-xs">{user.email}</p>
                    <p className="text-white/40 text-xs">{user.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-white/60">{user.city}</td>
                  <td className="py-3 px-4 text-white/60">{getUserBookings(user.uid).length}</td>
                  <td className="py-3 px-4 text-white/60">{user.familyMembers.length}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-amber-400/10 text-amber-400' : 'bg-blue-400/10 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/40 text-xs">{user.createdAt.toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleRole(user.uid)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-accent"
                      title={user.role === 'admin' ? 'Revoke admin' : 'Make admin'}>
                      {user.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-[#1a2332] rounded-2xl w-full max-w-lg border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedUser.role === 'admin' ? 'bg-amber-400/10 text-amber-400' : 'bg-blue-400/10 text-blue-400'
                  }`}>{selectedUser.role}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1"><Mail size={10} /> Email</div>
                  <p className="text-white text-sm">{selectedUser.email}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1"><Phone size={10} /> Phone</div>
                  <p className="text-white text-sm">{selectedUser.phone}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1"><MapPin size={10} /> City</div>
                  <p className="text-white text-sm">{selectedUser.city}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1"><Calendar size={10} /> Joined</div>
                  <p className="text-white text-sm">{selectedUser.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Bookings */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Booking History ({getUserBookings(selectedUser.uid).length})</h3>
                {getUserBookings(selectedUser.uid).map(b => (
                  <div key={b.id} className="p-3 bg-white/5 rounded-xl mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{b.items[0]?.testName}</p>
                      <p className="text-xs text-white/40">{b.date} • {b.status}</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">₹{b.totalAmount}</p>
                  </div>
                ))}
                {getUserBookings(selectedUser.uid).length === 0 && (
                  <p className="text-xs text-white/30">No bookings</p>
                )}
              </div>

              {/* Family */}
              {selectedUser.familyMembers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Family Members</h3>
                  {selectedUser.familyMembers.map(m => (
                    <div key={m.id} className="p-2 bg-white/5 rounded-lg mb-1 text-sm text-white/60">
                      {m.name} — {m.relation} — {m.age} yrs
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5">
              <button onClick={() => setSelectedUser(null)} className="w-full py-2.5 bg-white/5 text-white/60 rounded-xl text-sm hover:bg-white/10">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
