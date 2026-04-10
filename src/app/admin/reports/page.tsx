'use client';

import React, { useState } from 'react';
import { sampleBookings } from '@/lib/sample-data';
import { Upload, FileText, Link as LinkIcon, Search, Check, X } from 'lucide-react';

interface ReportEntry {
  id: string;
  bookingId: string;
  testName: string;
  patientName: string;
  pdfUrl: string;
  uploadedAt: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportEntry[]>([
    {
      id: 'R001',
      bookingId: 'BK001',
      testName: 'Fit India Full Body Checkup - Essential',
      patientName: 'Rahul Sharma',
      pdfUrl: 'report_BK001.pdf',
      uploadedAt: '2026-04-06',
    },
  ]);

  const [showUpload, setShowUpload] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [searchBooking, setSearchBooking] = useState('');

  const bookingsWithoutReports = sampleBookings.filter(
    b => b.status === 'completed' && !reports.find(r => r.bookingId === b.id)
  );

  const filteredBookings = sampleBookings.filter(b =>
    b.id.toLowerCase().includes(searchBooking.toLowerCase()) ||
    b.patientName.toLowerCase().includes(searchBooking.toLowerCase())
  );

  const uploadReport = () => {
    const booking = sampleBookings.find(b => b.id === selectedBookingId);
    if (!booking) return;

    const newReport: ReportEntry = {
      id: 'R' + Date.now().toString().slice(-4),
      bookingId: booking.id,
      testName: booking.items[0]?.testName || 'Test',
      patientName: booking.patientName,
      pdfUrl: `report_${booking.id}.pdf`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setReports([newReport, ...reports]);
    setShowUpload(false);
    setSelectedBookingId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">{reports.length} reports uploaded</p>
        <button onClick={() => setShowUpload(!showUpload)} className="btn-primary rounded-xl">
          <Upload size={16} /> Upload Report
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="bg-[#1a2332] rounded-2xl border border-white/5 p-6 animate-fade-in-up">
          <h3 className="text-white font-bold mb-4">Upload Report PDF</h3>

          {/* Search booking */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-white/50 mb-1.5">Link to Booking</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4">
              <Search size={14} className="text-white/30" />
              <input
                type="text" value={searchBooking} onChange={e => setSearchBooking(e.target.value)}
                placeholder="Search booking by ID or patient name..."
                className="w-full px-3 py-2.5 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
              />
            </div>
          </div>

          {searchBooking && (
            <div className="space-y-1 mb-4 max-h-40 overflow-auto">
              {filteredBookings.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBookingId(b.id); setSearchBooking(''); }}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-colors ${
                    selectedBookingId === b.id ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono text-xs">{b.id}</span> — {b.patientName} — {b.items[0]?.testName}
                </button>
              ))}
            </div>
          )}

          {selectedBookingId && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-accent/10 rounded-xl">
              <Check size={14} className="text-accent" />
              <span className="text-sm text-accent font-medium">Selected: {selectedBookingId}</span>
            </div>
          )}

          {/* File upload */}
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4 hover:border-accent/30 transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-white/20 mb-2" />
            <p className="text-sm text-white/50">Drop PDF here or click to upload</p>
            <p className="text-xs text-white/30 mt-1">(Mock: file will be simulated)</p>
          </div>

          <div className="flex gap-3">
            <button onClick={uploadReport} disabled={!selectedBookingId} className="btn-primary flex-1 justify-center py-2.5 rounded-xl disabled:opacity-50">
              Upload & Link Report
            </button>
            <button onClick={() => setShowUpload(false)} className="px-6 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm font-semibold hover:bg-white/10">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reports list */}
      <div className="bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase">
                <th className="text-left py-3 px-4">Report ID</th>
                <th className="text-left py-3 px-4">Booking ID</th>
                <th className="text-left py-3 px-4">Patient</th>
                <th className="text-left py-3 px-4">Test</th>
                <th className="text-left py-3 px-4">File</th>
                <th className="text-left py-3 px-4">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 font-mono text-xs text-white/60">{report.id}</td>
                  <td className="py-3 px-4 font-mono text-xs text-accent">{report.bookingId}</td>
                  <td className="py-3 px-4 text-white font-medium">{report.patientName}</td>
                  <td className="py-3 px-4 text-white/60">{report.testName}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-brand-red">
                      <FileText size={12} /> {report.pdfUrl}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/40">{report.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
