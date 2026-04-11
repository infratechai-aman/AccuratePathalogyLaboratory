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
        <p className="text-gray-500 font-semibold text-sm bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm">{reports.length} reports uploaded</p>
        <button onClick={() => setShowUpload(!showUpload)} className="bg-[#0A2540] hover:bg-[#0e3460] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Upload size={16} /> Upload Report
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in-up">
          <h3 className="text-[#0A2540] font-black mb-4">Upload Report PDF</h3>

          {/* Search booking */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Link to Booking</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
              <Search size={14} className="text-gray-400" />
              <input
                type="text" value={searchBooking} onChange={e => setSearchBooking(e.target.value)}
                placeholder="Search booking by ID or patient name..."
                className="w-full px-3 py-2.5 bg-transparent outline-none text-sm text-[#0A2540] placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {searchBooking && (
            <div className="space-y-1 mb-4 max-h-40 overflow-auto">
              {filteredBookings.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBookingId(b.id); setSearchBooking(''); }}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-colors border ${
                    selectedBookingId === b.id ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <span className="font-mono text-xs">{b.id}</span> — {b.patientName} — {b.items[0]?.testName}
                </button>
              ))}
            </div>
          )}

          {selectedBookingId && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <Check size={14} className="text-emerald-600" />
              <span className="text-sm text-emerald-700 font-bold">Selected: {selectedBookingId}</span>
            </div>
          )}

          {/* File upload */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4 hover:border-[#0A2540] transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-bold text-[#0A2540]">Drop PDF here or click to upload</p>
            <p className="text-xs text-gray-400 font-medium mt-1">(Mock: file will be simulated)</p>
          </div>

          <div className="flex gap-3">
            <button onClick={uploadReport} disabled={!selectedBookingId} className="bg-[#E53E3E] disabled:bg-gray-200 disabled:text-gray-400 hover:bg-red-700 text-white font-bold flex-1 justify-center py-3 rounded-xl transition-colors">
              Upload & Link Report
            </button>
            <button onClick={() => setShowUpload(false)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reports list */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold">
                <th className="text-left py-3 px-5">Report ID</th>
                <th className="text-left py-3 px-5">Booking ID</th>
                <th className="text-left py-3 px-5">Patient</th>
                <th className="text-left py-3 px-5">Test</th>
                <th className="text-left py-3 px-5">File</th>
                <th className="text-left py-3 px-5">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-gray-500">{report.id}</td>
                  <td className="py-4 px-5 font-mono text-xs font-bold text-[#0A2540]">{report.bookingId}</td>
                  <td className="py-4 px-5 text-[#0A2540] font-bold">{report.patientName}</td>
                  <td className="py-4 px-5 text-gray-600 font-medium">{report.testName}</td>
                  <td className="py-4 px-5">
                    <span className="flex items-center gap-1.5 text-[#E53E3E] font-bold bg-red-50 px-3 py-1.5 rounded-lg w-fit">
                      <FileText size={14} /> {report.pdfUrl}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-500 text-xs font-medium">{report.uploadedAt}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No reports uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
