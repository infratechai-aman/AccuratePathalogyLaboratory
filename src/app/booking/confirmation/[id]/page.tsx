'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import Link from 'next/link';
import { CheckCircle, Calendar, FileText, MessageCircle, ArrowRight } from 'lucide-react';

export default function BookingConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const name = searchParams.get('name') || 'Patient';
  const total = searchParams.get('total') || '0';

  return (
    <ClientLayout>
      <div className="min-h-screen bg-surface/30 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-border/50 p-8 text-center shadow-lg animate-fade-in-up">
          {/* Success animation */}
          <div className="mb-6 relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mx-auto">
              <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center animate-bounce">
                <CheckCircle size={36} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-primary mb-2">Booking Confirmed!</h1>
          <p className="text-text-muted mb-6">
            Thank you, <strong className="text-primary">{name}</strong>! Your booking has been placed successfully.
          </p>

          {/* Booking details */}
          <div className="bg-surface/50 rounded-xl p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Booking ID</span>
              <span className="font-bold text-primary">{bookingId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Amount Paid</span>
              <span className="font-bold text-success">₹{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Status</span>
              <span className="badge badge-warning">Pending</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Payment</span>
              <span className="badge badge-success">Paid (Mock)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/dashboard/bookings" className="btn-primary w-full justify-center py-3 rounded-xl">
              <Calendar size={16} /> Track Your Booking
            </Link>
            <Link href="/dashboard/reports" className="btn-secondary w-full justify-center py-3 rounded-xl">
              <FileText size={16} /> View Reports
            </Link>
            <a
              href={`https://wa.me/?text=I%20booked%20a%20health%20test%20on%20AccurateLabs!%20Booking%20ID:%20${bookingId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] font-semibold hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle size={16} /> Share on WhatsApp
            </a>
          </div>

          <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-primary mt-6 transition-colors">
            Back to Home <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </ClientLayout>
  );
}
