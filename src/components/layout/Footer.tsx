'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, MessageCircle, Phone, Dna, ShieldCheck, Crosshair, MapPin as LocationMarker } from 'lucide-react';

const quickLinks = [
  { href: '/services/face-scan', label: 'Face Scan' },
  { href: '/partner', label: 'Partner With Us' },
  { href: '/franchise', label: 'Franchise Opportunity' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/about', label: 'About Us' },
  { href: '/labs', label: 'Our Labs' },
  { href: '/esg', label: 'ESG Practices' },
  { href: '/contact', label: 'Have a Query' },
  { href: '/careers', label: 'Career' },
  { href: '/compliance', label: 'Statutory Compliance' },
];

export default function Footer() {
  return (
    <>
      <footer className="bg-[#0b3c66] pt-12 pb-16 relative w-full overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-white">
          <div className="grid lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-8 md:gap-10">
            {/* Column 1: Brand & Text */}
            <div className="flex flex-col border-b border-white/10 lg:border-none pb-8 lg:pb-0">
              {/* Logo Area */}
              <div className="flex items-center gap-3 mb-6">
                <Image src="/images/logo.png" alt="Accurate Labs Icon" width={48} height={48} className="object-contain brightness-0 invert" />
                <div className="flex flex-col leading-none">
                  <span className="text-[26px] font-bold tracking-tight text-white m-0">Accurate</span>
                  <span className="text-[15px] text-[#E53E3E] font-medium tracking-wide">Pathology Laboratory</span>
                </div>
              </div>

              {/* Description Paragraph */}
              <p className="text-[14px] leading-[1.6] text-white/90 font-medium mb-6">
                Accurate Pathology Laboratory is an impact-driven, fast-growing diagnostic healthcare partner
                redefining healthcare access with the purpose of Adding Healthy Years to Lives. Having served 
                1+ crore customers, the company operates with a preventive-first approach across 220+ cities 
                through 80+ advanced labs, offering 3,600+ tests powered by clinical expertise and AI-led innovation. 
                With home sample collection, every test delivers 4X benefits for earlier risk detection and better health everyday.
              </p>

              <hr className="border-white/20 mb-6" />

              {/* Quality Seal */}
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-[50px] h-[50px] rounded-full border-2 border-yellow-500 bg-yellow-500/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <ShieldCheck size={26} className="text-yellow-500" />
                 </div>
                 <p className="text-[14px] font-bold leading-tight">
                    We are committed to deliver<br />highest quality standards and<br />exceptional customer service
                 </p>
              </div>

              {/* DMCA Footer */}
              <p className="text-[13px] text-white font-medium">
                The Content on this website is <span className="font-bold">DMCA protected</span>
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-[16px] font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[14px] font-medium text-white hover:underline decoration-1 underline-offset-4">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Follow us on */}
            <div>
              <h4 className="text-[16px] font-bold text-white mb-6">Follow us on</h4>
              <div className="flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0b3c66] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0b3c66] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0b3c66] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0b3c66] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.5-1.119-2.5-2.5 1.11-2.5 2.48-2.5 2.5 1.119 2.5 2.5zm.02 5.5v14h-5v-14h5zm18 14h-5v-7.054c0-1.782-.034-4.07-2.48-4.07-2.484 0-2.865 1.942-2.865 3.94v7.184h-5v-14h4.8v1.912h.068c.668-1.265 2.3-2.6 4.736-2.6 5.068 0 6.002 3.333 6.002 7.669v7.019z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0b3c66] transition-all">
                     <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                     </svg>
                  </a>
              </div>
            </div>

            {/* Column 4: Connect with us */}
            <div className="flex flex-col h-full">
              <h4 className="text-[16px] font-bold text-white mb-6">Connect with us</h4>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex flex-shrink-0 items-center justify-center mt-0.5">
                    <Mail size={14} className="text-white" />
                  </div>
                  <a href="mailto:care@accuratepathlabs.in" className="text-[14px] font-medium leading-relaxed mt-1.5 hover:underline">care@accuratepathlabs.in</a>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex flex-shrink-0 items-center justify-center mt-0.5">
                    <Phone size={14} className="text-white" />
                  </div>
                  <a href="tel:8840658081" className="text-[14px] font-medium leading-relaxed mt-1.5 hover:underline">884 065 8081</a>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex flex-shrink-0 items-center justify-center mt-0.5">
                    <MapPin size={14} className="text-white" />
                  </div>
                  <div className="text-[14px] font-medium leading-relaxed">
                    Accurate Pathalogy Laboratory Pvt. Ltd.
                  </div>
                </div>
                
                <div className="pl-12 text-[14px] text-white/90 leading-[1.6] mt-[-10px]">
                  <span className="font-bold">Corporate Address:</span><br/>
                  Near Padamji Police Station, Bhavani Peth, Camp, Pune - 411001
                </div>
              </div>

              {/* Locate Lab Pill Box */}
               <div className="mt-auto self-start xl:self-end bg-white rounded-full flex items-center pr-1.5 pl-5 py-1.5 shadow-lg w-full max-w-[320px]">
                  <div className="flex items-center gap-2 text-[#0b3c66] flex-1">
                     <Crosshair size={18} strokeWidth={2.5} />
                     <span className="font-bold text-[14px]">Find a lab near me</span>
                  </div>
                  <button className="bg-[#1b3d6d] hover:bg-[#0b2d56] transition-colors text-white font-bold text-[13px] px-6 py-2.5 rounded-full whitespace-nowrap shadow-sm">
                     Locate Now
                  </button>
               </div>
            </div>
            
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/918840658081"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float bg-green-500 hover:bg-green-600 shadow-[0_4px_24px_rgba(34,197,94,0.4)]"
      >
        <MessageCircle size={28} fill="currentColor" className="text-white" />
      </a>
    </>
  );
}
