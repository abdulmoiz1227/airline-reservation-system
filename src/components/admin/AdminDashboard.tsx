import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flight, FlightStatus, CabinClass } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  ShieldAlert,
  Plane,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sliders,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    flights,
    aircrafts,
    airports,
    bookings,
    updateFlightStatus,
    adminAddFlight,
  } = useApp();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'flights' | 'aircraft' | 'bookings'>('overview');
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New flight form state
  const [newFlightData, setNewFlightData] = useState({
    flightNumber: 'SK 770',
    originCode: 'KHI',
    destCode: 'LHR',
    departureTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    arrivalTime: new Date(Date.now() + 86400000 + 8 * 3600000).toISOString().slice(0, 16),
    economyPrice: 620,
    businessPrice: 1950,
    firstPrice: 3800,
    aircraftModel: 'Boeing 777-300ER',
    terminal: 'T1',
    gate: 'B12',
  });

  // Calculate analytics
  const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.totalAmount : sum), 0);
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;
  const totalPassengers = bookings.reduce((sum, b) => sum + b.passengers.length, 0);

  // Revenue by route for recharts
  const routeRevenueMap: Record<string, number> = {};
  bookings.forEach((b) => {
    const route = `${b.flight.origin.code}-${b.flight.destination.code}`;
    routeRevenueMap[route] = (routeRevenueMap[route] || 0) + b.totalAmount;
  });

  const revenueChartData = Object.keys(routeRevenueMap).map((route) => ({
    route,
    revenue: routeRevenueMap[route],
  }));

  // Booking status distribution
  const statusDistribution = [
    { name: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, color: '#0284c7' },
    { name: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, color: '#10b981' },
    { name: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length, color: '#f43f5e' },
  ];

  const handleAddFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const originAirport = airports.find((a) => a.code === newFlightData.originCode) || airports[0];
    const destAirport = airports.find((a) => a.code === newFlightData.destCode) || airports[1];

    const newFlight: Flight = {
      id: `flt-${Date.now()}`,
      flightNumber: newFlightData.flightNumber,
      airline: 'SkyLink Airlines',
      aircraftId: 'ac-1',
      aircraftModel: newFlightData.aircraftModel,
      originAirportId: originAirport.id,
      destinationAirportId: destAirport.id,
      origin: originAirport,
      destination: destAirport,
      departureTime: new Date(newFlightData.departureTime).toISOString(),
      arrivalTime: new Date(newFlightData.arrivalTime).toISOString(),
      durationMinutes: 480,
      durationFormatted: '8h 00m',
      stops: 0,
      basePrices: {
        economy: Number(newFlightData.economyPrice),
        business: Number(newFlightData.businessPrice),
        first: Number(newFlightData.firstPrice),
      },
      availableSeats: {
        economy: 180,
        business: 36,
        first: 8,
        total: 224,
      },
      status: 'Scheduled',
      terminal: newFlightData.terminal,
      gate: newFlightData.gate,
    };

    adminAddFlight(newFlight);
    setShowAddModal(false);
  };

  return (
    <div id="admin-dashboard-view" className="space-y-6 pb-12 animate-in fade-in">
      {/* Admin Header Banner in Bento Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Airline Operations Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            SkyLink Dispatch & Fleet Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time fleet scheduling, flight delays dispatcher, seat occupancy analytics, and revenue metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Flight</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-2xs w-fit">
        {[
          { id: 'overview', label: 'Operations & Analytics' },
          { id: 'flights', label: 'Fleet Flight Management' },
          { id: 'aircraft', label: 'Aircraft Seat Inventory' },
          { id: 'bookings', label: 'Master Passenger Manifests' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === tab.id
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Analytics Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards in Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Total Ticket Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-600 font-bold">● Live transaction ledger active</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Active Bookings</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{confirmedBookingsCount}</p>
              <p className="text-[11px] text-slate-500 font-medium">{totalPassengers} Total Travelers logged</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Scheduled Flights</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{flights.length}</p>
              <p className="text-[11px] text-blue-900 font-bold">100% on-schedule dispatch</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Active Fleet Size</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{aircrafts.length} Aircraft</p>
              <p className="text-[11px] text-slate-500 font-medium">Widebody & Regional Jets</p>
            </div>
          </div>

          {/* Revenue and Booking Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Route Passenger Revenue Breakdown ($)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData.length > 0 ? revenueChartData : [{ route: 'KHI-DXB', revenue: 1650 }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="route" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Booking Status Share
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Management & Dispatcher Tab */}
      {selectedTab === 'flights' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-4 p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-slate-900">Flight Status Dispatcher</h3>
            <span className="text-xs text-slate-500 font-medium">Change flight status to trigger automatic passenger alerts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 rounded-l-2xl">Flight</th>
                  <th className="py-3.5 px-4">Route</th>
                  <th className="py-3.5 px-4">Departure / Arrival</th>
                  <th className="py-3.5 px-4">Gate</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-2xl">Quick Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {flight.flightNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {flight.origin.code} → {flight.destination.code}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] font-semibold">
                      {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      T{flight.terminal} / {flight.gate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                        {flight.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateFlightStatus(flight.id, 'In Air')}
                          className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold text-[11px] cursor-pointer"
                        >
                          Takeoff
                        </button>
                        <button
                          onClick={() => updateFlightStatus(flight.id, 'Delayed', 45)}
                          className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-[11px] cursor-pointer"
                        >
                          Delay (+45m)
                        </button>
                        <button
                          onClick={() => updateFlightStatus(flight.id, 'Landed')}
                          className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold text-[11px] cursor-pointer"
                        >
                          Landed
                        </button>
                        <button
                          onClick={() => updateFlightStatus(flight.id, 'Cancelled')}
                          className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aircraft Inventory Tab */}
      {selectedTab === 'aircraft' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aircrafts.map((ac) => (
            <div key={ac.id} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-slate-900 text-base">{ac.model}</h4>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                  {ac.registrationNumber}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Total Aircraft Capacity</span>
                  <span className="font-bold text-slate-900">{ac.totalCapacity} Seats</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>First Class Cabin</span>
                  <span className="font-bold text-amber-700">{ac.cabinBreakdown.first} Suites</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Business Class Cabin</span>
                  <span className="font-bold text-blue-900">{ac.cabinBreakdown.business} Seats</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Main Economy Cabin</span>
                  <span className="font-bold text-slate-700">{ac.cabinBreakdown.economy} Seats</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Airworthiness Certified & In-Service</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Master Passenger Manifests Tab */}
      {selectedTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">All Confirmed Booking Manifests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 rounded-l-2xl">PNR</th>
                  <th className="py-3.5 px-4">Flight</th>
                  <th className="py-3.5 px-4">Passengers</th>
                  <th className="py-3.5 px-4">Assigned Seats</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4 text-right rounded-r-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-blue-900">{b.pnr}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.flight.flightNumber}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {b.passengers.map((p) => `${p.firstName} ${p.lastName}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {b.selectedSeats.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">${b.totalAmount}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule New Flight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100">
            <h3 className="text-base font-black text-slate-900">Schedule New Commercial Flight</h3>
            <form onSubmit={handleAddFlightSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={newFlightData.flightNumber}
                    onChange={(e) => setNewFlightData({ ...newFlightData, flightNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Aircraft Model</label>
                  <input
                    type="text"
                    required
                    value={newFlightData.aircraftModel}
                    onChange={(e) => setNewFlightData({ ...newFlightData, aircraftModel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Origin Code</label>
                  <select
                    value={newFlightData.originCode}
                    onChange={(e) => setNewFlightData({ ...newFlightData, originCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
                  >
                    {airports.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.city} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Destination Code</label>
                  <select
                    value={newFlightData.destCode}
                    onChange={(e) => setNewFlightData({ ...newFlightData, destCode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
                  >
                    {airports.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.city} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Economy ($)</label>
                  <input
                    type="number"
                    required
                    value={newFlightData.economyPrice}
                    onChange={(e) => setNewFlightData({ ...newFlightData, economyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Business ($)</label>
                  <input
                    type="number"
                    required
                    value={newFlightData.businessPrice}
                    onChange={(e) => setNewFlightData({ ...newFlightData, businessPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">First ($)</label>
                  <input
                    type="number"
                    required
                    value={newFlightData.firstPrice}
                    onChange={(e) => setNewFlightData({ ...newFlightData, firstPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold cursor-pointer"
                >
                  Create Flight Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
