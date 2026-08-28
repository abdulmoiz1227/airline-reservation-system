import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Seat, CabinClass } from '../../types';
import {
  Plane,
  Clock,
  ShieldAlert,
  Check,
  Info,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Users,
  ChevronRight,
} from 'lucide-react';

export const SeatSelectionMap: React.FC = () => {
  const {
    selectedFlight,
    selectedCabinClass,
    selectedSeatNumbers,
    setSelectedSeatNumbers,
    passengers,
    getFlightSeats,
    holdSeat,
    releaseSeat,
    activeHoldExpiresAt,
    currentUser,
    setBookingStep,
  } = useApp();

  const [activePassengerIndex, setActivePassengerIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('10:00');

  // Countdown timer for seat hold
  useEffect(() => {
    if (!activeHoldExpiresAt) {
      setTimeLeft('10:00');
      return;
    }

    const interval = setInterval(() => {
      const remainingMs = activeHoldExpiresAt - Date.now();
      if (remainingMs <= 0) {
        setTimeLeft('00:00');
        setErrorMessage('Your 10-minute seat hold has expired. Please reselect your seats.');
        setSelectedSeatNumbers([]);
        clearInterval(interval);
      } else {
        const totalSecs = Math.floor(remainingMs / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeHoldExpiresAt, setSelectedSeatNumbers]);

  if (!selectedFlight) return null;

  const seats = getFlightSeats(selectedFlight.id);
  const currentUserId = currentUser ? currentUser.id : 'usr-guest';

  // Group seats by row
  const rowsMap: Record<number, Seat[]> = {};
  seats.forEach((seat) => {
    if (!rowsMap[seat.row]) {
      rowsMap[seat.row] = [];
    }
    rowsMap[seat.row].push(seat);
  });

  const rowNumbers = Object.keys(rowsMap)
    .map(Number)
    .sort((a, b) => a - b);

  const handleSeatClick = (seat: Seat) => {
    setErrorMessage('');

    // Check if seat is occupied or blocked
    if (seat.status === 'occupied' || seat.status === 'blocked') {
      setErrorMessage(`Seat ${seat.seatNumber} is already occupied. Please select an available seat.`);
      return;
    }

    // Check if seat is held by another user
    if (
      seat.status === 'held' &&
      seat.heldByUserId &&
      seat.heldByUserId !== currentUserId &&
      seat.heldUntil &&
      seat.heldUntil > Date.now()
    ) {
      setErrorMessage(
        `Seat ${seat.seatNumber} is currently held by another customer completing checkout. (Double-booking protection active)`
      );
      return;
    }

    // Check if seat is already selected by current user for this passenger or another passenger
    const existingIndexForThisSeat = selectedSeatNumbers.indexOf(seat.seatNumber);

    if (existingIndexForThisSeat === activePassengerIndex) {
      // Deselect
      releaseSeat(selectedFlight.id, seat.seatNumber);
      const updated = [...selectedSeatNumbers];
      updated[activePassengerIndex] = '';
      setSelectedSeatNumbers(updated);
      return;
    }

    if (existingIndexForThisSeat !== -1) {
      setErrorMessage(`Seat ${seat.seatNumber} is already assigned to Passenger ${existingIndexForThisSeat + 1}`);
      return;
    }

    // Try to acquire hold
    const success = holdSeat(selectedFlight.id, seat.seatNumber, currentUserId);
    if (!success) {
      setErrorMessage(`Seat ${seat.seatNumber} could not be reserved. Please select another seat.`);
      return;
    }

    // Assign seat to active passenger
    const updated = [...selectedSeatNumbers];
    // Release previous seat if passenger already had one
    if (updated[activePassengerIndex]) {
      releaseSeat(selectedFlight.id, updated[activePassengerIndex]);
    }
    updated[activePassengerIndex] = seat.seatNumber;
    setSelectedSeatNumbers(updated);

    // If there's another passenger without seat, auto-advance
    if (activePassengerIndex < passengers.length - 1) {
      setActivePassengerIndex(activePassengerIndex + 1);
    }
  };

  const allPassengersHaveSeats =
    passengers.length > 0 &&
    passengers.every((_, idx) => Boolean(selectedSeatNumbers[idx]));

  return (
    <div className="space-y-6">
      {/* Top Banner: Flight Details & 10-Minute Hold Status */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-900/15">
              <Plane className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {selectedFlight.airline} • {selectedFlight.flightNumber}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {selectedFlight.aircraftModel}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {selectedFlight.origin.city} ({selectedFlight.origin.code}) →{' '}
                {selectedFlight.destination.city} ({selectedFlight.destination.code}) • Non-stop
              </p>
            </div>
          </div>

          {/* 10-Minute Seat Hold Countdown Widget */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <Clock className={`w-4 h-4 ${activeHoldExpiresAt ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Seat Hold Timer
              </p>
              <p className="text-xs font-mono font-extrabold text-slate-900">{timeLeft} remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error / Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Seat Selection Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Seat Map Visualizer */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          {/* Passenger Selector Tabs */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              Select Seat for Passenger:
            </label>
            <div className="flex flex-wrap gap-2">
              {passengers.map((pax, idx) => {
                const assignedSeat = selectedSeatNumbers[idx];
                const isActive = activePassengerIndex === idx;
                return (
                  <button
                    key={pax.id || idx}
                    id={`pax-tab-btn-${idx}`}
                    onClick={() => setActivePassengerIndex(idx)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                      isActive
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Users className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>
                      Passenger {idx + 1} ({pax.firstName || `Pax ${idx + 1}`})
                    </span>
                    {assignedSeat ? (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-white text-blue-900' : 'bg-blue-100 text-blue-900'}`}>
                        {assignedSeat}
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold">(No Seat)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seat Map Legend */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-white border border-slate-300 shadow-2xs" />
              <span className="text-slate-700 font-semibold">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-blue-900 border border-blue-950 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="text-slate-700 font-semibold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-slate-200 border border-slate-300 opacity-60" />
              <span className="text-slate-400 font-medium">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-cyan-100 border border-cyan-300 text-cyan-900 flex items-center justify-center text-[10px] font-bold">
                ★
              </div>
              <span className="text-slate-700 font-semibold">Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-800 flex items-center justify-center text-[9px] font-bold">
                EXIT
              </div>
              <span className="text-slate-700 font-semibold">Exit Row</span>
            </div>
          </div>

          {/* Fuselage / Aircraft Layout View */}
          <div className="max-w-md mx-auto bg-slate-100/80 rounded-3xl border-2 border-slate-300 p-6 pt-8 pb-10 relative shadow-inner">
            {/* Cockpit Front Nose cone */}
            <div className="w-28 h-12 bg-slate-800 text-sky-400 text-[10px] font-bold uppercase tracking-wider rounded-t-full mx-auto flex items-center justify-center shadow-md mb-6">
              FRONT / COCKPIT
            </div>

            {/* Column Headers: A B C   D E F */}
            <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-xs text-slate-500 mb-3 px-2">
              <span>A</span>
              <span>B</span>
              <span>C</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">AISLE</span>
              <span>D</span>
              <span>E</span>
              <span>F</span>
            </div>

            {/* Rows Container */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto px-1 pr-2">
              {rowNumbers.map((rowNum) => {
                const rowSeats = rowsMap[rowNum];
                const isFirstClass = rowNum <= 2;
                const isBusinessClass = rowNum > 2 && rowNum <= 8;
                const isExitRow = rowSeats.some((s) => s.isEmergencyExit);

                return (
                  <div key={rowNum} className="space-y-1">
                    {/* Cabin Class Divider indicator */}
                    {rowNum === 1 && (
                      <div className="py-1 text-center text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 rounded border border-amber-200 my-1">
                        First Class (Lie-flat suites)
                      </div>
                    )}
                    {rowNum === 3 && (
                      <div className="py-1 text-center text-[10px] font-bold text-sky-800 uppercase tracking-widest bg-sky-50 rounded border border-sky-200 my-2">
                        Business Class
                      </div>
                    )}
                    {rowNum === 9 && (
                      <div className="py-1 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-200 rounded my-2">
                        Main Economy Cabin
                      </div>
                    )}

                    {/* Exit Row Marker */}
                    {isExitRow && (
                      <div className="py-0.5 text-center text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded border border-emerald-300">
                        ⚡ EMERGENCY EXIT ROW — EXTRA LEGROOM (+35)
                      </div>
                    )}

                    {/* The 6 Seats + Aisle */}
                    <div className="grid grid-cols-7 gap-1.5 items-center">
                      {/* Left side: A, B, C */}
                      {['A', 'B', 'C'].map((col) => {
                        const seat = rowSeats.find((s) => s.col === col);
                        if (!seat) {
                          return <div key={col} className="w-8 h-8 opacity-0" />;
                        }

                        const isSelected = selectedSeatNumbers.includes(seat.seatNumber);
                        const isCurrentPaxSelected =
                          selectedSeatNumbers[activePassengerIndex] === seat.seatNumber;
                        const isOccupied =
                          seat.status === 'occupied' ||
                          seat.status === 'blocked' ||
                          (seat.status === 'held' &&
                            seat.heldByUserId !== currentUserId &&
                            seat.heldUntil &&
                            seat.heldUntil > Date.now());

                        let btnClass = 'bg-white border-slate-300 text-slate-700 hover:border-sky-500';
                        if (isOccupied) {
                          btnClass = 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-50';
                        } else if (isSelected) {
                          btnClass = isCurrentPaxSelected
                            ? 'bg-sky-600 border-sky-700 text-white shadow-md ring-2 ring-sky-300'
                            : 'bg-indigo-600 border-indigo-700 text-white';
                        } else if (seat.seatType === 'vip') {
                          btnClass = 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200';
                        } else if (seat.seatType === 'emergency_exit') {
                          btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 hover:bg-emerald-100';
                        } else if (seat.seatType === 'extra_legroom') {
                          btnClass = 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100';
                        }

                        return (
                          <button
                            key={seat.id}
                            id={`seat-btn-${seat.seatNumber}`}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seat)}
                            title={`Seat ${seat.seatNumber} (${seat.cabinClass} - ${seat.seatType})`}
                            className={`w-8 h-8 rounded-md text-[11px] font-bold border transition-all flex items-center justify-center relative shadow-2xs ${btnClass}`}
                          >
                            {isSelected ? '✓' : seat.col}
                          </button>
                        );
                      })}

                      {/* Center Aisle with Row Number */}
                      <div className="text-center font-mono text-[11px] text-slate-400 font-bold select-none">
                        {rowNum}
                      </div>

                      {/* Right side: D, E, F */}
                      {['D', 'E', 'F'].map((col) => {
                        const seat = rowSeats.find((s) => s.col === col);
                        if (!seat) {
                          return <div key={col} className="w-8 h-8 opacity-0" />;
                        }

                        const isSelected = selectedSeatNumbers.includes(seat.seatNumber);
                        const isCurrentPaxSelected =
                          selectedSeatNumbers[activePassengerIndex] === seat.seatNumber;
                        const isOccupied =
                          seat.status === 'occupied' ||
                          seat.status === 'blocked' ||
                          (seat.status === 'held' &&
                            seat.heldByUserId !== currentUserId &&
                            seat.heldUntil &&
                            seat.heldUntil > Date.now());

                        let btnClass = 'bg-white border-slate-300 text-slate-700 hover:border-sky-500';
                        if (isOccupied) {
                          btnClass = 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-50';
                        } else if (isSelected) {
                          btnClass = isCurrentPaxSelected
                            ? 'bg-sky-600 border-sky-700 text-white shadow-md ring-2 ring-sky-300'
                            : 'bg-indigo-600 border-indigo-700 text-white';
                        } else if (seat.seatType === 'vip') {
                          btnClass = 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200';
                        } else if (seat.seatType === 'emergency_exit') {
                          btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 hover:bg-emerald-100';
                        } else if (seat.seatType === 'extra_legroom') {
                          btnClass = 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100';
                        }

                        return (
                          <button
                            key={seat.id}
                            id={`seat-btn-${seat.seatNumber}`}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seat)}
                            title={`Seat ${seat.seatNumber} (${seat.cabinClass} - ${seat.seatType})`}
                            className={`w-8 h-8 rounded-md text-[11px] font-bold border transition-all flex items-center justify-center relative shadow-2xs ${btnClass}`}
                          >
                            {isSelected ? '✓' : seat.col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rear Galley */}
            <div className="w-32 h-6 bg-slate-700 text-slate-300 text-[9px] font-bold uppercase tracking-wider rounded-b-xl mx-auto flex items-center justify-center mt-6">
              REAR GALLEY & LAVATORY
            </div>
          </div>
        </div>

        {/* Right Column: Seat Selection Summary & Continue */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
              Seat Assignments
            </h3>

            <div className="space-y-3">
              {passengers.map((pax, idx) => {
                const assignedSeatNum = selectedSeatNumbers[idx];
                const seatObj = seats.find((s) => s.seatNumber === assignedSeatNum);

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Passenger {idx + 1}: {pax.firstName || `Traveler ${idx + 1}`}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {seatObj
                          ? `${seatObj.seatType.replace('_', ' ').toUpperCase()} • Row ${seatObj.row}`
                          : 'Seat required'}
                      </p>
                    </div>

                    <div className="text-right">
                      {assignedSeatNum ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-extrabold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                            {assignedSeatNum}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {seatObj?.priceModifier ? `+$${seatObj.priceModifier}` : 'Free'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-bold">Unassigned</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Double Booking Assurance */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-blue-950 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <ShieldAlert className="w-4 h-4 text-blue-900" />
                <span>Anti-Double Booking Active</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your selected seats are temporarily reserved for 10 minutes while you complete checkout.
              </p>
            </div>

            {/* Continue to Passenger Information */}
            <button
              id="seat-map-continue-btn"
              disabled={!allPassengersHaveSeats}
              onClick={() => setBookingStep(4)}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-blue-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
