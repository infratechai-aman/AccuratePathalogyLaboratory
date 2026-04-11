import React from 'react';
import ClientLayout from '@/components/layout/ClientLayout';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Help & Support | Accurate Pathology Laboratory',
  description: 'Reach out to our customer care team for any queries regarding bookings, reports, or home sample collection.',
};

export default function SupportPage() {
  return (
    <ClientLayout>
      <div className="bg-[#f8fbff] min-h-screen pb-16">
        <div className="bg-[#0b3c66] py-16 md:py-24 px-6 mt-16 lg:mt-0 relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Help & Support</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium">We're here to help. Reach out to us for fast and reliable assistance.</p>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-6 -mt-8 relative z-20">
          <div className="grid md:grid-cols-3 gap-6 mb-10">
             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                   <Phone size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-500 text-sm mb-3">Mon-Sat, 7AM - 9PM</p>
                <a href="tel:8840658081" className="text-blue-600 font-bold hover:underline">884 065 8081</a>
             </div>
             
             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                   <MessageSquare size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">WhatsApp Us</h3>
                <p className="text-gray-500 text-sm mb-3">Instant replies</p>
                <a href="https://wa.me/918840658081" target="_blank" rel="noreferrer" className="text-green-600 font-bold hover:underline">Chat on WhatsApp</a>
             </div>
             
             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                   <Mail size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-500 text-sm mb-3">We reply within 2 hours</p>
                <a href="mailto:care@accuratepathlabs.in" className="text-red-500 font-bold hover:underline">care@accuratepathlabs.in</a>
             </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row">
             <div className="w-full md:w-1/2 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Your name" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="10-digit mobile number" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none" placeholder="How can we help?"></textarea>
                   </div>
                   <button type="button" className="w-full bg-[#e60000] text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-md">
                      Send Message
                   </button>
                </form>
             </div>
             <div className="w-full md:w-1/2 bg-gray-50 p-8 md:p-12 border-l border-gray-100 flex flex-col justify-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-blue-900 mb-6">
                   <MapPin size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Corporate Office</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                   Accurate Pathalogy Laboratory Pvt. Ltd.<br />
                   Near Padamji Police Station,<br />
                   Bhavani Peth, Camp,<br />
                   Pune - 411001
                </p>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                   <p className="text-sm text-blue-800 font-medium">Looking for a nearby collection center? Please use our Locations page to find the nearest lab.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
