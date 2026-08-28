import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  Plane,
  AlertCircle,
  Download,
  XCircle,
  CheckCircle2,
  Search,
  Compass,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const {
    bookings,
    cancelBooking,
    setTicketModalBooking,
    setTrackedFlight,
    setActiveTab,
    startBookingForFlight,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [searchPnr, setSearchPnr] = useState('');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (searchPnr && !b.pnr.toLowerCase().includes(searchPnr.toLowerCase())) {
      return false;
    }
    if (activeSubTab === 'upcoming') {
      return b.status === 'confirmed';
    }
    if (activeSubTab === 'past') {
      return b.status === 'completed';
    }
    if (activeSubTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  const handleConfirmCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    setCancellingBookingId(null);
  };

  return (
    <div id="my-bookings-view" className="space-y-6 pb-12 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200/60 mb-3">
            <BookmarkCheck className="w-3.5 h-3.5 text-blue-900" />
            <span>Manage Trips</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Bookings & Trips</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            View boarding passes, download e-tickets, track live status, or manage cancellations.
          </p>
        </div>

        {/* PNR Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by PNR (e.g. SK-8924)..."
            value={searchPnr}
            onChange={(e) => setSearchPnr(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/75 rounded-2xl w-fit">
        {[
          { id: 'upcoming', label: 'Upcoming Flights' },
          { id: 'past', label: 'Past Journeys' },
          { id: 'cancelled', label: 'Cancelled Flights' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const flight = booking.flight;
            const isCancellingThis = cancellingBookingId === booking.id;

            return (
              <div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5"
              >
                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-blue-900 text-cyan-400 flex items-center justify-center font-black text-xs shadow-2xs">
                      SK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">
                          {flight.airline} • {flight.flightNumber}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200/60">
                          PNR: {booking.pnr}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{flight.aircraftModel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : booking.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs capitalize font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {booking.cabinClass} Class
                    </span>
                  </div>
                </div>

                {/* Route & Times */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 grid grid-cols-3 items-center text-center">
                    <div className="text-left">
                      <p className="text-2xl font-black text-slate-900">{flight.origin.code}</p>
                      <p className="text-xs font-bold text-slate-700">{flight.origin.city}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {new Date(flight.departureTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Terminal {flight.terminal} • Gate {flight.gate}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-400">
                        {flight.durationFormatted}
                      </span>
                      <div className="w-full flex items-center justify-center my-1.5 relative">
                        <div className="w-full h-0.5 bg-slate-200" />
                        <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center absolute shadow-2xs">
                          <Plane className="w-3.5 h-3.5 -rotate-45" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(flight.departureTime).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900">{flight.destination.code}</p>
                      <p className="text-xs font-bold text-slate-700">{flight.destination.city}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {new Date(flight.arrivalTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Belt: {flight.baggageCarousel || '4'}</p>
                    </div>
                  </div>

                  {/* Passengers & Seat Badges */}
                  <div className="sm:col-span-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-5 space-y-2 text-xs">
                    <p className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Travelers:</p>
                    <div className="space-y-1.5">
                      {booking.passengers.map((pax, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">
                            {pax.firstName} {pax.lastName}
                          </span>
                          <span className="font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                            Seat {booking.selectedSeats[idx]?.seatNumber || pax.seatNumber || '12A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cancel Confirmation Prompt */}
                {isCancellingThis && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Are you sure you want to cancel this booking?</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Cancelling PNR <strong>{booking.pnr}</strong> will release your assigned seats ({booking.selectedSeats.map(s => s.seatNumber).join(', ')}) back to inventory. A refund of <strong>${booking.totalAmount}</strong> will be refunded to your payment method.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleConfirmCancel(booking.id)}
                        className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                      >
                        Confirm Cancellation & Refund
                      </button>
                      <button
                        onClick={() => setCancellingBookingId(null)}
                        className="px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Keep Booking
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    Paid: <strong className="text-slate-900 font-black">${booking.totalAmount}</strong> via {booking.paymentMethod}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View/Print Boarding Pass */}
                    <button
                      onClick={() => setTicketModalBooking(booking)}
                      className="px-4 py-2 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Boarding Pass & E-Ticket</span>
                    </button>

                    {/* Track Flight */}
                    <button
                      onClick={() => {
                        setTrackedFlight(flight);
                        setActiveTab('tracker');
                      }}
                      className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Live Tracker</span>
                    </button>

                    {/* Cancel Booking Button */}
                    {booking.status === 'confirmed' && !isCancellingThis && (
                      <button
                        onClick={() => setCancellingBookingId(booking.id)}
                        className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Flight</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <Plane className="w-7 h-7 -rotate-45" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              No {activeSubTab} bookings found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              You do not have any flights under this category. Search flights now to book your next adventure.
            </p>
            <button
              onClick={() => setActiveTab('search')}
              className="px-6 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Search Flights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
