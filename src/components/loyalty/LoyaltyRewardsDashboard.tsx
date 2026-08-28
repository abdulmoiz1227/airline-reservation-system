import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoyaltyTier } from '../../types';
import {
  Award,
  Sparkles,
  TrendingUp,
  Gift,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Plane,
  Coffee,
  Luggage,
  Zap,
} from 'lucide-react';

export const LoyaltyRewardsDashboard: React.FC = () => {
  const { userLoyaltyAccount, loyaltyTransactions, currentUser } = useApp();
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string>('');

  if (!userLoyaltyAccount) return null;

  const { pointsBalance, lifetimePoints, tier, tierProgress } = userLoyaltyAccount;

  const tiersConfig = [
    {
      tier: 'blue' as LoyaltyTier,
      name: 'Blue Member',
      minPts: 0,
      color: 'from-sky-700 to-sky-900',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      perks: ['Earn 1 pt per $1 spent', 'Member-only flight sales', 'Free Wi-Fi messaging on board'],
    },
    {
      tier: 'silver' as LoyaltyTier,
      name: 'Silver Elite',
      minPts: 10000,
      color: 'from-slate-400 to-slate-600',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      perks: [
        '1.25x Points Multiplier',
        '1 Free Checked Bag (23kg)',
        'Priority Check-in & Security',
        '25% Bonus on partner hotels',
      ],
    },
    {
      tier: 'gold' as LoyaltyTier,
      name: 'Gold Executive',
      minPts: 25000,
      color: 'from-amber-400 to-amber-600',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      perks: [
        '1.5x Points Multiplier',
        '2 Free Checked Bags (32kg)',
        'Global Airport Lounge Access',
        'Complimentary Space-Available Upgrades',
      ],
    },
    {
      tier: 'platinum' as LoyaltyTier,
      name: 'Platinum President',
      minPts: 50000,
      color: 'from-purple-600 to-indigo-900',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      perks: [
        '2.0x Points Multiplier',
        'Dedicated 24/7 VIP Concierge',
        'First Class Lounge & Chauffeur Drive',
        'Complimentary Companion Flight Certificate',
      ],
    },
  ];

  const redemptionCatalog = [
    {
      id: 'lounge',
      title: 'SkyLounge 1-Day Pass',
      cost: 2500,
      icon: Coffee,
      desc: 'Access luxury international lounges with buffet, showers, and bar.',
    },
    {
      id: 'baggage',
      title: 'Extra 23kg Baggage Waiver',
      cost: 3000,
      icon: Luggage,
      desc: 'Complimentary additional checked bag on your next scheduled journey.',
    },
    {
      id: 'upgrade',
      title: 'Business Class Upgrade Voucher',
      cost: 8500,
      icon: Zap,
      desc: 'Upgrade one one-way segment to full lie-flat Business Class.',
    },
  ];

  const handleRedeemItem = (title: string, cost: number) => {
    if (pointsBalance < cost) {
      alert(`Insufficient balance. You need ${cost.toLocaleString()} pts to redeem this perk.`);
      return;
    }
    setRedeemSuccessMsg(`Successfully redeemed "${title}"! Voucher code sent to your email.`);
    setTimeout(() => setRedeemSuccessMsg(''), 5000);
  };

  return (
    <div id="loyalty-rewards-view" className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner: SkyMiles Loyalty Status Card in Bento Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Points & Tier info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200/60">
              <Award className="w-4 h-4 text-blue-900" />
              <span>SkyMiles Frequent Flyer Club</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Reward Balance</p>
              <div className="flex items-baseline gap-3 mt-1">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                  {pointsBalance.toLocaleString()}
                </h1>
                <span className="text-sm font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  SkyMiles Pts
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Account Holder: <strong className="text-slate-900">{currentUser?.name || 'Alex Mercer'}</strong> • Lifetime Miles: {lifetimePoints.toLocaleString()}
            </p>
          </div>

          {/* Tier Badge & Progress Ring */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Current Status Tier
                </p>
                <h3 className="text-lg font-black text-blue-900 capitalize">{tier} Tier</h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-900 text-white capitalize shadow-2xs">
                {userLoyaltyAccount.tierMultiplier}x Earning Rate
              </span>
            </div>

            {/* Progress Bar to next tier */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Progress to next tier</span>
                <span className="text-blue-900 font-black">{tierProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-900 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, tierProgress)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium text-right">
                Points awarded automatically on completed flight settlements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {redeemSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {/* Tiers & Benefits Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Membership Tiers & Exclusive Perks</h2>
          <span className="text-xs font-medium text-slate-400">Tier status recalculated annually</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiersConfig.map((t) => {
            const isCurrentTier = tier.toLowerCase() === t.tier.toLowerCase();

            return (
              <div
                key={t.tier}
                className={`rounded-3xl border p-6 space-y-4 transition-all ${
                  isCurrentTier
                    ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-900/30'
                    : 'bg-white text-slate-900 border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      isCurrentTier
                        ? 'bg-white/20 text-white'
                        : t.badgeColor
                    }`}
                  >
                    {t.minPts === 0 ? 'Entry Level' : `${t.minPts.toLocaleString()} pts`}
                  </span>
                  {isCurrentTier && (
                    <span className="text-[10px] font-black text-cyan-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Current
                    </span>
                  )}
                </div>

                <div>
                  <h3 className={`font-black text-sm ${isCurrentTier ? 'text-white' : 'text-slate-900'}`}>
                    {t.name}
                  </h3>
                  <p className={`text-[11px] font-medium mt-0.5 ${isCurrentTier ? 'text-blue-200' : 'text-slate-500'}`}>
                    Requires {t.minPts.toLocaleString()} qualifying tier miles.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/20 text-xs">
                  {t.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          isCurrentTier ? 'text-cyan-400' : 'text-blue-900'
                        }`}
                      />
                      <span className={isCurrentTier ? 'text-blue-100 text-[11px] font-medium' : 'text-slate-600 text-[11px] font-medium'}>
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Catalog & Transaction History Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Redemption Catalog */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Gift className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-extrabold text-slate-900">Instant Miles Redemption</h3>
          </div>

          <div className="space-y-3">
            {redemptionCatalog.map((item) => {
              const Icon = item.icon;
              const canAfford = pointsBalance >= item.cost;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-900 shrink-0 shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-slate-900 shrink-0">
                      {item.cost.toLocaleString()} pts
                    </span>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => handleRedeemItem(item.title, item.cost)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{canAfford ? 'Redeem Voucher' : 'Insufficient Points'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Points Transaction Ledger */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-900" />
              <h3 className="text-sm font-extrabold text-slate-900">Loyalty Points Statement</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Audited Activity Log</span>
          </div>

          <div className="divide-y divide-slate-100">
            {loyaltyTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs ${
                      tx.type === 'earned'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {tx.type === 'earned' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{tx.description}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {tx.bookingReference && ` • PNR: ${tx.bookingReference}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-mono font-bold ${
                      tx.type === 'earned' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {tx.type === 'earned' ? '+' : '-'}
                    {tx.points.toLocaleString()} pts
                  </p>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
