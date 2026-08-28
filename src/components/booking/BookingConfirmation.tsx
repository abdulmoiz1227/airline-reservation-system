import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Plane,
  Award,
  Download,
  Calendar,
  Compass,
  BookmarkCheck,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const BookingConfirmation: React.FC = () => {
  const {
    latestConfirmedBooking,
    setActiveTab,
    setTicketModalBooking,
    setTrackedFlight,
    resetBookingFlow,
  } = useApp();

  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#06b6d4', '#f59e0b', '#10b981'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!latestConfirmedBooking) return null;

  const booking = latestConfirmedBooking;
  const flight = booking.flight;

  const handleCopyPnr = () => {
    navigator.clipboard.writeText(booking.pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCalendar = () => {
    // Generate clean .ics calendar file for flight
    const startTime = new Date(flight.departureTime)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(flight.arrivalTime)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SkyLink Airlines//Flight Reservation//EN',
      'BEGIN:VEVENT',
      `UID:${booking.pnr}@skylinkair.com`,
      `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, '')}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:SkyLink Flight ${flight.flightNumber} (${flight.origin.code} -> ${flight.destination.code})`,
      `DESCRIPTION:Booking Reference (PNR): ${booking.pnr}\\nSeats: ${booking.selectedSeats.map(s => s.seatNumber).join(', ')}\\nTerminal: ${flight.terminal}, Gate: ${flight.gate}`,
      `LOCATION:${flight.origin.name} (${flight.origin.code})`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Flight-${flight.flightNumber}-${booking.pnr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="booking-confirmation-view" className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in">
      {/* Confirmation Header Banner */}
      <div className="text-center space-y-4 bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <span>Payment Authorized & Confirmed</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
          Your flight has been successfully booked. An e-ticket receipt and boarding pass have been generated for your journey.
        </p>

        {/* PNR Box */}
        <div className="inline-flex items-center gap-4 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-md mt-2">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Booking Reference / PNR
            </p>
            <p className="text-xl font-mono font-black text-cyan-400 tracking-wider">
              {booking.pnr}
            </p>
          </div>
          <button
            onClick={handleCopyPnr}
            title="Copy PNR Reference"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Loyalty Points Earned Celebratory Banner */}
      {booking.loyaltyPointsEarned > 0 && (
        <div className="bg-white rounded-3xl border border-amber-200/70 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                SkyMiles Loyalty Reward Credited
              </p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                +{booking.loyaltyPointsEarned.toLocaleString()} Loyalty Points Added to Your Balance!
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('rewards')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            View Rewards
          </button>
        </div>
      )}

      {/* Flight & Passenger Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-cyan-400 flex items-center justify-center font-black text-xs shadow-2xs">
              SK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">{flight.airline}</h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                  {flight.flightNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{flight.aircraftModel}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold capitalize bg-blue-50 text-blue-900 px-3 py-1 rounded-full border border-blue-200/60">
              {booking.cabinClass} Class
            </span>
          </div>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-3 items-center text-center py-2">
          <div className="text-left">
            <p className="text-2xl font-black text-slate-900">{flight.origin.code}</p>
            <p className="text-xs font-bold text-slate-700">{flight.origin.city}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {new Date(flight.departureTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">Terminal {flight.terminal} • Gate {flight.gate}</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400">{flight.durationFormatted}</span>
            <div className="w-full flex items-center justify-center my-1.5 relative">
              <div className="w-full h-0.5 bg-slate-200" />
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center absolute shadow-2xs">
                <Plane className="w-3.5 h-3.5 -rotate-45" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">Non-stop</span>
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
            <p className="text-[11px] text-slate-400 font-medium">{flight.baggageCarousel || 'Belt 4'}</p>
          </div>
        </div>

        {/* Passenger & Payment details */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Passenger(s) & Seats
            </p>
            <div className="mt-1.5 space-y-1">
              {booking.passengers.map((pax, i) => (
                <p key={i} className="font-bold text-slate-800">
                  {pax.firstName} {pax.lastName} —{' '}
                  <span className="text-blue-900 font-extrabold">
                    Seat {booking.selectedSeats[i]?.seatNumber || pax.seatNumber || '12A'}
                  </span>
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Payment Summary
            </p>
            <p className="mt-1.5 font-bold text-slate-800">
              Total Paid: <span className="text-slate-950 font-black">${booking.totalAmount}</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Method: {booking.paymentMethod}</p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Download Boarding Pass Ticket */}
          <button
            id="confirmation-download-ticket-btn"
            onClick={() => setTicketModalBooking(booking)}
            className="py-3 px-4 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-900/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Ticket</span>
          </button>

          {/* View Booking */}
          <button
            id="confirmation-view-booking-btn"
            onClick={() => setActiveTab('bookings')}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>View Bookings</span>
          </button>

          {/* Live Flight Tracker */}
          <button
            id="confirmation-track-flight-btn"
            onClick={() => {
              setTrackedFlight(flight);
              setActiveTab('tracker');
            }}
            className="py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-blue-900 border border-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Track Flight</span>
          </button>

          {/* Add to Calendar */}
          <button
            id="confirmation-add-calendar-btn"
            onClick={handleDownloadCalendar}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
