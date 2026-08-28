import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Passenger } from '../../types';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const PassengerDetailsForm: React.FC = () => {
  const {
    passengers,
    setPassengers,
    selectedFlight,
    selectedCabinClass,
    selectedSeatNumbers,
    currentUser,
    setBookingStep,
    calculateFareBreakdown,
  } = useApp();

  const [validationError, setValidationError] = useState<string>('');

  if (!selectedFlight) return null;

  const fare = calculateFareBreakdown();

  const handleInputChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPassengers(updated);
  };

  const handleFillFromProfile = (index: number) => {
    if (!currentUser) return;
    const parts = currentUser.name.split(' ');
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      firstName: parts[0] || 'Alex',
      lastName: parts.slice(1).join(' ') || 'Mercer',
      email: currentUser.email,
      phone: currentUser.phone,
      dateOfBirth: currentUser.dateOfBirth,
      nationality: currentUser.nationality || 'American',
      passportNumber: currentUser.passportNumber || 'US89412093',
      passportExpiry: currentUser.passportExpiry || '2030-11-20',
      gender: 'male',
    };
    setPassengers(updated);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Check all required fields
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.passportNumber || !p.email || !p.phone) {
        setValidationError(`Please complete all required fields for Passenger ${i + 1}`);
        return;
      }
    }

    setBookingStep(5); // Advance to Review & Payment
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Col: Passenger Information Forms */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Passenger Information</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Please enter traveler information exactly as it appears on official travel documents.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-900 border border-blue-100">
              {passengers.length} Traveler(s)
            </span>
          </div>

          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {validationError}
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            {passengers.map((pax, index) => (
              <div
                key={pax.id || index}
                className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Passenger {index + 1}{' '}
                      <span className="text-slate-400 font-normal text-xs">
                        (Seat: {selectedSeatNumbers[index] || 'Auto-Assigned'})
                      </span>
                    </h3>
                  </div>

                  {currentUser && index === 0 && (
                    <button
                      type="button"
                      onClick={() => handleFillFromProfile(index)}
                      className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Autofill Profile</span>
                    </button>
                  )}
                </div>

                {/* Name & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Title</label>
                    <select
                      value={pax.title || 'Mr'}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={pax.firstName}
                      onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mercer"
                      value={pax.lastName}
                      onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                {/* DOB & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={pax.dateOfBirth}
                      onChange={(e) => handleInputChange(index, 'dateOfBirth', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Gender *</label>
                    <select
                      value={pax.gender || 'male'}
                      onChange={(e) => handleInputChange(index, 'gender', e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Nationality & Passport Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. American"
                      value={pax.nationality}
                      onChange={(e) => handleInputChange(index, 'nationality', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. US89412093"
                      value={pax.passportNumber}
                      onChange={(e) => handleInputChange(index, 'passportNumber', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Passport Expiry *
                    </label>
                    <input
                      type="date"
                      required
                      value={pax.passportExpiry}
                      onChange={(e) => handleInputChange(index, 'passportExpiry', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Email Address (for e-ticket) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex.mercer@example.com"
                      value={pax.email}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Phone Number (for flight SMS alerts) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 234-8901"
                      value={pax.phone}
                      onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setBookingStep(3)}
                className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Seat Map</span>
              </button>

              <button
                type="submit"
                id="passenger-form-continue-btn"
                className="px-6 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-900/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Review & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Col: Live Booking Summary Sidebar */}
      <div className="lg:col-span-4 space-y-5">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5 sticky top-20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
            Trip Summary
          </h3>

          <div className="space-y-4 text-xs">
            {/* Flight info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>{selectedFlight.flightNumber}</span>
                <span className="capitalize text-blue-900">{selectedCabinClass} Class</span>
              </div>
              <p className="text-slate-600 font-semibold mt-1">
                {selectedFlight.origin.city} ({selectedFlight.origin.code}) → {selectedFlight.destination.city} ({selectedFlight.destination.code})
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5 font-medium">
                {new Date(selectedFlight.departureTime).toLocaleDateString()} • {selectedFlight.durationFormatted}
              </p>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 pt-1 text-slate-600">
              <div className="flex justify-between">
                <span>Base Fare ({passengers.length} Traveler{passengers.length > 1 ? 's' : ''})</span>
                <span className="font-bold text-slate-900">${fare.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Security Fees</span>
                <span className="font-bold text-slate-900">${fare.taxes + fare.airportFees}</span>
              </div>
              {fare.seatSelectionFees > 0 && (
                <div className="flex justify-between text-blue-900">
                  <span>Seat Upgrades</span>
                  <span className="font-bold">+${fare.seatSelectionFees}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span>${fare.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
