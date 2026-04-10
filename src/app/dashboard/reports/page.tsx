'use client';

import React from 'react';
import { FileText, Download, Share2, Eye } from 'lucide-react';

const sampleReports = [
  { id: 'R001', bookingId: 'BK001', testName: 'Fit India Full Body Checkup - Essential', uploadedAt: '2026-04-06', pdfUrl: '#' },
];

export default function MyReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">My Reports</h1>

      {sampleReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/50 p-12 text-center">
          <FileText size={48} className="mx-auto text-text-muted/30 mb-4" />
          <h2 className="text-lg font-bold text-primary mb-2">No reports available</h2>
          <p className="text-text-muted text-sm">Your reports will appear here once your tests are completed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sampleReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-border/50 p-5 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                    <FileText size={24} className="text-brand-red" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary mb-0.5">{report.testName}</h3>
                    <p className="text-xs text-text-muted">Booking ID: {report.bookingId}</p>
                    <p className="text-xs text-text-muted mt-1">Report generated on {report.uploadedAt}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="badge badge-success">Doctor Verified</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-surface hover:bg-surface-alt transition-colors" title="View">
                    <Eye size={16} className="text-primary" />
                  </button>
                  <button className="p-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors" title="Download">
                    <Download size={16} className="text-accent" />
                  </button>
                  <a
                    href={`https://wa.me/?text=Check%20my%20report%20from%20AccurateLabs`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                    title="Share via WhatsApp"
                  >
                    <Share2 size={16} className="text-[#25D366]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
