'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { sampleTests } from '@/lib/sample-data';
import {
  FileText, Phone, Upload, Home, MonitorCheck, ChevronRight, Stethoscope,
  Heart, Droplets, Thermometer, Shield, Activity, Beaker, Apple, Mic, Play,
  FileSearch, Microscope, Syringe, Star, MapPin, Search, ArrowRight,
  TrendingUp, Dna, Brain, Eye, TestTube, CheckCircle, User
} from 'lucide-react';

const conditionTiles = [
  { label: 'Liver', icon: Activity, bg: 'bg-[#e9f7f2]', text: 'text-[#0b9a8a]' },
  { label: 'Heart', icon: Heart, bg: 'bg-[#fde7ee]', text: 'text-[#e31b54]' },
  { label: 'Kidney', icon: Droplets, bg: 'bg-[#eaf1ff]', text: 'text-[#2463eb]' },
  { label: 'Diabetes', icon: Activity, bg: 'bg-[#f5edff]', text: 'text-[#7c3aed]' },
  { label: 'Fever', icon: Thermometer, bg: 'bg-[#fff3df]', text: 'text-[#f97316]' },
  { label: 'Thyroid', icon: Shield, bg: 'bg-[#fff1f6]', text: 'text-[#d94672]' },
  { label: 'Cancer', icon: Dna, bg: 'bg-[#ffe9dc]', text: 'text-[#eb5e28]' },
  { label: 'Bones', icon: Activity, bg: 'bg-[#e0f8ff]', text: 'text-[#00b4d8]' },
];

const categoryPills = [
  { label: 'Full Body', icon: Activity, tag: 'Most Booked' },
  { label: 'Heart', icon: Heart },
  { label: 'Vitamin', icon: Dna },
  { label: 'Fever', icon: Thermometer },
  { label: 'Diabetes', icon: Activity },
  { label: 'Thyroid', icon: Shield },
];

