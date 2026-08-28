import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightSearchResults } from './FlightSearchResults';
import { SeatSelectionMap } from './SeatSelectionMap';
import { PassengerDetailsForm } from './PassengerDetailsForm';
import { PaymentAndReview } from './PaymentAndReview';
import { BookingConfirmation } from './BookingConfirmation';
import { Plane, Check, ArrowLeft } from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const { bookingStep, setBookingStep, resetBookingFlow, selectedFlight } = useApp();

  const steps = [
    { num: 1, label: 'Search & Flight' },
    { num: 3, label: 'Seat Selection' },
    { num: 4, label: 'Passenger Details' },
    { num: 5, label: 'Review & Payment' },
    { num: 6, label: 'Confirmation' },
  ];

  return (
    <div id="booking-wizard-container" className="space-y-6 animate-in fade-in">
      {/* 6-Step Visual Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, idx) => {
            const isCompleted = bookingStep > step.num;
            const isCurrent =
              bookingStep === step.num || (step.num === 1 && bookingStep <= 2);

            return (
              <React.Fragment key={step.num}>
                {/* Step Node */}
                <div className="flex flex-col items-center text-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-100 font-extrabold shadow-sm'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] font-semibold hidden sm:block ${
                      isCurrent
                        ? 'text-sky-600 font-bold'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      bookingStep > steps[idx + 1].num || isCompleted
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Components */}
      {bookingStep <= 2 && <FlightSearchResults />}
      {bookingStep === 3 && <SeatSelectionMap />}
      {bookingStep === 4 && <PassengerDetailsForm />}
      {bookingStep === 5 && <PaymentAndReview />}
      {bookingStep === 6 && <BookingConfirmation />}
    </div>
  );
};
