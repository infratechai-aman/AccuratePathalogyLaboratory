'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Users, Plus, Edit3, Trash2, Save, X, Loader2 } from 'lucide-react';
import type { FamilyMember } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/services/db';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, appUser, loading: authLoading, refreshAppUser } = useAuth();
  const router = useRouter();
  
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', age: '', gender: 'male', relation: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/?login=true');
    }

    if (appUser) {
      setProfile({
        name: appUser.name || '',
        email: appUser.email || '',
        phone: appUser.phone || '',
        city: appUser.city || 'Hadapsar',
        address: appUser.address || '',
      });
      setFamilyMembers(appUser.familyMembers || []);
    }
  }, [user, appUser, authLoading, router]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateUserProfile(user.uid, {
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        address: profile.address,
      });
      await refreshAppUser();
      setEditing(false);
    } catch (e) {
      console.error("Failed to update profile", e);
    }
  };

  const addFamilyMember = async () => {
    if (newMember.name && newMember.age && newMember.relation && user) {
      const newMembersList = [
        ...familyMembers,
        {
          id: 'fm' + Date.now(),
          name: newMember.name,
          age: Number(newMember.age),
          gender: newMember.gender as 'male' | 'female' | 'other',
          relation: newMember.relation,
        },
      ];
      
      try {
        await updateUserProfile(user.uid, { familyMembers: newMembersList });
        setFamilyMembers(newMembersList);
        await refreshAppUser();
        
        setNewMember({ name: '', age: '', gender: 'male', relation: '' });
        setShowAddFamily(false);
      } catch(e) {
         console.error("Failed to add", e);
      }
    }
  };

  const removeFamilyMember = async (id: string) => {
    if (!user) return;
    const newMembersList = familyMembers.filter(m => m.id !== id);
    try {
      await updateUserProfile(user.uid, { familyMembers: newMembersList });
      setFamilyMembers(newMembersList);
      await refreshAppUser();
    } catch(e) {
       console.error("Failed to remove", e);
    }
  };

  if (authLoading || !appUser) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 size={32} className="animate-spin text-red-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-[#1b4372] p-6 text-white relative">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex flex-col items-center justify-center text-3xl font-black shadow-inner">
                {profile.name[0]?.toUpperCase() || <User />}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-blue-200 text-sm">{appUser.email}</p>
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                editing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-blue-900 hover:bg-gray-100'
              }`}
            >
              {editing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            {[
              { icon: User, label: 'Full Name', key: 'name' },
              { icon: Mail, label: 'Email', key: 'email', disabled: true },
              { icon: Phone, label: 'Phone', key: 'phone' },
              { icon: MapPin, label: 'City', key: 'city' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
                {editing && !field.disabled ? (
                  <div className="flex items-center border border-gray-300 bg-white rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                    <field.icon size={16} className="ml-3 text-gray-400" />
                    <input
                      type="text"
                      value={(profile as Record<string, string>)[field.key]}
                      onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                      className="w-full px-3 py-2.5 bg-transparent outline-none text-sm font-medium text-gray-900"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <field.icon size={16} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">{(profile as Record<string, string>)[field.key] || 'Not provided'}</span>
                  </div>
                )}
              </div>
            ))}
            <div className="sm:col-span-2 mt-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detailed Address</label>
              {editing ? (
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  rows={2}
                  placeholder="Enter complete address for home collections"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-sm"
                />
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-sm font-bold text-gray-900">{profile.address || 'Address not added yet. Tap Edit Profile to add.'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users size={22} className="text-[#1b4372]" />
            <h2 className="text-lg font-black text-gray-900">Family Members</h2>
          </div>
          <button
            onClick={() => setShowAddFamily(!showAddFamily)}
            className="flex items-center gap-1.5 text-sm font-bold text-[#1b4372] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {showAddFamily ? <X size={16} /> : <Plus size={16} />}
            {showAddFamily ? 'Cancel' : 'Add Member'}
          </button>
        </div>

        {/* Add form */}
        {showAddFamily && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6 animate-fade-in-up">
            <h4 className="text-sm font-bold text-blue-900 mb-3">New Family Member Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text" placeholder="Full Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-blue-200 outline-none text-sm font-medium focus:border-blue-500"
              />
              <input
                type="number" placeholder="Age"
                value={newMember.age}
                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-blue-200 outline-none text-sm font-medium focus:border-blue-500"
              />
              <select
                value={newMember.gender}
                onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-blue-200 outline-none text-sm font-medium focus:border-blue-500 bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text" placeholder="Relation (e.g. Father)"
                value={newMember.relation}
                onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-blue-200 outline-none text-sm font-medium focus:border-blue-500"
              />
            </div>
            <button onClick={addFamilyMember} className="mt-4 bg-[#1b4372] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-[#122e50] transition-colors flex items-center gap-2">
              <Plus size={16} /> Save Member
            </button>
          </div>
        )}

        {/* Family list */}
        {familyMembers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
               <Users className="text-gray-400" size={20} />
             </div>
             <p className="text-gray-500 font-medium text-sm">No family members added yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-lg font-black text-[#1b4372]">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 mb-0.5">{member.name}</p>
                    <p className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block">{member.relation} • {member.age} yrs • {member.gender}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFamilyMember(member.id)}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
