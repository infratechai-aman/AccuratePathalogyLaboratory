'use client';

import React, { useState } from 'react';
import { sampleBookings } from '@/lib/sample-data';
import { BOOKING_STATUSES } from '@/lib/types';
import { Calendar, Clock, MapPin, User, ChevronDown, ChevronUp, Package } from 'lucide-react';

export default function MyBookingsPage() {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const bookings = sampleBookings;

  const getStatusStyle = (status: string) => {
    const s = BOOKING_STATUSES.find(b => b.key === status);
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'collected': return 'badge-info';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const getStepIndex = (status: string) => {
    return BOOKING_STATUSES.findIndex(s => s.key === status);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/50 p-12 text-center">
          <Package size={48} className="mx-auto text-text-muted/30 mb-4" />
          <h2 className="text-lg font-bold text-primary mb-2">No bookings yet</h2>
          <p className="text-text-muted text-sm">Book a test to see your bookings here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl border border-border/50 overflow-hidden card-hover">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-text-muted">#{booking.id}</span>
                      <span className={`badge ${getStatusStyle(booking.status)}`}>
                        {BOOKING_STATUSES.find(s => s.key === booking.status)?.label}
                      </span>
                    </div>
                    {booking.items.map((item, i) => (
                      <h3 key={i} className="text-base font-bold text-brand-red">{item.testName}</h3>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{booking.totalAmount}</p>
                    <p className={`text-xs font-medium ${booking.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                      {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-text-muted mb-3">
                  <span className="flex items-center gap-1"><User size={12} /> {booking.patientName}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {booking.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {booking.timeSlot}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {booking.city}</span>
                </div>

                {/* Status tracker */}
                <div className="flex items-center gap-1 mb-2">
                  {BOOKING_STATUSES.map((status, i) => (
                    <React.Fragment key={status.key}>
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        getStepIndex(booking.status) >= i
                          ? 'text-white'
                          : 'bg-surface text-text-muted'
                      }`} style={getStepIndex(booking.status) >= i ? { backgroundColor: status.color } : {}}>
                        {getStepIndex(booking.status) > i ? '✓' : i + 1}
                      </div>
                      {i < BOOKING_STATUSES.length - 1 && (
                        <div className={`flex-1 h-1 rounded-full ${
                          getStepIndex(booking.status) > i ? 'bg-success' : 'bg-surface'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-text-muted">
                  {BOOKING_STATUSES.map(s => <span key={s.key}>{s.label}</span>)}
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                  className="mt-3 text-xs font-semibold text-accent flex items-center gap-1 hover:text-accent-light transition-colors"
                >
                  {expandedBooking === booking.id ? 'Hide Details' : 'View Details'}
                  {expandedBooking === booking.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>

              {/* Expanded details */}
              {expandedBooking === booking.id && (
                <div className="px-5 pb-5 border-t border-border/30 pt-4 animate-fade-in-up">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-muted mb-1">Phone</p>
                      <p className="font-medium">{booking.phone}</p>
                    </div>
                    <div>
                      <p className="text-text-muted mb-1">Address</p>
                      <p className="font-medium">{booking.address}</p>
                    </div>
                    {booking.phlebotomistName && (
                      <div>
                        <p className="text-text-muted mb-1">Phlebotomist</p>
                        <p className="font-medium">{booking.phlebotomistName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-text-muted mb-1">Payment ID</p>
                      <p className="font-mono text-xs">{booking.paymentId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
