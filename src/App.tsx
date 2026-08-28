import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { BookingWizard } from './components/booking/BookingWizard';
import { FlightScheduleView } from './components/schedule/FlightScheduleView';
import { MyBookingsView } from './components/bookings/MyBookingsView';
import { LoyaltyRewardsDashboard } from './components/loyalty/LoyaltyRewardsDashboard';
import { FlightTrackerView } from './components/tracker/FlightTrackerView';
import { UserProfileView } from './components/profile/UserProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BoardingPassModal } from './components/tickets/BoardingPassModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { Plane, ShieldCheck, Heart, Award, Globe } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col text-slate-900 font-sans antialiased selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeTab === 'dashboard' && <UserDashboard />}
        {activeTab === 'search' && <BookingWizard />}
        {activeTab === 'schedule' && <FlightScheduleView />}
        {activeTab === 'bookings' && <MyBookingsView />}
        {activeTab === 'rewards' && <LoyaltyRewardsDashboard />}
        {activeTab === 'tracker' && <FlightTrackerView />}
        {activeTab === 'profile' && <UserProfileView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-white text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              SK
            </div>
            <div>
              <p className="font-bold text-sm text-white">SkyLink Global Airways</p>
              <p className="text-[11px] text-slate-400">
                Official Airline Reservation & Fleet Operations Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs">
            <button
              onClick={() => setActiveTab('schedule')}
              className="hover:text-white transition-colors"
            >
              Flight Timetable
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className="hover:text-white transition-colors"
            >
              Live Radar
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className="hover:text-white transition-colors"
            >
              SkyMiles Program
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-amber-400 text-amber-300 font-semibold transition-colors"
            >
              Operations Dispatch (Admin)
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} SkyLink Airways. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <AuthModal />
      <BoardingPassModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
