import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Flight } from '../../types';
import {
  Compass,
  Plane,
  Clock,
  Navigation,
  Wind,
  Gauge,
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const FlightTrackerView: React.FC = () => {
  const { flights, trackedFlight, setTrackedFlight } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFlight, setActiveFlight] = useState<Flight>(
    trackedFlight || flights.find((f) => f.status === 'In Air') || flights[0]
  );

  // Simulated live telemetry state
  const [telemetry, setTelemetry] = useState({
    altitude: activeFlight?.telemetry?.altitudeFeet || 36000,
    speed: activeFlight?.telemetry?.groundSpeedKnots || 510,
    heading: activeFlight?.telemetry?.headingDegrees || 95,
    progressPercent: 62,
    etaMinutes: 84,
  });

  // Keep activeFlight updated when trackedFlight changes from context
  useEffect(() => {
    if (trackedFlight) {
      setActiveFlight(trackedFlight);
    }
  }, [trackedFlight]);

  // Live simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const nextProg = prev.progressPercent >= 98 ? 15 : prev.progressPercent + 0.2;
        const nextSpeed = Math.floor(505 + Math.sin(Date.now() / 3000) * 12);
        const nextAlt = Math.floor(36000 + Math.cos(Date.now() / 4000) * 150);
        return {
          ...prev,
          progressPercent: Number(nextProg.toFixed(1)),
          speed: nextSpeed,
          altitude: nextAlt,
          etaMinutes: Math.max(5, Math.floor(120 * (1 - nextProg / 100))),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectFlight = (flight: Flight) => {
    setActiveFlight(flight);
    setTrackedFlight(flight);
  };

  const filteredFlightList = flights.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.origin.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.destination.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="flight-tracker-view" className="space-y-6 pb-12 animate-in fade-in">
      {/* Header Banner in Bento Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200/60 mb-3">
            <Compass className="w-3.5 h-3.5 text-blue-900" />
            <span>Radar & Live Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Live Flight Radar & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time GPS tracking, airspeed, cruising altitude, and automated ETA projections.
          </p>
        </div>

        {/* Quick flight search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search flight number (e.g. SK 301)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      {/* Main Grid: Active Flight Telemetry Visualizer + Flights List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Flight Telemetry & Progress Canvas */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Flight Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Top Identity bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-cyan-400 flex items-center justify-center font-black text-sm shadow-2xs">
                  SK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-slate-900 text-base">
                      {activeFlight.airline} • {activeFlight.flightNumber}
                    </h2>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        activeFlight.status === 'In Air'
                          ? 'bg-blue-50 text-blue-900 border border-blue-200/60'
                          : activeFlight.status === 'Boarding'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ● {activeFlight.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Aircraft: {activeFlight.aircraftModel} • Terminal {activeFlight.terminal}, Gate{' '}
                    {activeFlight.gate}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Arrival</p>
                <p className="text-lg font-black text-slate-900">
                  {new Date(activeFlight.arrivalTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <span className="text-[11px] text-emerald-600 font-bold">
                  On Time (in ~{telemetry.etaMinutes} mins)
                </span>
              </div>
            </div>

            {/* Visual Flight Progress Track (Interactive Waypoint Canvas Simulation) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white space-y-6 relative overflow-hidden shadow-inner">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white">{activeFlight.origin.code}</p>
                  <p className="text-xs text-slate-300 font-medium">{activeFlight.origin.city}</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Departed{' '}
                    {new Date(activeFlight.departureTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {telemetry.progressPercent}% Completed
                  </span>
                  <p className="text-[11px] text-slate-400 font-medium">Total duration: {activeFlight.durationFormatted}</p>
                </div>

                <div className="space-y-1 text-right">
                  <p className="text-3xl font-black text-white">{activeFlight.destination.code}</p>
                  <p className="text-xs text-slate-300 font-medium">{activeFlight.destination.city}</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Scheduled{' '}
                    {new Date(activeFlight.arrivalTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Progress Line & Live Moving Airplane Icon */}
              <div className="relative py-4">
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${telemetry.progressPercent}%` }}
                  />
                </div>

                {/* Animated Airplane Marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700 flex flex-col items-center"
                  style={{ left: `${Math.min(95, Math.max(5, telemetry.progressPercent))}%` }}
                >
                  <div className="w-9 h-9 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg ring-4 ring-cyan-400/30">
                    <Plane className="w-4 h-4 -rotate-45" />
                  </div>
                </div>
              </div>

              {/* Telemetry Instrument Gauge Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold">Altitude</span>
                  </div>
                  <p className="text-base font-mono font-black text-white">
                    {telemetry.altitude.toLocaleString()} ft
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium">FL360 Cruising</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold">Ground Speed</span>
                  </div>
                  <p className="text-base font-mono font-black text-white">
                    {telemetry.speed} kts
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">~{Math.round(telemetry.speed * 1.15)} mph</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold">True Heading</span>
                  </div>
                  <p className="text-base font-mono font-black text-white">{telemetry.heading}° ENE</p>
                  <span className="text-[10px] text-slate-400 font-medium">Direct Great Circle</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold">Time Left</span>
                  </div>
                  <p className="text-base font-mono font-black text-amber-300">
                    {Math.floor(telemetry.etaMinutes / 60)}h {telemetry.etaMinutes % 60}m
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium">Estimated on-time</span>
                </div>
              </div>
            </div>

            {/* Airport Details Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-900" />
                  <span>Departure: {activeFlight.origin.code}</span>
                </p>
                <p className="text-slate-700 font-medium">{activeFlight.origin.name}</p>
                <p className="text-slate-500 text-[11px] font-medium">
                  {activeFlight.origin.city}, {activeFlight.origin.country} • Terminal {activeFlight.terminal}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Destination: {activeFlight.destination.code}</span>
                </p>
                <p className="text-slate-700 font-medium">{activeFlight.destination.name}</p>
                <p className="text-slate-500 text-[11px] font-medium">
                  {activeFlight.destination.city}, {activeFlight.destination.country} • Carousel {activeFlight.baggageCarousel || 'Belt 4'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Live Radar List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Fleet Flight Radar
            </h3>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredFlightList.map((flight) => {
                const isCurrentActive = flight.id === activeFlight.id;

                return (
                  <div
                    key={flight.id}
                    onClick={() => handleSelectFlight(flight)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isCurrentActive
                        ? 'bg-blue-50/80 border-blue-900 shadow-2xs ring-1 ring-blue-900/30'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">
                        {flight.flightNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          flight.status === 'In Air'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {flight.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-700 mt-2 font-bold">
                      <span>
                        {flight.origin.code} ({flight.origin.city})
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {flight.destination.code} ({flight.destination.city})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-medium">
                      <span>{flight.durationFormatted}</span>
                      <span>{flight.aircraftModel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
