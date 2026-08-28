import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Flight, CabinClass } from '../../types';
import {
  Plane,
  Clock,
  Filter,
  SlidersHorizontal,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';

export const FlightSearchResults: React.FC = () => {
  const {
    flights,
    airports,
    searchParams,
    setSearchParams,
    startBookingForFlight,
    selectedCabinClass,
    setSelectedCabinClass,
  } = useApp();

  // Filter States
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [selectedStops, setSelectedStops] = useState<string>('all'); // 'all', 'direct', 'stops'
  const [timeOfDay, setTimeOfDay] = useState<string>('all'); // 'all', 'morning', 'afternoon', 'evening'
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterAirline, setFilterAirline] = useState<string>('all');

  // Filter Flights
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      // Origin match
      if (searchParams.originCode && flight.origin.code !== searchParams.originCode) {
        return false;
      }
      // Destination match
      if (
        searchParams.destinationCode &&
        flight.destination.code !== searchParams.destinationCode
      ) {
        return false;
      }
      // Price filter based on current cabin class
      const price = flight.basePrices[selectedCabinClass] || flight.basePrices.economy;
      if (price > maxPrice) {
        return false;
      }
      // Stops filter
      if (selectedStops === 'direct' && flight.stops > 0) return false;
      if (selectedStops === 'stops' && flight.stops === 0) return false;

      // Time of day filter
      const depHour = new Date(flight.departureTime).getHours();
      if (timeOfDay === 'morning' && (depHour < 6 || depHour >= 12)) return false;
      if (timeOfDay === 'afternoon' && (depHour < 12 || depHour >= 18)) return false;
      if (timeOfDay === 'evening' && (depHour < 18 || depHour >= 24)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price') {
        const pA = a.basePrices[selectedCabinClass] || a.basePrices.economy;
        const pB = b.basePrices[selectedCabinClass] || b.basePrices.economy;
        return pA - pB;
      }
      if (sortBy === 'duration') {
        return a.durationMinutes - b.durationMinutes;
      }
      if (sortBy === 'departure') {
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      }
      return 0;
    });
  }, [flights, searchParams, selectedCabinClass, maxPrice, selectedStops, timeOfDay, sortBy]);

  const originAirport = airports.find((a) => a.code === searchParams.originCode);
  const destAirport = airports.find((a) => a.code === searchParams.destinationCode);

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-900/15">
              <Plane className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-slate-900">
                <span>{originAirport?.city || searchParams.originCode}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {searchParams.originCode}
                </span>
                <ArrowRight className="w-4 h-4 text-blue-900" />
                <span>{destAirport?.city || searchParams.destinationCode}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {searchParams.destinationCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {searchParams.tripType === 'one-way' ? 'One-way' : 'Round-trip'} •{' '}
                {new Date(searchParams.departureDate).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                • {searchParams.passengersCount} Passenger(s) •{' '}
                <span className="capitalize font-bold text-blue-900">{selectedCabinClass} Class</span>
              </p>
            </div>
          </div>

          {/* Cabin Class Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            {(['economy', 'business', 'first'] as CabinClass[]).map((cabin) => (
              <button
                key={cabin}
                id={`filter-cabin-${cabin}-btn`}
                onClick={() => setSelectedCabinClass(cabin)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedCabinClass === cabin
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cabin}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Layout with Left Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Filters</span>
              </h3>
              <button
                onClick={() => {
                  setMaxPrice(3500);
                  setSelectedStops('all');
                  setTimeOfDay('all');
                }}
                className="text-[11px] font-bold text-blue-900 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Max Price</span>
                <span className="font-extrabold text-blue-900">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={200}
                max={4000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                <span>$200</span>
                <span>$4,000</span>
              </div>
            </div>

            {/* Stops */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Stops</label>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Flights' },
                  { id: 'direct', label: 'Non-stop Direct Only' },
                  { id: 'stops', label: '1+ Stops' },
                ].map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="stops-filter"
                      checked={selectedStops === s.id}
                      onChange={() => setSelectedStops(s.id)}
                      className="accent-blue-900 w-3.5 h-3.5"
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time of Day */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Departure Window</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'Anytime' },
                  { id: 'morning', label: 'Morning (6A-12P)' },
                  { id: 'afternoon', label: 'Afternoon (12P-6P)' },
                  { id: 'evening', label: 'Evening (6P-12A)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeOfDay(t.id)}
                    className={`p-2.5 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                      timeOfDay === t.id
                        ? 'bg-blue-50 border-blue-900 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Sort Results</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="price">Lowest Fare First</option>
                <option value="duration">Shortest Flight Duration</option>
                <option value="departure">Earliest Departure Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Flight Cards List */}
        <div className="lg:col-span-9 space-y-4">
          {/* Results summary header */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>
              Showing <strong className="text-slate-900">{filteredFlights.length}</strong> available flights
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Inventory</span>
            </span>
          </div>

          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => {
              const currentPrice =
                flight.basePrices[selectedCabinClass] || flight.basePrices.economy;
              const seatsAvailable =
                flight.availableSeats[selectedCabinClass] || flight.availableSeats.total;

              return (
                <div
                  key={flight.id}
                  id={`flight-card-${flight.id}`}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 space-y-4 group"
                >
                  {/* Top Bar: Airline & Aircraft */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        SK
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{flight.airline}</h4>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800">
                            {flight.flightNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">{flight.aircraftModel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${
                          seatsAvailable < 10
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {seatsAvailable} seats left
                      </span>
                    </div>
                  </div>

                  {/* Flight Schedule details */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Time and Route */}
                    <div className="sm:col-span-8 grid grid-cols-3 items-center text-center">
                      <div className="text-left">
                        <p className="text-2xl font-black text-slate-900">
                          {new Date(flight.departureTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs font-bold text-slate-700">{flight.origin.code}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{flight.origin.city}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500">
                          {flight.durationFormatted}
                        </span>
                        <div className="w-full border-t-2 border-dashed border-slate-200 my-2 relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-1">
                            <Plane className="w-4 h-4 text-blue-900 -rotate-45" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          {flight.stops === 0 ? 'Non-stop Direct' : `${flight.stops} Stop`}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">
                          {new Date(flight.arrivalTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs font-bold text-slate-700">{flight.destination.code}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{flight.destination.city}</p>
                      </div>
                    </div>

                    {/* Cabin Price Card & Select Button */}
                    <div className="sm:col-span-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {selectedCabinClass} Fare
                        </p>
                        <p className="text-3xl font-black text-slate-900 leading-tight mt-0.5">
                          ${currentPrice}
                        </p>
                        <p className="text-[10px] text-slate-400">Taxes & fees included</p>
                      </div>

                      <button
                        id={`select-flight-btn-${flight.id}`}
                        onClick={() => startBookingForFlight(flight, selectedCabinClass)}
                        className="mt-3 py-3 px-5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-900/10 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Select Seat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Multi-Cabin Pricing Strip */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div
                      onClick={() => setSelectedCabinClass('economy')}
                      className={`p-2.5 rounded-2xl cursor-pointer border transition-all ${
                        selectedCabinClass === 'economy'
                          ? 'bg-blue-50 border-blue-900 text-blue-900 font-bold'
                          : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Economy</p>
                      <p className="font-extrabold text-slate-900 mt-0.5">${flight.basePrices.economy}</p>
                    </div>
                    <div
                      onClick={() => setSelectedCabinClass('business')}
                      className={`p-2.5 rounded-2xl cursor-pointer border transition-all ${
                        selectedCabinClass === 'business'
                          ? 'bg-blue-50 border-blue-900 text-blue-900 font-bold'
                          : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Business</p>
                      <p className="font-extrabold text-slate-900 mt-0.5">${flight.basePrices.business}</p>
                    </div>
                    <div
                      onClick={() => setSelectedCabinClass('first')}
                      className={`p-2.5 rounded-2xl cursor-pointer border transition-all ${
                        selectedCabinClass === 'first'
                          ? 'bg-blue-50 border-blue-900 text-blue-900 font-bold'
                          : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">First Class</p>
                      <p className="font-extrabold text-slate-900 mt-0.5">${flight.basePrices.first}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No flights matched your filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn't find flights matching your selected filters. Try broadening your criteria.
              </p>
              <button
                onClick={() => {
                  setMaxPrice(3500);
                  setSelectedStops('all');
                  setTimeOfDay('all');
                  setSearchParams((prev) => ({
                    ...prev,
                    originCode: 'KHI',
                    destinationCode: 'DXB',
                  }));
                }}
                className="px-5 py-2.5 rounded-2xl bg-blue-900 text-white font-bold text-xs"
              >
                Reset to Popular Route (KHI → DXB)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
