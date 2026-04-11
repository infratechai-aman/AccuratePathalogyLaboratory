import React from 'react';
import ClientLayout from '@/components/layout/ClientLayout';
import { Shield, Target, Microscope, Flag } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | Accurate Pathology Laboratory',
  description: 'Learn about our 15+ year legacy in delivering highly accurate, doctor-verified diagnostic solutions.',
};

export default function AboutPage() {
  return (
    <ClientLayout>
      <div className="bg-[#f8fbff] min-h-screen pb-16">
        {/* Banner Section */}
        <div className="bg-[#0b3c66] py-16 md:py-24 px-6 mt-16 lg:mt-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]"></div>
          <div className="max-w-[1280px] mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">About Us</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium">Adding Healthy Years to Lives through Precision Diagnostics and Technology</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[900px] mx-auto px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-10">
             <h2 className="text-2xl font-bold text-[#0b3c66] mb-6">Our Story</h2>
             <p className="text-gray-600 mb-6 leading-relaxed">
               Accurate Pathology Laboratory started with a singular vision: to make high-quality diagnostic services accessible, affordable, and seamless. Over the years, we have built a robust network of state-of-the-art laboratories and a highly optimized supply chain to deliver precise test results directly to our patients.
             </p>
             <p className="text-gray-600 leading-relaxed">
               Today, we serve millions of patients, leveraging clinical expertise and next-generation AI tools. Our commitment remains unwavering: providing 4X value with every test, coupled with doctor-verified reliability.
             </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
               <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                 <Target size={24} strokeWidth={2.5} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
               <p className="text-gray-600 text-[15px] leading-relaxed">To deliver zero-error diagnostics with blazing fast turnarounds, ensuring that every patient can make informed health decisions without delay.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
               <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center text-red-600 mb-6">
                 <Shield size={24} strokeWidth={2.5} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
               <p className="text-gray-600 text-[15px] leading-relaxed">To become the universally trusted standard for pathology, redefining the health tech landscape with unwavering ethics and empathy.</p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
