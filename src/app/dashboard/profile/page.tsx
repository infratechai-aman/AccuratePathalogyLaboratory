'use client';

import React, { useState } from 'react';
import { sampleUsers } from '@/lib/sample-data';
import { User, Mail, Phone, MapPin, Users, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import type { FamilyMember } from '@/lib/types';

export default function ProfilePage() {
  const user = sampleUsers[0]; // Demo user
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    address: user.address || '',
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(user.familyMembers);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', age: '', gender: 'male', relation: '' });

  const handleSave = () => {
    setEditing(false);
    // In production, save to Firestore
  };

  const addFamilyMember = () => {
    if (newMember.name && newMember.age && newMember.relation) {
      setFamilyMembers([
        ...familyMembers,
        {
          id: 'fm' + Date.now(),
          name: newMember.name,
          age: Number(newMember.age),
          gender: newMember.gender as 'male' | 'female' | 'other',
          relation: newMember.relation,
        },
      ]);
      setNewMember({ name: '', age: '', gender: 'male', relation: '' });
      setShowAddFamily(false);
    }
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {profile.name[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold">{profile.name}</h1>
                <p className="text-white/70 text-sm">Member since {user.createdAt.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                editing ? 'bg-success text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: User, label: 'Full Name', key: 'name' },
              { icon: Mail, label: 'Email', key: 'email' },
              { icon: Phone, label: 'Phone', key: 'phone' },
              { icon: MapPin, label: 'City', key: 'city' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">{field.label}</label>
                {editing ? (
                  <div className="flex items-center border border-border rounded-xl focus-within:border-accent">
                    <field.icon size={14} className="ml-3 text-text-muted" />
                    <input
                      type="text"
                      value={(profile as Record<string, string>)[field.key]}
                      onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                      className="w-full px-3 py-2.5 bg-transparent outline-none text-sm"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 bg-surface/50 rounded-xl">
                    <field.icon size={14} className="text-text-muted" />
                    <span className="text-sm font-medium">{(profile as Record<string, string>)[field.key]}</span>
                  </div>
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text-muted mb-1.5">Address</label>
              {editing ? (
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-border rounded-xl outline-none text-sm focus:border-accent resize-none"
                />
              ) : (
                <div className="p-2.5 bg-surface/50 rounded-xl">
                  <span className="text-sm font-medium">{profile.address || 'Not set'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="bg-white rounded-2xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-accent" />
            <h2 className="text-lg font-bold text-primary">Family Members</h2>
          </div>
          <button
            onClick={() => setShowAddFamily(!showAddFamily)}
            className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-light transition-colors"
          >
            {showAddFamily ? <X size={14} /> : <Plus size={14} />}
            {showAddFamily ? 'Cancel' : 'Add Member'}
          </button>
        </div>

        {/* Add form */}
        {showAddFamily && (
          <div className="bg-surface/50 rounded-xl p-4 mb-4 animate-fade-in-up">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input
                type="text" placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="px-3 py-2 rounded-lg border border-border outline-none text-sm focus:border-accent"
              />
              <input
                type="number" placeholder="Age"
                value={newMember.age}
                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                className="px-3 py-2 rounded-lg border border-border outline-none text-sm focus:border-accent"
              />
              <select
                value={newMember.gender}
                onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                className="px-3 py-2 rounded-lg border border-border outline-none text-sm focus:border-accent bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text" placeholder="Relation"
                value={newMember.relation}
                onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                className="px-3 py-2 rounded-lg border border-border outline-none text-sm focus:border-accent"
              />
            </div>
            <button onClick={addFamilyMember} className="btn-primary mt-3 text-xs py-2 px-4 rounded-lg">
              <Plus size={12} /> Add
            </button>
          </div>
        )}

        {/* Family list */}
        {familyMembers.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-6">No family members added yet</p>
        ) : (
          <div className="space-y-2">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{member.name}</p>
                    <p className="text-xs text-text-muted">{member.relation} • {member.age} yrs • {member.gender}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFamilyMember(member.id)}
                  className="p-2 text-error/50 hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
