'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Share2, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getReportsByUser } from '@/lib/services/db';
import { useRouter } from 'next/navigation';
import { Report } from '@/lib/types';

export default function MyReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/?login=true'); // Or redirect however you prefer
      return;
    }

    if (user) {
      const fetchReports = async () => {
        try {
          const userReports = await getReportsByUser(user.uid);
          setReports(userReports);
        } catch (error) {
          console.error("Error fetching reports:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 size={32} className="animate-spin text-red-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading your reports...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reports</h1>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">No reports available</h2>
          <p className="text-gray-500 text-sm mb-6">Your reports will appear here once your tests are completed</p>
          <button onClick={() => router.push('/search')} className="bg-[#1b4372] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#122e50]">
            Book a Test
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <FileText size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-0.5">{report.testName}</h3>
                    <p className="text-xs font-mono text-gray-500">Booking ID: {report.bookingId}</p>
                    <p className="text-xs text-gray-500 mt-1">Generated: {new Date(report.uploadedAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-1 mt-2">
                       <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-[10px] flex items-center gap-1 w-max">
                          <Eye size={10} /> Doctor Verified
                       </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors" title="View Full Report">
                    <Eye size={16} className="text-gray-700" />
                  </a>
                  <a href={report.pdfUrl} download className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors" title="Download PDF">
                    <Download size={16} className="text-[#1b4372]" />
                  </a>
                  <a
                    href={`https://wa.me/?text=Check%20my%20medical%20report%20from%20Accurate%20Pathology%20Laboratory:%20${encodeURIComponent(report.pdfUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                    title="Share via WhatsApp"
                  >
                    <Share2 size={16} className="text-green-600" />
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
