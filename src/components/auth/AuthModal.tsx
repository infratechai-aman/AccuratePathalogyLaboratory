'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        await createUserProfile(userCredential.user.uid, {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          role: 'user',
          familyMembers: [],
          city: 'Hadapsar',
        });
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white text-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#0A2540]">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                    <UserIcon size={14} className="text-gray-400" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-sm font-medium placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" /> Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-sm font-medium placeholder:font-normal"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <Mail size={14} className="text-gray-400" /> Email Address
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-sm font-medium placeholder:font-normal"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <Lock size={14} className="text-gray-400" /> Password
              </label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-sm font-medium placeholder:font-normal"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-red-600 hover:underline font-bold"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
