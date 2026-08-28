import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Award,
  Plane,
  Clock,
  Trash2,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight_delay':
      case 'gate_change':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'booking_confirmed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'loyalty_points':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <Plane className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div
      id="notification-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs animate-in fade-in"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200/60 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Flight Alerts & Updates</h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {unreadCount} unread message{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.linkTab) {
                      setActiveTab(n.linkTab as any);
                      setIsNotificationDrawerOpen(false);
                    }
                  }}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 ${
                    n.read
                      ? 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                      : 'bg-blue-50/50 border-blue-200 text-slate-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getIcon(n.type)}
                      <h4 className="text-xs font-black">{n.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 pl-6 leading-relaxed font-medium">{n.message}</p>

                  {!n.read && (
                    <div className="pl-6 pt-0.5 flex items-center gap-1.5 text-[10px] font-bold text-blue-900">
                      <span className="w-2 h-2 rounded-full bg-blue-900" />
                      <span>New Update</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
