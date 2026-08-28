import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, Phone, Calendar, Globe, Plane, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    allUsers,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('alex.mercer@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Sign up form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '1995-06-15',
    country: 'United States',
    nationality: 'American',
    passportNumber: '',
    passportExpiry: '2032-06-15',
  });
  const [signupError, setSignupError] = useState('');

  // Forgot / Reset state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail) {
      setLoginError('Please enter your email address');
      return;
    }
    const success = login(loginEmail, loginPassword);
    if (!success) {
      setLoginError('No registered account found with this email. Try our demo account or register.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupData.name || !signupData.email || !signupData.phone || !signupData.password) {
      setSignupError('Please fill in all required fields');
      return;
    }
    // Check if email already exists
    if (allUsers.some((u) => u.email.toLowerCase() === signupData.email.toLowerCase())) {
      setSignupError('An account with this email address already exists. Please log in.');
      return;
    }

    signup({
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      dateOfBirth: signupData.dateOfBirth,
      country: signupData.country,
      nationality: signupData.nationality,
      passportNumber: signupData.passportNumber || `PP${Math.floor(10000000 + Math.random() * 90000000)}`,
      passportExpiry: signupData.passportExpiry,
      password: signupData.password,
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setResetSent(true);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setResetSuccess(true);
    setTimeout(() => {
      setAuthModalMode('login');
      setResetSuccess(false);
      setResetSent(false);
    }, 1500);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 pb-4 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {authModalMode === 'login' && 'Sign in to SkyLink'}
                {authModalMode === 'signup' && 'Create Passenger Account'}
                {authModalMode === 'forgot' && 'Reset Your Password'}
                {authModalMode === 'reset' && 'Set New Password'}
              </h2>
              <p className="text-xs text-slate-400">
                {authModalMode === 'login' && 'Access bookings, live tracking & rewards'}
                {authModalMode === 'signup' && 'Earn 0-tier SkyMiles starting today'}
                {authModalMode === 'forgot' && "We'll send recovery instructions to your email"}
                {authModalMode === 'reset' && 'Choose a strong password for your account'}
              </p>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={() => setAuthModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Quick Demo Account Selector */}
          {authModalMode === 'login' && (
            <div className="mb-5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instant Demo Sign-In</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('alex.mercer@example.com');
                    setLoginPassword('password123');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 text-xs transition-colors"
                >
                  <p className="font-semibold text-slate-200 truncate">Alex Mercer</p>
                  <p className="text-[10px] text-amber-400">Gold Tier (Customer)</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@skylinkair.com');
                    setLoginPassword('adminpass');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-left border border-purple-800/40 text-xs transition-colors"
                >
                  <p className="font-semibold text-purple-200 truncate">Capt. Marcus</p>
                  <p className="text-[10px] text-purple-400">Flight Ops (Admin)</p>
                </button>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    id="login-email-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="alex.mercer@example.com"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    id="login-password-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('signup')}
                  className="font-semibold text-sky-400 hover:text-sky-300"
                >
                  Create one here
                </button>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {authModalMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[68vh] overflow-y-auto pr-1">
              {signupError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {signupError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    id="signup-name-input"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      id="signup-email-input"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      placeholder="eleanor@example.com"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      id="signup-phone-input"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      required
                      placeholder="+1 (555) 019-2831"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      id="signup-dob-input"
                      value={signupData.dateOfBirth}
                      onChange={(e) => setSignupData({ ...signupData, dateOfBirth: e.target.value })}
                      required
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country *</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      id="signup-country-select"
                      value={signupData.country}
                      onChange={(e) => setSignupData({ ...signupData, country: e.target.value })}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    id="signup-password-input"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    placeholder="Create a strong password"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  By creating an account, your SkyMiles Loyalty account is created with <strong>0 initial points</strong>. You will earn points immediately upon your first booking payment!
                </span>
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-sky-500/20"
              >
                Complete Registration
              </button>

              <div className="text-center text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="font-semibold text-sky-400 hover:text-sky-300"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {authModalMode === 'forgot' && (
            <div className="space-y-4">
              {!resetSent ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Enter your registered email address and we'll generate a password recovery reset token.
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        placeholder="alex.mercer@example.com"
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Reset Token Dispatched</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      A simulation password reset code has been sent to <strong>{forgotEmail}</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('reset')}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs transition-colors"
                  >
                    Proceed to Reset Password
                  </button>
                </div>
              )}

              <div className="text-center text-xs text-slate-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="font-semibold text-sky-400 hover:text-sky-300"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* RESET PASSWORD FORM */}
          {authModalMode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Password updated successfully! Redirecting to sign in...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter at least 8 characters"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all"
              >
                Save New Password
              </button>

              <div className="text-center text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="font-semibold text-sky-400 hover:text-sky-300"
                >
                  Cancel and Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
