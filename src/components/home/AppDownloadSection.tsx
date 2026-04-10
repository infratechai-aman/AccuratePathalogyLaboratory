'use client';

import React from 'react';
import Link from 'next/link';
import { Download, FileText, QrCode, Smartphone } from 'lucide-react';

const qrPattern = Array.from({ length: 25 }, (_, index) => index);

export default function AppDownloadSection() {
  return (
    <section className="section-gap pt-2">
      <div className="container-main">
        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#0f1f39_0%,#132a4d_52%,#193967_100%)] px-6 py-8 text-white shadow-[0_30px_60px_rgba(16,30,54,0.18)] md:px-9 md:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.92fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/72">
                <Download size={14} />
                App-style CTA section
              </span>
              <h2 className="font-heading mt-5 text-[clamp(2.2rem,4vw,4rem)] font-bold leading-[0.95] tracking-[-0.05em] text-white">
                Continue the premium experience beyond the homepage.
              </h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-7 text-white/68">
                The reference site closes with a strong app and smart-report banner, so this final block
                keeps that same polished ending with a QR-style visual and mobile-first product panel.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/dashboard/reports" className="btn-primary">
                  View reports
                </Link>
                <Link href="/search" className="btn-outline border-white/16 bg-white/8 text-white hover:bg-white/14">
                  Book a test
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2 text-white/72">
                  <QrCode size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.18em]">Scan to continue</span>
                </div>

                <div className="grid grid-cols-5 gap-1 rounded-[22px] bg-white p-4">
                  {qrPattern.map((item) => (
                    <div
                      key={item}
                      className={`aspect-square rounded-[4px] ${
                        [0, 1, 4, 5, 6, 9, 20, 21, 24, 3, 8, 12, 16, 18, 22].includes(item)
                          ? 'bg-[#101e36]'
                          : 'bg-[#d7ddea]'
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-white/70">
                  Use this space for your client&apos;s app QR, report login shortcut, or patient onboarding.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur">
                <div className="rounded-[24px] bg-white p-5 text-[#101e36] shadow-[0_18px_34px_rgba(16,30,54,0.18)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d8798]">Patient panel</p>
                      <p className="mt-2 text-lg font-bold">Smart report snapshot</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde7ee] text-[#e31b54]">
                      <Smartphone size={22} />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      { label: 'Hemoglobin', value: 'Normal' },
                      { label: 'Vitamin D', value: 'Low' },
                      { label: 'Cholesterol', value: 'Review' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-2xl bg-[#f7f9fc] px-4 py-3">
                        <span className="text-sm font-semibold text-[#334155]">{row.label}</span>
                        <span className="rounded-full bg-[#e8f7f3] px-3 py-1 text-xs font-bold text-[#0b9a8a]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-[20px] bg-[#101e36] px-4 py-3 text-white">
                    <FileText size={18} />
                    <span className="text-sm font-semibold">Doctor-reviewed summary available after report generation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
