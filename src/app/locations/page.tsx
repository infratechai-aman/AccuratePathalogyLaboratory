import React from 'react';
import ClientLayout from '@/components/layout/ClientLayout';
import { MapPin, Search, Navigation } from 'lucide-react';

export const metadata = {
  title: 'Lab Locations | Accurate Pathology Laboratory',
  description: 'Find a premium Accurate Pathology collection center near you. We have 80+ labs across 200+ cities.',
};

export default function LocationsPage() {
  return (
    <ClientLayout>
      <div className="bg-[#f8fbff] min-h-screen pb-20">
        <div className="bg-[#0b3c66] py-16 md:py-24 px-6 mt-16 lg:mt-0 relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Our Locations</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium">Find a premium collection center near you</p>
            
            <div className="mt-8 max-w-xl mx-auto relative">
               <input type="text" placeholder="Search your city or pin code..." className="w-full bg-white rounded-full py-4 pl-12 pr-6 border-none shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-gray-800" />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 -mt-8 relative z-20">
           <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Featured Centers (Pune)</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Main Lab */}
                 <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Main Lab</div>
                    <div className="flex gap-4">
                       <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <MapPin size={22} />
                       </div>
                       <div>
                          <h3 className="font-bold text-gray-900 mb-1 text-[17px]">Corporate Excellence Center</h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">Near Padamji Police Station, Bhavani Peth, Camp, Pune - 411001</p>
                          <button className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:underline">
                             <Navigation size={14} /> Get Directions
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Placeholder Lab 1 */}
                 <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                       <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <MapPin size={22} />
                       </div>
                       <div>
                          <h3 className="font-bold text-gray-900 mb-1 text-[17px]">Hadapsar Collection Center</h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">Shop 4, Ground Floor, DP Road, Hadapsar, Pune - 411028</p>
                          <button className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:underline">
                             <Navigation size={14} /> Get Directions
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Placeholder Lab 2 */}
                 <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                       <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                          <MapPin size={22} />
                       </div>
                       <div>
                          <h3 className="font-bold text-gray-900 mb-1 text-[17px]">Kothrud Care Center</h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">12A, Karve Road, Next to Metro Station, Kothrud, Pune - 411038</p>
                          <button className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:underline">
                             <Navigation size={14} /> Get Directions
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="mt-12 text-center">
                 <p className="text-gray-500 mb-4">We are expanding our network. More cities coming soon.</p>
              </div>
           </div>
        </div>
      </div>
    </ClientLayout>
  );
}
