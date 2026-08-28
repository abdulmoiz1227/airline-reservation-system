import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  X,
  Printer,
  Plane,
  QrCode,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const BoardingPassModal: React.FC = () => {
  const { ticketModalBooking, setTicketModalBooking } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!ticketModalBooking) return null;

  const booking = ticketModalBooking;
  const flight = booking.flight;
  const primaryPax = booking.passengers[0] || {
    firstName: 'Alex',
    lastName: 'Mercer',
    passportNumber: 'US89412093',
  };
  const seatNum = booking.selectedSeats[0]?.seatNumber || primaryPax.seatNumber || '12A';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="boarding-pass-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Top Header Bar */}
        <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-cyan-400 flex items-center justify-center font-black text-xs shadow-2xs">
              SK
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">Official Electronic Boarding Pass</span>
              <span className="text-[11px] text-slate-400 font-medium">SkyLink Global Airways</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
              title="Print or Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTicketModalBooking(null)}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Content */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6">
          {/* Airline & Status Bar */}
          <div className="flex items-center justify-between pb-5 border-b-2 border-dashed border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  SKYLINK AIRLINES
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-black bg-blue-50 text-blue-900 border border-blue-200/60">
                  {flight.flightNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Electronic Passenger Ticket & Baggage Check
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Confirmed • Group 2
              </span>
            </div>
          </div>

          {/* Passenger & Flight Schedule Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Passenger Name</p>
              <p className="font-extrabold text-slate-900 text-sm truncate mt-0.5">
                {primaryPax.firstName} {primaryPax.lastName}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">PNR Reference</p>
              <p className="font-mono font-black text-blue-900 text-sm mt-0.5">{booking.pnr}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Seat Number</p>
              <p className="font-black text-slate-900 text-base mt-0.5">{seatNum}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Cabin Class</p>
              <p className="font-extrabold text-slate-900 uppercase text-xs mt-0.5">{booking.cabinClass}</p>
            </div>
          </div>

          {/* Airport Route Section */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white grid grid-cols-3 items-center text-center shadow-inner">
            <div className="text-left">
              <p className="text-3xl font-black text-white">{flight.origin.code}</p>
              <p className="text-xs font-semibold text-slate-300">{flight.origin.city}</p>
              <p className="text-xs font-mono text-cyan-400 mt-1 font-bold">
                Departs:{' '}
                {new Date(flight.departureTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-medium">{flight.durationFormatted}</span>
              <div className="w-full flex items-center justify-center my-1.5 relative">
                <div className="w-full h-0.5 bg-slate-700" />
                <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center absolute">
                  <Plane className="w-3.5 h-3.5 -rotate-45" />
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Direct Flight</span>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black text-white">
                {flight.destination.code}
              </p>
              <p className="text-xs font-semibold text-slate-300">{flight.destination.city}</p>
              <p className="text-xs font-mono text-cyan-400 mt-1 font-bold">
                Arrives:{' '}
                {new Date(flight.arrivalTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Gate, Terminal, Boarding Time */}
          <div className="grid grid-cols-3 gap-3 text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Terminal</p>
              <p className="text-base font-black text-slate-900">{flight.terminal}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Gate</p>
              <p className="text-base font-black text-blue-900">{flight.gate}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Gate Closes</p>
              <p className="text-base font-black text-rose-600">20 Mins Prior</p>
            </div>
          </div>

          {/* Simulated Barcode & QR code footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-slate-200">
            <div className="space-y-1">
              <div className="h-10 w-48 sm:w-64 bg-slate-900 rounded-xl flex items-center justify-center p-1.5">
                {/* Visual barcode pattern */}
                <div className="flex items-center gap-0.5 w-full h-full justify-between">
                  {Array.from({ length: 38 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white h-full rounded-xs"
                      style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px' }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[9px] font-mono text-slate-400 font-medium">
                {booking.pnr} // {flight.flightNumber} // {primaryPax.passportNumber}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="text-[11px] text-slate-500">
                <p className="font-bold text-slate-800">Scan at Security</p>
                <p className="font-medium">Gate Reader Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>TSA PreCheck & FastTrack Eligible</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
