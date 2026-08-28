import React, { useState } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  Plane,
  Calendar,
  Compass,
  BookmarkCheck,
  Award,
  Bell,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  LogIn,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Users,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUser,
    allUsers,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    unreadNotificationsCount,
    userLoyaltyAccount,
    bookings,
    setIsNotificationDrawerOpen,
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBookingsCount = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id && b.bookingStatus === 'confirmed').length
    : 0;

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'search', label: 'Search Flights', icon: Plane },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: BookmarkCheck,
      badge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: Award,
      badge: userLoyaltyAccount ? `${(userLoyaltyAccount.pointsBalance / 1000).toFixed(1)}k` : undefined,
    },
    { id: 'tracker', label: 'Track', icon: Compass },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div
            id="nav-brand-logo"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center shadow-md shadow-blue-900/15 group-hover:scale-105 transition-transform text-white">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-blue-900 tracking-tight">
                  SkyNexus
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Airways
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1 transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                    isActive
                      ? 'text-blue-900 border-b-2 border-blue-900 pb-0.5'
                      : 'text-slate-500 hover:text-blue-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-normal ${
                        isActive
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Dashboard tab if admin */}
            {currentUser?.role === 'admin' && (
              <button
                id="nav-link-admin"
                onClick={() => setActiveTab('admin')}
                className={`py-1 transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                  activeTab === 'admin'
                    ? 'text-indigo-900 border-b-2 border-indigo-900 pb-0.5'
                    : 'text-indigo-600 hover:text-indigo-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Ops</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              id="nav-notification-bell"
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-blue-900 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="nav-user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50 transition-all text-left"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      {userLoyaltyAccount ? `${userLoyaltyAccount.tier} Member` : 'Guest'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    id="nav-user-dropdown"
                    className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-slate-100 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="p-3 bg-slate-50 rounded-2xl mb-2">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      {userLoyaltyAccount && (
                        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">SkyMiles:</span>
                          <span className="font-bold text-blue-900">
                            {userLoyaltyAccount.pointsBalance.toLocaleString()} pts
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      id="dropdown-profile-link"
                      onClick={() => {
                        setActiveTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Info</span>
                    </button>

                    <button
                      id="dropdown-bookings-link"
                      onClick={() => {
                        setActiveTab('bookings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4 text-slate-400" />
                      <span>My Bookings & E-Tickets</span>
                    </button>

                    <button
                      id="dropdown-rewards-link"
                      onClick={() => {
                        setActiveTab('rewards');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Loyalty Tier & Perks</span>
                    </button>

                    {/* Quick Demo User Switcher */}
                    <div className="my-1 border-t border-slate-100 pt-2 pb-1">
                      <p className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Switch Account</span>
                      </p>
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUser(u);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-blue-50 text-blue-900 font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate">{u.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-600 uppercase font-semibold">
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 transition-all shadow-md shadow-blue-900/15"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 animate-in fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                activeTab === 'admin'
                  ? 'bg-indigo-900 text-white'
                  : 'text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Operations</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

