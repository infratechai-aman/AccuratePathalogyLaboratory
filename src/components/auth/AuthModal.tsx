'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, getUserByUid } from '@/lib/services/db';
import Image from 'next/image';

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const existingUser = await getUserByUid(result.user.uid);
      if (!existingUser) {
        await createUserProfile(result.user.uid, {
          email: result.user.email || '',
          name: result.user.displayName || 'Guest User',
          phone: result.user.phoneNumber || '',
          role: 'user',
          familyMembers: [],
          city: 'Hadapsar',
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google Auth failed.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[850px] rounded-[32px] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row">
        
        {/* Left Side: Premium Branding (Hidden on very small mobile) */}
        <div className="hidden md:flex md:w-[45%] bg-[#0a2540] relative p-10 flex-col justify-between overflow-hidden">
           {/* Abstract Background Design */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
           
           <div className="relative z-10">
              <div className="mb-8 bg-white py-2 px-3 rounded-xl w-max">
                 <Image src="/images/logo.png" alt="Accurate Pathology Laboratory" width={320} height={90} className="object-contain" priority />
              </div>
              
              <h3 className="text-3xl font-black text-white leading-tight mb-4">
                 Your Health,<br/>Our <span className="text-red-500">Priority.</span>
              </h3>
              <p className="text-blue-200 text-sm font-medium leading-relaxed mb-6">
                 Join thousands of patients who trust Accurate Pathology for their diagnostic needs. Create an account to track all your health reports perfectly.
              </p>
           </div>
           
           <div className="relative z-10 space-y-4">
              {[
                { icon: ShieldCheck, text: "NABL Accredited Lab" },
                { icon: Activity, text: "Priority Sample Processing" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                      <item.icon size={14} className="text-red-400" />
                   </div>
                   <span className="text-sm font-bold text-blue-100">{item.text}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[55%] bg-white p-8 md:p-12 relative flex flex-col">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors z-20">
            <X size={20} />
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 font-medium text-[15px]">
              {isLogin ? 'Log in securely to access your health dashboard.' : 'Sign up to manage your bookings and reports.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 border border-red-100 text-sm px-4 py-3 rounded-xl font-bold flex items-center gap-2">
              <ShieldCheck size={16} />
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all mb-6 shadow-sm group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or email</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    required type="text" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Full Name"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all text-[15px] font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                  />
                </div>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    required type="tel" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Phone"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all text-[15px] font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <input
                required type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all text-[15px] font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <input
                required type="password" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all text-[15px] font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1b4372] hover:bg-[#122e50] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(27,67,114,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In to Dashboard' : 'Create Secure Account')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-auto pt-8 text-center text-[15px] font-medium text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-red-600 hover:text-red-700 hover:underline font-bold transition-colors"
            >
              {isLogin ? 'Create one now' : 'Log in instead'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
