'use client';

import React, { useState, useEffect } from 'react';
import { BOOKING_STATUSES, Booking } from '@/lib/types';
import { Calendar, Clock, MapPin, User, ChevronDown, ChevronUp, Package, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getBookingsByUser } from '@/lib/services/db';
import { useRouter } from 'next/navigation';

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/?login=true'); // Or redirect however you prefer
      return;
    }

    if (user) {
      const fetchBookings = async () => {
        try {
          const userBookings = await getBookingsByUser(user.uid);
          setBookings(userBookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [user, authLoading, router]);

  const getStatusStyle = (status: string) => {
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

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 size={32} className="animate-spin text-red-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-gray-500 text-sm">Book a test to see your bookings here</p>
          <button onClick={() => router.push('/search')} className="mt-6 bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-red-700">
            Book a Test
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">#{booking.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusStyle(booking.status)}`}>
                        {BOOKING_STATUSES.find(s => s.key === booking.status)?.label}
                      </span>
                    </div>
                    {booking.items?.map((item, i) => (
                      <h3 key={i} className="text-base font-bold text-gray-900">{item.testName}</h3>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{booking.totalAmount}</p>
                    <p className={`text-xs font-bold ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                      {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1.5"><User size={14} className="text-gray-400" /> {booking.patientName}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {booking.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {booking.timeSlot}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {booking.city}</span>
                </div>

                {/* Status tracker */}
                <div className="px-2">
                  <div className="flex items-center justify-between relative mb-2">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full z-0 transition-all" style={{ width: `${(getStepIndex(booking.status) / 3) * 100}%` }}></div>
                    
                    {BOOKING_STATUSES.map((status, i) => {
                      const isCompleted = getStepIndex(booking.status) >= i;
                      return (
                         <div key={status.key} className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isCompleted ? 'bg-green-500 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                           {getStepIndex(booking.status) > i ? '✓' : i + 1}
                         </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-1">
                    {BOOKING_STATUSES.map(s => <span key={s.key} className={getStepIndex(booking.status) >= getStepIndex(s.key) ? 'text-gray-900' : ''}>{s.label}</span>)}
                  </div>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                  className="mt-6 text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors w-full justify-center bg-blue-50 py-2 rounded-lg"
                >
                  {expandedBooking === booking.id ? 'Hide Details' : 'View Full Details'}
                  {expandedBooking === booking.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded details */}
              {expandedBooking === booking.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50/50">
                  <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">Booking Information</h4>
                  <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1 text-xs font-semibold">Registered Phone</p>
                      <p className="font-bold text-gray-900">{booking.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 text-xs font-semibold">Collection Address</p>
                      <p className="font-bold text-gray-900">{booking.address}</p>
                    </div>
                    {booking.phlebotomistName && (
                      <div>
                        <p className="text-gray-500 mb-1 text-xs font-semibold">Assigned Phlebotomist</p>
                        <p className="font-bold text-gray-900">{booking.phlebotomistName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 mb-1 text-xs font-semibold">Transaction ID / Reference</p>
                      <p className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded w-max">{booking.paymentId || 'Pay on Collection'}</p>
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
