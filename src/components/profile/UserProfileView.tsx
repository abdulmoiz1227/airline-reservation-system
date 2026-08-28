import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  FileText,
  Shield,
  Bell,
  Heart,
  Save,
  CheckCircle2,
  Award,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, userLoyaltyAccount } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Alex Mercer',
    email: currentUser?.email || 'alex.mercer@example.com',
    phone: currentUser?.phone || '+1 (555) 234-8901',
    dateOfBirth: currentUser?.dateOfBirth || '1992-04-15',
    nationality: currentUser?.nationality || 'American',
    passportNumber: currentUser?.passportNumber || 'US89412093',
    passportExpiry: currentUser?.passportExpiry || '2030-11-20',
    seatPreference: 'window',
    mealPreference: 'standard',
    smsAlerts: true,
    emailAlerts: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="user-profile-view" className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      {/* Header Profile Summary Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-900 text-cyan-400 flex items-center justify-center font-black text-2xl shadow-2xs">
            {formData.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{formData.name}</h1>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-200 capitalize">
                {userLoyaltyAccount?.tier || 'Silver'} Elite
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">{formData.email} • {formData.phone}</p>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            SkyMiles Account
          </p>
          <p className="text-2xl font-black text-blue-900">
            {userLoyaltyAccount?.pointsBalance.toLocaleString() || '14,850'}{' '}
            <span className="text-xs font-bold text-slate-400">pts</span>
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes and travel preferences saved successfully!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & Passport Details Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-900" />
            <span>Personal & Identification Documents</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Legal Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nationality</label>
              <input
                type="text"
                required
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Passport / National ID Number</label>
              <input
                type="text"
                required
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        {/* Flight & Travel Preferences */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Seating & In-Flight Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Seat Location Preference</label>
              <select
                value={formData.seatPreference}
                onChange={(e) => setFormData({ ...formData, seatPreference: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
              >
                <option value="window">Window Seat (Sky Views)</option>
                <option value="aisle">Aisle Seat (Easy Legroom & Movement)</option>
                <option value="middle">Middle Seat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Special Meal Request</label>
              <select
                value={formData.mealPreference}
                onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
              >
                <option value="standard">Standard Gourmet In-Flight Meal</option>
                <option value="vegetarian">Vegetarian / Vegan Meal (VGML)</option>
                <option value="halal">Halal Certified Meal (MOML)</option>
                <option value="kosher">Kosher Meal (KSML)</option>
                <option value="gluten_free">Gluten-Intolerant Meal (GFML)</option>
                <option value="diabetic">Diabetic Meal (DBML)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Alert Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-900" />
            <span>Flight Communications & SMS Alerts</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Real-Time SMS Gate & Delay Alerts</p>
                <p className="text-[11px] text-slate-500 font-medium">Receive instant text alerts for gate changes and boarding status.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.smsAlerts}
                onChange={(e) => setFormData({ ...formData, smsAlerts: e.target.checked })}
                className="w-4 h-4 accent-blue-900 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">E-Ticket & Loyalty Statement Emails</p>
                <p className="text-[11px] text-slate-500 font-medium">Get monthly frequent flyer statements and promotional fare alerts.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.emailAlerts}
                onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                className="w-4 h-4 accent-blue-900 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