export default function PremiumLandingPage() {
  const router = useRouter();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [activeTrendingTab, setActiveTrendingTab] = useState('All');

  // Specific data slices
  const topPackages = sampleTests.filter(t => t.isPackage).slice(0, 3);
  const trendingPackages = sampleTests.filter(t => t.active && t.price > 500).sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <div className="pb-16 bg-[#ffffff] overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-[#d6eaff] overflow-hidden lg:h-[320px]">
        <div className="max-w-[1280px] h-full mx-auto px-6 relative flex flex-col lg:flex-row justify-between pt-6 lg:pt-0 pb-10 lg:pb-0 lg:items-center">
           
           {/* Left Content */}
           <div className="w-full lg:w-[38%] space-y-5 z-20">
              <h1 className="text-[30px] font-bold text-white mb-2 leading-tight drop-shadow-md">
                 Looking for a test ?
              </h1>
              
              {/* Search Bar matching reference */}
              <div className="relative bg-white rounded-full flex items-center p-1.5 pr-3 sm:pr-4 shadow-sm w-full max-w-xl">
                 <div className="pl-3 sm:pl-4 pr-2 sm:pr-3 flex-shrink-0"><Search size={18} className="text-gray-400" /></div>
                 <input 
                    type="text" 
                    placeholder="Search Tests" 
                    className="flex-1 min-w-0 py-2.5 text-[14px] sm:text-[15px] outline-none text-gray-700 bg-transparent font-medium truncate"
                 />
                 <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-200 pl-2 sm:pl-4 ml-1 sm:ml-2 flex-shrink-0">
                    <Mic size={18} className="text-red-500 cursor-pointer hover:text-red-600" />
                    <Upload size={18} className="text-blue-900 cursor-pointer hover:text-blue-700" />
                 </div>
              </div>

              {/* Quick Action Pills */}
              <div className="flex gap-4 pt-2">
                 <button className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-[0_4px_10px_rgb(0,0,0,0.03)] border border-white hover:border-blue-200 transition-colors w-44 relative group">
                    <div className="bg-blue-50 p-1.5 rounded-lg text-blue-900 group-hover:bg-blue-100 transition-colors">
                       <ScanFaceIcon />
                    </div>
                    <span className="font-bold text-[14px] text-gray-800">Face Scan</span>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">New</span>
                 </button>
                 <button className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-[0_4px_10px_rgb(0,0,0,0.03)] border border-white hover:border-blue-200 transition-colors group">
                    <div className="bg-blue-50 p-1.5 rounded-lg text-blue-900 group-hover:bg-blue-100 transition-colors">
                       <TestTube size={18} />
                    </div>
                    <span className="font-bold text-[14px] text-gray-800">Create Your Own Package</span>
                 </button>
              </div>
           </div>

           {/* Center Doctor Image (Floating & Vertically Centered) */}
           <div className="hidden lg:block absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[280px] z-10 rounded-[30px] shadow-[0_12px_30px_rgb(0,0,0,0.15)]">
              <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop" alt="Doctor" fill className="object-cover object-[center_top] rounded-[30px]" />
              
              {/* Shield overlay - Floating on left */}
              <div className="absolute -left-12 top-[60%] -translate-y-1/2 z-30 transform scale-[1.05]">
                 <div className="w-[110px] h-28 rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.25)] border-[2.5px] border-white flex flex-col items-center justify-center p-2 relative overflow-hidden bg-[#1a365d]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] to-[#0f213e]" />
                    <h2 className="relative z-10 text-white text-[32px] font-black italic drop-shadow-md leading-none mb-1">4x</h2>
                    <p className="relative z-10 text-white font-bold text-center leading-[1.1] tracking-wider text-[10px]">VALUE</p>
                    <p className="relative z-10 text-white/70 text-[5px] uppercase tracking-widest mt-1 text-center font-bold">WITH EVERY TEST</p>
                 </div>
              </div>
           </div>

           {/* Right Benefits List */}
           <div className="hidden lg:flex w-[35%] lg:w-[32%] justify-end items-center z-20">
              <div className="flex flex-col space-y-2.5 z-10 text-blue-950 font-bold w-[220px] flex-shrink-0">
                 <div className="text-[17px] leading-[1.2] mb-1 font-extrabold text-[#1a365d]">
                    Delivering <span className="text-[#3b82f6] italic font-black">Complete Care</span> <br/>for Better Health
                 </div>
                 {[
                   { icon: FileText, text: 'SMART REPORTS' },
                   { icon: Brain, text: 'AI ASSISTANCE' },
                   { icon: Stethoscope, text: 'REPORT CONSULTATION' },
                   { icon: Apple, text: 'DIET PLAN' }
                 ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[10px] uppercase tracking-wider bg-[#ffffff] px-3 py-2 rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.04)] text-[#1a365d] border border-blue-50 hover:bg-blue-50 transition-colors cursor-default">
                       <b.icon size={14} className="text-[#3b82f6]" />
                       {b.text}
                    </div>
                 ))}
                 <button className="bg-[#e60000] shadow-[0_4px_14px_0_rgb(230,0,0,0.39)] text-white px-6 py-2.5 rounded-full uppercase font-black text-[13px] self-start mt-3 hover:bg-red-700 hover:shadow-[0_6px_20px_0_rgb(230,0,0,0.45)] transition-all transform hover:-translate-y-0.5">
                    BOOK NOW
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* 2. DOCTORS CURATED HEALTH CHECKUP PACKAGES */}
      <section className="max-w-[1280px] mx-auto px-6 pt-16 relative">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-[22px] md:text-[24px] font-bold text-[#0b3c66] tracking-tight">
               Doctors Curated Health Checkup Packages
            </h2>
            <Link href="/search" className="text-[#0b3c66] text-[15px] font-bold hover:underline hidden md:block">See All</Link>
         </div>

         <div className="relative group">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
               {[
                  { label: 'Full Body', icon: User },
                  { label: 'Heart', icon: Heart, tag: 'Most Booked' },
                  { label: 'Vitamin', icon: Dna },
                  { label: 'Fever', icon: Thermometer },
                  { label: 'Diabetes', icon: Droplets },
                  { label: 'Thyroid', icon: Shield },
               ].map((pill, idx) => (
                  <div key={idx} className="flex-shrink-0 relative flex items-center gap-4 bg-white border border-gray-100/80 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[200px]">
                     {pill.tag && (
                        <div className="absolute -top-2 right-4 bg-pink-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-20 shadow-sm border border-pink-100">
                           <TrendingUp size={12} strokeWidth={3} className="text-red-500" /> {pill.tag}
                        </div>
                     )}
                     <div className="relative w-12 h-12 flex items-center justify-center">
                        {/* Abstract blobs matching reference */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                           <div className="absolute w-7 h-7 bg-[#cbf3f0] rounded-full top-0 left-0"></div>
                           <div className="absolute w-5 h-5 bg-[#ffcad4] transform rotate-12 bottom-0 right-0"></div>
                           <div className="absolute w-2.5 h-2.5 bg-[#fefae0] top-1 right-2"></div>
                        </div>
                        <pill.icon size={26} strokeWidth={1.5} className="relative z-10 text-gray-800" />
                     </div>
                     <span className="font-bold text-[15px] text-gray-800">{pill.label}</span>
                  </div>
               ))}
               
               {/* Spacer for right arrow */}
               <div className="min-w-[40px] md:hidden"></div>
            </div>

            {/* Right Scroll Indicator */}
            <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none items-center justify-end z-10 pr-2">
               <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md cursor-pointer pointer-events-auto hover:bg-gray-50 text-blue-900 transition-transform hover:scale-105">
                  <ChevronRight size={20} />
               </div>
            </div>
         </div>
      </section>

      {/* 3. HEALTH CHECKUPS BY AGE & GENDER */}
      <section className="max-w-[1280px] mx-auto px-6 pt-16">
         <div className="grid md:grid-cols-2 gap-8">
            {/* Male Card Section */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[20px] font-bold text-[#0A2540] tracking-tight">Routine health checkups for <br />men</h3>
                   <span className="text-[#083b66] text-[13px] font-bold flex items-center gap-1 hover:underline underline-offset-4 cursor-pointer align-top self-start mt-2">View All</span>
                </div>
                <div className="flex gap-4">
                   <div className="flex-1 flex flex-col gap-2 cursor-pointer group">
                      <div className="w-full aspect-[4/5] bg-[#dfdff0] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                         <Image src="/images/portrait_male_under30.png" fill alt="Under 30 yrs Male" className="object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800 text-center tracking-tight group-hover:text-red-500 transition-colors">Under 30 yrs</span>
                   </div>
                   <div className="flex-1 flex flex-col gap-2 cursor-pointer group">
                      <div className="w-full aspect-[4/5] bg-[#dfdff0] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                         <Image src="/images/portrait_male_30to45.png" fill alt="30 - 45 yrs Male" className="object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800 text-center tracking-tight group-hover:text-red-500 transition-colors">30 - 45 yrs</span>
                   </div>
                   <div className="flex-1 flex flex-col gap-2 cursor-pointer group">
                      <div className="w-full aspect-[4/5] bg-[#dfdff0] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                         <Image src="/images/portrait_male_45to60.png" fill alt="45 - 60 yrs Male" className="object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800 text-center tracking-tight group-hover:text-red-500 transition-colors">45 - 60 yrs</span>
                   </div>
                </div>
            </div>
            
            {/* Female Card Section */}
            <div className="flex flex-col mt-6 md:mt-0">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[20px] font-bold text-[#0A2540] tracking-tight">Routine health checkups for <br />women</h3>
                   <span className="text-[#083b66] text-[13px] font-bold flex items-center gap-1 hover:underline underline-offset-4 cursor-pointer align-top self-start mt-2">View All</span>
                </div>
                <div className="flex gap-4">
                   <div className="flex-1 flex flex-col gap-2 cursor-pointer group">
                      <div className="w-full aspect-[4/5] bg-[#dfdff0] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                         <Image src="/images/portrait_female_under30.png" fill alt="Under 30 yrs Female" className="object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800 text-center tracking-tight group-hover:text-red-500 transition-colors">Under 30 yrs</span>
                   </div>
                   <div className="flex-1 flex flex-col gap-2 cursor-pointer group">
                      <div className="w-full aspect-[4/5] bg-[#dfdff0] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                         <Image src="/images/portrait_female_30to45.png" fill alt="30 - 45 yrs Female" className="object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800 text-center tracking-tight group-hover:text-red-500 transition-colors">30 - 45 yrs</span>
                   </div>
                   <div className="flex-1 flex flex-col gap-2 cursor-pointer group">
                      <div className="w-full aspect-[4/5] bg-[#dfdff0] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
                         <Image src="/images/portrait_female_45to60.png" fill alt="45 - 60 yrs Female" className="object-cover" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800 text-center tracking-tight group-hover:text-red-500 transition-colors">45 - 60 yrs</span>
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* 4. TOP BOOKED LAB TESTS & PACKAGES */}
      <section className="max-w-[1280px] mx-auto px-6 pt-20">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-[26px] font-bold text-blue-950 tracking-tight">Top Booked Lab Tests & Packages</h2>
            <Link href="/search" className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center hover:bg-blue-800"><ArrowRight size={18} /></Link>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            {topPackages.map((pkg) => (
               <PackageCard key={pkg.id} pkg={pkg} addToCart={addToCart} isInCart={isInCart} />
            ))}
         </div>
      </section>

      {/* 5. ACTIVE MILLIONS + (TRUST FEATURES) */}
      <section className="max-w-[1280px] mx-auto px-6 pt-20">
         <h2 className="text-[20px] font-bold text-blue-950 mb-6">A part of our active millions +</h2>
         <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-3xl p-6 flex flex-col justify-center h-48 relative overflow-hidden bg-white">
               <div className="bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield size={24} />
               </div>
               <h3 className="font-black text-gray-900 text-lg leading-tight">Advanced diagnostic lab setup based on latest technology.</h3>
               <span className="text-blue-500 text-xs font-bold mt-2 hover:underline cursor-pointer">Know More</span>
            </div>
            <div className="border border-gray-200 rounded-3xl p-6 flex flex-col justify-center h-48 relative overflow-hidden bg-white">
               <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MonitorCheck size={24} />
               </div>
               <h3 className="font-black text-gray-900 text-lg leading-tight">Millions Trust us! <br/>Most advanced lab testing system.</h3>
               <span className="text-blue-500 text-xs font-bold mt-2 hover:underline cursor-pointer">Know More</span>
            </div>
            <div className="border border-gray-200 rounded-3xl p-6 h-48 relative overflow-hidden bg-[#0A2540] text-white">
               <div className="flex h-full items-center">
                  <div className="w-1/2">
                     <h3 className="text-lg font-bold leading-tight">Free Home Sample Pickup!</h3>
                     <p className="text-blue-200 text-sm mt-2">Accurate & Fast</p>
                  </div>
                  <div className="w-1/2 relative h-full">
                      <Image src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&fit=crop" fill alt="Phlebotomist" className="object-cover rounded-xl" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5.5 WHY BOOK TESTS WITH US */}
      <section className="bg-gray-50/70 py-20 mt-16 border-t border-gray-100">
         <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-[26px] md:text-[30px] font-bold text-[#0A2540] mb-10 tracking-tight">Why Book Tests With Us?</h2>
            
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-stretch">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-shadow hover:shadow-md">
                     <div className="w-[42px] h-[42px] rounded-xl bg-pink-50 flex items-center justify-center mb-4 text-pink-500 shadow-sm border border-pink-100/50">
                        <Syringe size={20} strokeWidth={2.5} />
                     </div>
                     <p className="text-[#475569] font-medium text-[14px] leading-[1.6]">
                        One-prick sample collection by trained & experienced experts at home
                     </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-shadow hover:shadow-md">
                     <div className="w-[42px] h-[42px] rounded-xl bg-teal-50 flex items-center justify-center mb-4 text-teal-600 shadow-sm border border-teal-100/50">
                        <Thermometer size={20} strokeWidth={2.5} />
                     </div>
                     <p className="text-[#475569] font-medium text-[14px] leading-[1.6]">
                        Sample Transfer in Temperature-controlled Bags, Maintaining Sample Integrity
                     </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-shadow hover:shadow-md">
                     <div className="w-[42px] h-[42px] rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600 shadow-sm border border-blue-100/50">
                        <Beaker size={20} strokeWidth={2.5} />
                     </div>
                     <p className="text-[#475569] font-medium text-[14px] leading-[1.6]">
                        Sample Processing at Self-Owned Certified Laboratories under strict quality protocols
                     </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-[0_0_0_1px_rgba(20,50,150,0.05),_0_8px_24px_rgba(20,50,150,0.06)] border-blue-100 flex flex-col justify-center relative overflow-hidden transition-shadow hover:shadow-[0_0_0_1px_rgba(20,50,150,0.08),_0_12px_28px_rgba(20,50,150,0.1)]">
                     <div className="w-[42px] h-[42px] rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-orange-500 shadow-sm border border-orange-100/50">
                        <FileText size={20} strokeWidth={2.5} />
                     </div>
                     <p className="text-[#475569] font-medium text-[14px] leading-[1.6]">
                        Smart, Easy-to-understand, verified reports by MD pathologists
                     </p>
                  </div>
               </div>
               
               <div className="relative rounded-[24px] overflow-hidden shadow-sm h-[320px] lg:h-auto border border-gray-100/50 bg-white ml-0 lg:ml-6">
                  <Image src="/images/why_us_lab.png" fill alt="Lab Technician" className="object-cover" />
               </div>
            </div>
         </div>
      </section>

      {/* 6. DIFFERENT STAGES INFOGRAPHIC */}
      <section className="bg-white py-20 mt-16 pb-24 border-y border-gray-100">
         <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-[26px] md:text-[30px] font-bold text-blue-950 mb-2 leading-tight">5 Simple Steps to Manage Your Health with Accurate Pathology Laboratory</h2>
            <p className="text-gray-500 font-medium mb-10 text-[15px]">Quick, Simple & Convenient; trusted care delivered to your doorstep.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               {[
                  {
                    num: 1,
                    pillText: 'BOOK',
                    pillColors: 'bg-blue-50 text-blue-600',
                    blockColor: 'bg-[#1b3d6d]', // Dark Blue
                    img: '/images/step_1.png',
                    title: 'Start Your Online Booking',
                    desc: 'Open the Accurate Pathology website/app. Select the test or package and enter your details. Schedule the service for your preferred slot.'
                  },
                  {
                    num: 2,
                    pillText: 'TRACK',
                    pillColors: 'bg-pink-50 text-pink-500',
                    blockColor: 'bg-[#e43b59]', // Pinkish Red
                    img: '/images/step_2.png',
                    title: 'Live Tracking',
                    desc: 'Stay updated with real-time tracking for a smooth and timely home sample collection.'
                  },
                  {
                    num: 3,
                    pillText: 'COLLECT',
                    pillColors: 'bg-teal-50 text-teal-600',
                    blockColor: 'bg-[#15af8b]', // Teal
                    img: '/images/step_3.png',
                    title: 'Sample Collection',
                    desc: 'Our certified experts ensure a smooth, hygienic, and fully compliant sample collection experience.'
                  },
                  {
                    num: 4,
                    pillText: 'REPORT',
                    pillColors: 'bg-indigo-50 text-indigo-600',
                    blockColor: 'bg-[#2b4b7c]', // Navy Blue
                    img: '/images/step_4.png',
                    title: 'Doctor-Verified Smart Reports',
                    desc: 'Every report is clinically checked by expert doctors and shared with smart, actionable insights.'
                  },
                  {
                    num: 5,
                    pillText: 'CONSULT & ACT',
                    pillColors: 'bg-red-50 text-red-600',
                    blockColor: 'bg-[#d82a39]', // Standard Red
                    img: '/images/step_5.png',
                    title: 'Your Health Journey Continues Post Reports',
                    desc: 'Consult with our expert medical team to get actionable insights to improve your health.'
                  }
               ].map((step) => (
                  <div key={step.num} className="bg-white border hover:border-gray-300 rounded-3xl border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col group h-full">
                     {/* Pill Header */}
                     <div className="flex justify-center mb-5">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${step.pillColors}`}>
                           {step.pillText}
                        </span>
                     </div>
                     
                     {/* Split Image View */}
                     <div className="flex h-[110px] w-full rounded-2xl overflow-hidden mb-6 shadow-sm border border-gray-100">
                        <div className={`w-[45%] flex flex-col items-center justify-center text-white space-y-0 leading-none ${step.blockColor}`}>
                           <span className="text-[9px] font-black tracking-widest opacity-90">STEP</span>
                           <span className="text-[54px] font-black leading-[0.9] mt-0.5">{step.num}</span>
                        </div>
                        <div className="w-[55%] relative h-full">
                           <Image src={step.img} fill className="object-cover" alt={step.title} />
                        </div>
                     </div>
                     
                     <h3 className="font-extrabold text-blue-950 text-[15px] mb-3 leading-tight text-center px-1">{step.title}</h3>
                     <p className="text-[13px] text-gray-500 font-medium leading-[1.6] text-center px-1 flex-1">{step.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. TRENDING HEALTH CHECKUPS */}
      <section className="max-w-[1280px] mx-auto px-6 pt-20 bg-[#fafafa] pb-10">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-[26px] font-bold text-blue-950 tracking-tight flex items-center gap-2">
               Trending Health Checkups <TrendingUp size={24} className="text-red-500" />
            </h2>
            <Link href="/search" className="text-blue-600 text-sm font-bold flex items-center">View All <ChevronRight size={16}/></Link>
         </div>

         {/* Tabs */}
         <div className="flex gap-4 mb-8 overflow-x-auto scrollbar-hide border-b border-gray-200 pb-2">
             {['All', 'Diabetes', 'Full Body', 'Fever', 'Vitamins & Minerals', 'Joints', 'Winter Specials', 'Menoco'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTrendingTab(tab)}
                  className={`pb-2 whitespace-nowrap text-sm font-bold border-b-2 transition-colors ${activeTrendingTab === tab ? 'border-red-500 text-blue-950' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                   {tab}
                </button>
             ))}
         </div>

         <div className="grid md:grid-cols-4 gap-6">
             {trendingPackages.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} addToCart={addToCart} isInCart={isInCart} small />
             ))}
         </div>
      </section>

      {/* 8. TRUSTED BY MILLIONS BANNER */}
      <section className="max-w-[1280px] mx-auto px-6 pt-16">
         <div className="bg-[#f0f7ff] rounded-3xl overflow-hidden border border-blue-100 grid md:grid-cols-2 relative shadow-sm">
            <div className="relative h-[350px] md:h-full w-full hidden md:block">
               <Image src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop" alt="Family Couch" fill className="object-cover" />
            </div>
            <div className="p-10 md:p-14 flex flex-col justify-center">
               <h2 className="text-4xl font-black text-blue-950 mb-2 leading-tight">
                  TRUSTED By MILLIONS <br/><span className="text-red-500">For Accurate & Fast</span>
               </h2>
               <p className="text-gray-600 text-sm mb-6">Enjoy Priority Sample Collection from the comfort of your home.</p>
               <ul className="space-y-3 mb-8">
                  {['Guaranteed Fast Reports', 'Most Advanced & Precision testing', 'Free Consultation', '100% accurate results'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm font-bold text-blue-950">
                        <CheckCircle size={18} className="text-red-500" />
                        {item}
                     </li>
                  ))}
               </ul>
               <button className="bg-red-500 text-white px-8 py-3.5 rounded-xl font-bold self-start shadow-md hover:bg-red-600 transition-colors">
                  Book A Home Visit
               </button>
            </div>
         </div>
      </section>

      {/* 9. VISIT CARE CENTER */}
      <section className="max-w-[1280px] mx-auto px-6 pt-16">
         <div className="bg-white border shadow-sm border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600"><MapPin size={24} /></div>
                <div>
                   <h3 className="font-bold text-blue-950 text-lg">By visiting Accurate Pathology Care Center near You</h3>
                   <p className="text-sm text-gray-500">Find the nearest premium collection center.</p>
                </div>
             </div>
             <button className="border border-blue-200 text-blue-700 bg-blue-50 font-bold px-6 py-2.5 rounded-xl mt-4 md:mt-0 flex items-center gap-2 hover:bg-blue-100 transition-colors">
                 Find Center
                 <ChevronRight size={16} />
             </button>
         </div>
      </section>

      {/* 10. HEALTH RISK / CONCERNS */}
      <section className="max-w-[1280px] mx-auto px-6 pt-16">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-[26px] font-bold text-blue-950 tracking-tight">Health Risks & Concerns</h2>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conditionTiles.map((tile) => (
                <div key={tile.label} className="bg-white border shadow-sm border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer">
                   <div className={`${tile.bg} ${tile.text} p-4 rounded-xl mb-4`}>
                      <tile.icon size={28} />
                   </div>
                   <h3 className="font-bold text-blue-950 text-[15px]">{tile.label}</h3>
                </div>
            ))}
         </div>
      </section>

      {/* 11. CREATE YOUR OWN PACKAGE */}
      <section className="max-w-[1280px] mx-auto px-6 pt-16">
         <div className="bg-gradient-to-r from-[#031d40] to-[#0a2f5c] rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center relative pl-8 md:pl-16 pr-8 border border-blue-900 shadow-xl">
             <div className="py-12 md:py-20 flex-1 z-10 w-full relative">
                 <div className="inline-flex bg-[#123e75] text-blue-100 font-bold px-3 py-1 rounded text-xs mb-4">
                    CUSTOMIZE
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">Create your Own Package</h2>
                 <p className="text-blue-200 font-medium max-w-sm mb-8 text-sm">Choose exactly the tests you need, combine them, and get priority processing with extra savings.</p>
                 <button className="bg-white text-blue-950 font-black px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-gray-100 transition-colors">
                    Start Creating Now
                 </button>
             </div>
             <div className="h-[300px] md:h-[400px] w-full md:w-[45%] relative">
                 <Image src="https://images.unsplash.com/photo-1580281658626-ee379eb74b34?q=80&w=800&fit=crop" fill alt="Custom Package" className="object-cover object-center" />
             </div>
         </div>
      </section>

      {/* 12. CUSTOMER REVIEWS */}
      <section className="max-w-[1280px] mx-auto px-6 pt-20">
         <h2 className="text-[26px] font-bold text-blue-950 tracking-tight mb-8">Customer Reviews</h2>
         <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {[1, 2, 3].map(i => (
               <div key={i} className="min-w-[320px] bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative">
                  <div className="flex items-center gap-1 mb-4 text-yellow-400">
                     <Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} />
                  </div>
                  <p className="font-medium text-gray-600 text-sm italic mb-6 leading-relaxed">
                     "Very professional staff and timely reporting. I booked the Full Body checkup and the phlebotomist was exactly on time. Reports were sent directly to WhatsApp within 12 hours. Highly recommended!"
                  </p>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-900 border border-blue-200">
                        {['A', 'R', 'S'][i-1]}
                     </div>
                     <div>
                        <h4 className="font-bold text-blue-950 text-sm">{['Amit Kumar', 'Rohit Sharma', 'Sneha Kapoor'][i-1]}</h4>
                        <p className="text-gray-400 text-xs">Delhi</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* 13. LIFESTYLE & HEALTH BLOGS */}
      <section className="max-w-[1280px] mx-auto px-6 pt-20 pb-20">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-[26px] font-bold text-blue-950 tracking-tight">Read more on Accurate Pathology Lifestyle & Health Blogs</h2>
            <Link href="/" className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center"><ArrowRight size={18} /></Link>
         </div>
         <div className="grid md:grid-cols-3 gap-6">
            {[
               { title: "Understand your Liver Function Test Reports", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=300&fit=crop" },
               { title: "5 Simple Ways to lower your Cholesterol", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&h=300&fit=crop" },
               { title: "Vitamin D Deficiency: Symptoms & Cure", img: "https://images.unsplash.com/photo-1542013936693-884638332954?w=500&h=300&fit=crop" }
            ].map((blog, i) => (
               <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm group cursor-pointer hover:shadow-md transition-all">
                  <div className="relative h-48 overflow-hidden">
                     <Image src={blog.img} fill alt="Blog" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                     <div className="flex gap-2 mb-3">
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-wider">Health</span>
                     </div>
                     <h3 className="font-bold text-blue-950 text-[17px] mb-4 group-hover:text-red-500 transition-colors leading-tight">{blog.title}</h3>
                     <p className="text-blue-500 text-xs flex items-center gap-1 font-bold">Read Article <ChevronRight size={14} /></p>
                  </div>
               </div>
            ))}
         </div>
      </section>
      
      {/* 14. MOBILE APP DOWNLOAD BANNER */}
      <section className="bg-gray-50 py-16 border-t border-gray-200">
         <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
             <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-black text-blue-950 leading-tight mb-4 tracking-tighter">
                   Download the new <br/><span className="text-red-500 underline decoration-red-200 decoration-4 underline-offset-4">Accurate Pathology App</span>
                </h2>
                <p className="text-gray-600 font-medium text-lg mb-8 max-w-md mx-auto md:mx-0">
                   Get faster booking, priority home collection, and instant WhatsApp report updates.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                   <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" width={100} height={100} />
                   </div>
                   <div className="space-y-3 flex flex-col items-center md:items-start">
                      <p className="font-bold text-blue-950 text-sm">Scan to Download The App</p>
                      <div className="flex gap-3">
                         <div className="bg-blue-950 text-white px-4 py-2.5 rounded-lg text-xs font-bold w-32 text-center cursor-pointer hover:bg-gray-800 transition-colors shadow-md">App Store</div>
                         <div className="bg-blue-950 text-white px-4 py-2.5 rounded-lg text-xs font-bold w-32 text-center cursor-pointer hover:bg-gray-800 transition-colors shadow-md">Google Play</div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative h-[400px] hidden md:block w-full">
                <Image src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&fit=crop" fill alt="App" className="object-cover rounded-3xl shadow-xl border-4 border-white" />
             </div>
         </div>
      </section>

    </div>
  );
}


// Reusable Package Card Component
function PackageCard({ pkg, addToCart, isInCart, small = false }: any) {
   return (
      <div className="bg-white border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full border-gray-200">
         <div className="flex justify-between items-start mb-4">
            <div className="bg-red-50 text-red-600 text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider">
               PACKAGE
            </div>
            <div className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded border border-gray-200">
               {pkg.category}
            </div>
         </div>
         
         <h3 className={`font-black text-blue-950 leading-tight mb-4 ${small ? 'text-lg' : 'text-xl'}`}>{pkg.name}</h3>
         
         <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-5 flex-1">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Includes {pkg.testsCount || pkg.parameters.length} Parameters</p>
            <div className={`space-y-1 ${small ? 'h-16' : 'h-24'} overflow-hidden`}>
               {pkg.parameters.map((p: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-[13px] text-gray-700 font-medium">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                     <p className="truncate">{p}</p>
                  </div>
               ))}
            </div>
            <p className="text-blue-600 text-[12px] font-bold mt-2 cursor-pointer hover:underline">+ View all</p>
         </div>

         <div className="border-t border-gray-100 pt-4 mb-4 flex items-center justify-between">
             <div className="flex items-center gap-2 text-xs text-blue-950 font-bold">
                <FileSearch size={14} className="text-gray-400" /> Report in {pkg.reportTime} Hrs
             </div>
         </div>

         <div className="flex items-end justify-between mt-auto">
             <div>
                <p className="text-gray-400 text-xs font-bold line-through">₹{pkg.originalPrice}</p>
                <div className="flex items-center gap-2">
                   <p className="font-black text-2xl text-blue-950">₹{pkg.price}</p>
                   {pkg.discount && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">-{pkg.discount}%</span>}
                </div>
             </div>
             {isInCart(pkg.id) ? (
                 <button onClick={() => addToCart(pkg)} className="bg-green-50 text-green-600 border border-green-200 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                     Added
                 </button>
             ) : (
                 <button onClick={() => addToCart(pkg)} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md">
                     Book Now
                 </button>
             )}
         </div>
      </div>
   )
}

function ScanFaceIcon() {
   return (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
       <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
       <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
       <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
       <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
       <path d="M9 9h.01"></path>
       <path d="M15 9h.01"></path>
     </svg>
   )
}
