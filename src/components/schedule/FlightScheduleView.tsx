import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlightStatus } from '../../types';
import {
  Calendar,
  Search,
  Plane,
  Clock,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export const FlightScheduleView: React.FC = () => {
  const { flights, startBookingForFlight, setTrackedFlight, setActiveTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || flight.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: FlightStatus, delayMinutes?: number) => {
    switch (status) {
      case 'In Air':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200/80">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>In Air</span>
          </span>
        );
      case 'Boarding':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Boarding</span>
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <span>Scheduled</span>
          </span>
        );
      case 'Departed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <span>Departed</span>
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Delayed (+{delayMinutes || 30}m)</span>
          </span>
        );
      case 'Landed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Landed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div id="flight-schedule-view" className="space-y-6 pb-12 animate-in fade-in">
      {/* Header Banner in Bento Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200/60 mb-3">
              <Calendar className="w-3.5 h-3.5 text-blue-900" />
              <span>Official Timetable</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Flight Schedule & Live Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Real-time status updates, gate assignments, and live timetable across our international fleet.
            </p>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-6 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              id="schedule-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flight number (SK 301) or city (Dubai, London, New York)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              id="schedule-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
            >
              <option value="all">All Flight Statuses</option>
              <option value="In Air">In Air (Live)</option>
              <option value="Boarding">Boarding</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Departed">Departed</option>
              <option value="Delayed">Delayed</option>
              <option value="Landed">Landed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Table / Card View */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Flight</th>
                <th className="py-4 px-4">From</th>
                <th className="py-4 px-4">To</th>
                <th className="py-4 px-4">Departure</th>
                <th className="py-4 px-4">Arrival</th>
                <th className="py-4 px-4">Aircraft</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Available</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredFlights.map((flight) => (
                <tr key={flight.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Flight No & Airline */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-900 text-cyan-400 font-black text-xs flex items-center justify-center shadow-2xs">
                        SK
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{flight.flightNumber}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{flight.airline}</p>
                      </div>
                    </div>
                  </td>

                  {/* From */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{flight.origin.code}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{flight.origin.city}</p>
                    <p className="text-[10px] text-slate-400">Terminal {flight.terminal}</p>
                  </td>

                  {/* To */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{flight.destination.code}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{flight.destination.city}</p>
                    <p className="text-[10px] text-slate-400">Gate {flight.gate}</p>
                  </td>

                  {/* Departure */}
                  <td className="py-4 px-4 font-mono font-medium text-slate-800">
                    <p className="font-bold text-slate-900">
                      {new Date(flight.departureTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-[10px] text-slate-400 font-sans font-medium">
                      {new Date(flight.departureTime).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </td>

                  {/* Arrival */}
                  <td className="py-4 px-4 font-mono font-medium text-slate-800">
                    <p className="font-bold text-slate-900">
                      {new Date(flight.arrivalTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-[10px] text-slate-400 font-sans font-medium">
                      {flight.durationFormatted} • Non-stop
                    </p>
                  </td>

                  {/* Aircraft */}
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    <p className="truncate max-w-[140px] text-xs font-semibold text-slate-700">{flight.aircraftModel}</p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">{getStatusBadge(flight.status, flight.delayMinutes)}</td>

                  {/* Available Seats */}
                  <td className="py-4 px-4">
                    <span className="font-black text-slate-900">{flight.availableSeats.total}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">seats left</span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setTrackedFlight(flight);
                          setActiveTab('tracker');
                        }}
                        title="Live Flight Telemetry"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>

                      {flight.status !== 'Cancelled' && flight.status !== 'Landed' && (
                        <button
                          onClick={() => startBookingForFlight(flight, 'economy')}
                          className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
