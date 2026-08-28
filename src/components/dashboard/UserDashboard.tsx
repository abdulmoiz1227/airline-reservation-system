import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Award,
  BookmarkCheck,
  Compass,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Eye,
  CheckCircle2,
  Clock,
  Bell,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    userLoyaltyAccount,
    bookings,
    airports,
    searchParams,
    setSearchParams,
    setActiveTab,
    setBookingStep,
    setTicketModalBooking,
    setTrackedFlight,
    flights,
    setIsNotificationDrawerOpen,
    unreadNotificationsCount,
  } = useApp();

  const confirmedBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id && b.bookingStatus === 'confirmed')
    : [];

  const upcomingBooking = confirmedBookings[0] || null;
  const recentBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id).slice(0, 3)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(1);
    setActiveTab('search');
  };

  const handleSwapAirports = () => {
    setSearchParams((prev) => ({
      ...prev,
      originCode: prev.destinationCode,
      destinationCode: prev.originCode,
    }));
  };

  const firstName = currentUser ? currentUser.name.split(' ')[0] : 'Traveler';
  const activeFlightInAir = flights.find((f) => f.status === 'In Air') || flights[0];

  return (
    <div id="user-dashboard-view" className="space-y-6 pb-12 animate-in fade-in">
      {/* Bento Grid Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Bento Tile 1: Search Flights Widget (Spans 8 cols on desktop) */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome back, {firstName} 👋
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Ready for your next adventure? Explore non-stop flights to over 120 destinations.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  id="dashboard-search-oneway-btn"
                  onClick={() => setSearchParams((prev) => ({ ...prev, tripType: 'one-way' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    searchParams.tripType === 'one-way'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  One-way
                </button>
                <button
                  type="button"
                  id="dashboard-search-roundtrip-btn"
                  onClick={() => setSearchParams((prev) => ({ ...prev, tripType: 'round-trip' }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    searchParams.tripType === 'round-trip'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Round-trip
                </button>
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    From (Departure)
                  </label>
                  <div className="relative">
                    <select
                      id="dashboard-origin-select"
                      value={searchParams.originCode}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, originCode: e.target.value }))}
                      aria-label="Departure airport"
                      className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all cursor-pointer truncate"
                    >
                      {airports.map((apt) => (
                        <option key={apt.id} value={apt.code}>
                          {apt.city} ({apt.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* To Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      To (Destination)
                    </label>
                    <button
                      type="button"
                      onClick={handleSwapAirports}
                      className="text-[10px] font-bold text-blue-900 hover:underline flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Swap</span>
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      id="dashboard-destination-select"
                      value={searchParams.destinationCode}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, destinationCode: e.target.value }))}
                      aria-label="Arrival airport"
                      className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all cursor-pointer truncate"
                    >
                      {airports.map((apt) => (
                        <option key={apt.id} value={apt.code}>
                          {apt.city} ({apt.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Departure Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    id="dashboard-departure-date"
                    value={searchParams.departureDate}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, departureDate: e.target.value }))}
                    aria-label="Departure Date"
                    className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                  />
                </div>

                {/* Passengers & Class */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Passengers & Cabin
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      id="dashboard-passengers-select"
                      value={searchParams.passengersCount}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          passengersCount: parseInt(e.target.value) || 1,
                        }))
                      }
                      aria-label="Number of passengers"
                      className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value={1}>1 Passenger</option>
                      <option value={2}>2 Passengers</option>
                      <option value={3}>3 Passengers</option>
                      <option value={4}>4 Passengers</option>
                    </select>

                    <select
                      id="dashboard-cabin-select"
                      value={searchParams.cabinClass}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          cabinClass: e.target.value as any,
                        }))
                      }
                      aria-label="Cabin Class"
                      className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 capitalize focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="dashboard-search-flights-btn"
                className="w-full mt-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plane className="w-4 h-4 -rotate-45" />
                <span>Search Flights</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bento Column 2 (Spans 4 cols on desktop): Loyalty & Miles Cards */}
        <div className="md:col-span-4 flex flex-col gap-5">
          {/* Bento Tile 2: Loyalty Balance Card */}
          <div
            id="loyalty-hero-card"
            onClick={() => setActiveTab('rewards')}
            className="flex-1 bg-blue-900 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-200">
                  SkyMiles Balance
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-800/80 text-cyan-300 border border-blue-700">
                  {userLoyaltyAccount?.tier || 'Platinum'} Member
                </span>
              </div>
              <p className="text-4xl font-extrabold mt-3 tracking-tight">
                {userLoyaltyAccount ? userLoyaltyAccount.pointsBalance.toLocaleString() : '24,850'}{' '}
                <span className="text-sm font-normal text-blue-200">pts</span>
              </p>
              <div className="mt-6 pt-5 border-t border-blue-800/80">
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-blue-200 mb-2 font-semibold">
                  <span>Next Tier: Diamond</span>
                  <span>{userLoyaltyAccount?.tierProgress || 72}%</span>
                </div>
                <div className="w-full bg-blue-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${userLoyaltyAccount?.tierProgress || 72}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Translucent glyph background */}
            <div className="absolute -right-4 -bottom-4 opacity-10 text-white pointer-events-none">
              <Award className="w-36 h-36" />
            </div>
          </div>

          {/* Bento Tile 3: Miles Earned Highlight Card */}
          <div
            onClick={() => setActiveTab('rewards')}
            className="bg-cyan-50 rounded-3xl p-5 flex items-center justify-between border border-cyan-100 cursor-pointer hover:bg-cyan-100/70 transition-all"
          >
            <div>
              <p className="text-xs font-bold text-cyan-800 uppercase tracking-widest mb-1">
                Miles Earned
              </p>
              <p className="text-2xl font-black text-cyan-900">
                {userLoyaltyAccount
                  ? `${(userLoyaltyAccount.milesTravelled / 1000).toFixed(1)}k`
                  : '12.4k'}{' '}
                <span className="text-xs font-semibold text-cyan-700">mi</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-white shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Bento Tile 4: Upcoming Flight Card (Spans 5 cols on desktop) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-slate-800 text-base">Upcoming Flight</h3>
              {upcomingBooking ? (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                  On Time
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                  No Active Booking
                </span>
              )}
            </div>

            {upcomingBooking ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900">
                      {upcomingBooking.flight.origin.code}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {upcomingBooking.flight.origin.city}
                    </p>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-4 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                      <Plane className="w-5 h-5 text-blue-900 -rotate-45" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-slate-900">
                      {upcomingBooking.flight.destination.code}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {upcomingBooking.flight.destination.city}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Flight</p>
                    <p className="font-bold text-slate-900">{upcomingBooking.flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Gate</p>
                    <p className="font-bold text-slate-900">{upcomingBooking.flight.gate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Seat</p>
                    <p className="font-bold text-blue-900">
                      {upcomingBooking.selectedSeats[0]?.seatNumber || '12A'}{' '}
                      <span className="text-xs font-medium text-slate-500">
                        ({upcomingBooking.cabinClass})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Boarding</p>
                    <p className="font-bold text-slate-900">
                      {new Date(upcomingBooking.flight.departureTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <Plane className="w-10 h-10 text-slate-300 mx-auto -rotate-45" />
                <p className="text-xs text-slate-500 font-medium">
                  You do not have any upcoming flight reservations scheduled.
                </p>
                <button
                  onClick={() => {
                    setBookingStep(1);
                    setActiveTab('search');
                  }}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold"
                >
                  Book New Trip
                </button>
              </div>
            )}
          </div>

          {upcomingBooking && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setTicketModalBooking(upcomingBooking)}
                className="flex-1 py-2.5 px-3 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Boarding Pass</span>
              </button>
              <button
                onClick={() => {
                  setTrackedFlight(upcomingBooking.flight);
                  setActiveTab('tracker');
                }}
                className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Radar</span>
              </button>
            </div>
          )}
        </div>

        {/* Bento Tile 5: Live Flight Tracking Radar (Spans 7 cols on desktop) */}
        <div className="md:col-span-7 bg-slate-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between text-white shadow-sm">
          <div className="flex items-center justify-between z-10 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white text-lg font-bold">Live Flight Tracking</h3>
                <span className="bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-cyan-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  In Air
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Flight {activeFlightInAir.flightNumber} • 36,000 ft • 560 mph • {activeFlightInAir.aircraftModel}
              </p>
            </div>

            <button
              onClick={() => {
                setTrackedFlight(activeFlightInAir);
                setActiveTab('tracker');
              }}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Radar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 mb-2 z-10">
            <div className="flex justify-between text-white text-[10px] font-bold uppercase mb-2">
              <span>{activeFlightInAir.origin.city} ({activeFlightInAir.origin.code})</span>
              <span>{activeFlightInAir.destination.city} ({activeFlightInAir.destination.code})</span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full w-full relative">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-[65%]" />
              <div className="absolute top-1/2 left-[65%] -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-blue-900 flex items-center justify-center shadow-md">
                <div className="w-1 h-1 bg-blue-900 rounded-full" />
              </div>
            </div>
            <div className="flex justify-between text-slate-400 text-[10px] mt-2 font-medium">
              <span>
                Dep:{' '}
                {new Date(activeFlightInAir.departureTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>
                ETA:{' '}
                {new Date(activeFlightInAir.arrivalTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Bento Tile 6: Notifications Quick Tile (Spans 4 cols on desktop) */}
        <div
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Notifications
              </p>
              <p className="text-sm font-bold text-slate-900">
                {unreadNotificationsCount > 0
                  ? `${unreadNotificationsCount} New Flight Alert${unreadNotificationsCount === 1 ? '' : 's'}`
                  : 'All Caught Up'}
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition-colors" />
        </div>

        {/* Bento Tile 7: Quick Schedule / Route Deals Tile (Spans 4 cols on desktop) */}
        <div
          onClick={() => setActiveTab('schedule')}
          className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Timetable
              </p>
              <p className="text-sm font-bold text-slate-900">Flight Schedules</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </div>

        {/* Bento Tile 8: Passenger Profile & Loyalty Info (Spans 4 cols on desktop) */}
        <div
          onClick={() => setActiveTab('profile')}
          className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-900 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Traveler Profile
              </p>
              <p className="text-sm font-bold text-slate-900">Passports & Preferences</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-900 transition-colors" />
        </div>
      </div>
    </div>
  );
};
