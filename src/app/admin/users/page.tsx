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
      <div className="flex items-center bg-white rounded-xl border border-gray-200 px-4 shadow-sm">
        <Search size={16} className="text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name, email, or phone..."
          className="w-full px-3 py-3 bg-transparent outline-none text-sm text-[#0A2540] placeholder:text-gray-400" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#0A2540]">{users.filter(u => u.role === 'user').length}</p>
          <p className="text-xs text-gray-500 font-medium">Total Users</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#0A2540]">{users.filter(u => u.role === 'admin').length}</p>
          <p className="text-xs text-gray-500 font-medium">Admins</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#0A2540]">{users.reduce((sum, u) => sum + u.familyMembers.length, 0)}</p>
          <p className="text-xs text-gray-500 font-medium">Family Members</p>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <th className="text-left py-3 px-5">User</th>
                <th className="text-left py-3 px-5">Contact</th>
                <th className="text-left py-3 px-5">City</th>
                <th className="text-left py-3 px-5">Bookings</th>
                <th className="text-left py-3 px-5">Family</th>
                <th className="text-left py-3 px-5">Role</th>
                <th className="text-left py-3 px-5">Joined</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shadow-sm">
                        {user.name[0]}
                      </div>
                      <p className="text-[#0A2540] font-bold">{user.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-gray-600 text-xs font-medium">{user.email}</p>
                    <p className="text-gray-400 text-xs">{user.phone}</p>
                  </td>
                  <td className="py-4 px-5 text-gray-600">{user.city}</td>
                  <td className="py-4 px-5 text-gray-600 font-semibold">{getUserBookings(user.uid).length}</td>
                  <td className="py-4 px-5 text-gray-600">{user.familyMembers.length}</td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-500 text-xs">{user.createdAt.toLocaleDateString()}</td>
                  <td className="py-4 px-5 text-right" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleRole(user.uid)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#0A2540]"
                      title={user.role === 'admin' ? 'Revoke admin' : 'Make admin'}>
                      {user.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg border border-gray-100 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#0A2540] p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white text-2xl font-black shadow-inner">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedUser.role === 'admin' ? 'bg-amber-400/20 text-amber-300' : 'bg-blue-400/20 text-blue-300'
                  }`}>{selectedUser.role}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs mb-1"><Mail size={12} /> Email</div>
                  <p className="text-[#0A2540] text-sm font-semibold truncate">{selectedUser.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs mb-1"><Phone size={12} /> Phone</div>
                  <p className="text-[#0A2540] text-sm font-semibold">{selectedUser.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs mb-1"><MapPin size={12} /> City</div>
                  <p className="text-[#0A2540] text-sm font-semibold">{selectedUser.city}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs mb-1"><Calendar size={12} /> Joined</div>
                  <p className="text-[#0A2540] text-sm font-semibold">{selectedUser.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Bookings */}
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] mb-2">Booking History ({getUserBookings(selectedUser.uid).length})</h3>
                {getUserBookings(selectedUser.uid).map(b => (
                  <div key={b.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#0A2540] font-semibold">{b.items[0]?.testName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{b.date} • <span className="uppercase text-[10px] font-bold text-gray-400">{b.status}</span></p>
                    </div>
                    <p className="text-sm font-black text-emerald-600">₹{b.totalAmount}</p>
                  </div>
                ))}
                {getUserBookings(selectedUser.uid).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No bookings found for this user.</p>
                )}
              </div>

              {/* Family */}
              {selectedUser.familyMembers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#0A2540] mb-2">Family Members ({selectedUser.familyMembers.length})</h3>
                  {selectedUser.familyMembers.map(m => (
                    <div key={m.id} className="p-2 border border-blue-50 bg-blue-50/50 rounded-lg mb-1 text-sm text-[#0A2540] flex justify-between">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-gray-500 text-xs">{m.relation} • {m.age} yrs</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <button 
                onClick={() => setSelectedUser(null)} 
                className="w-full py-3 font-bold bg-[#0A2540] text-white hover:bg-[#0e3460] rounded-xl text-sm transition-colors shadow-sm"
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
