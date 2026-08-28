import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  Plane,
  Luggage,
  Shield,
  Leaf,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const PaymentAndReview: React.FC = () => {
  const {
    selectedFlight,
    selectedCabinClass,
    passengers,
    selectedSeatNumbers,
    addOns,
    setAddOns,
    redeemedPoints,
    setRedeemedPoints,
    calculateFareBreakdown,
    completeBookingPayment,
    userLoyaltyAccount,
    setBookingStep,
    currentUser,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'saved' | 'apple_pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [cardHolder, setCardHolder] = useState(
    currentUser ? currentUser.name : `${passengers[0]?.firstName} ${passengers[0]?.lastName}`
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  if (!selectedFlight) return null;

  const fare = calculateFareBreakdown();
  const maxRedeemablePoints = Math.min(
    userLoyaltyAccount ? userLoyaltyAccount.pointsBalance : 0,
    fare.totalAmount * 100 // 1000 pts = $10 ($0.01 per point)
  );

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    setIsProcessing(true);

    try {
      // Simulate realistic payment gateway processing latency
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const paymentMethodLabel =
        paymentMethod === 'saved'
          ? 'Visa •••• 4242 (Saved)'
          : paymentMethod === 'apple_pay'
          ? 'Apple Pay'
          : `Credit Card (•••• ${cardNumber.slice(-4) || '4242'})`;

      await completeBookingPayment(paymentMethodLabel);
    } catch (err: any) {
      setPaymentError(err?.message || 'Payment transaction failed. Please verify your card details.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trip Add-ons & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add-ons Section (Baggage, Insurance, Carbon offset) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Travel Add-ons & Essentials</span>
              </h3>
            </div>

            <div className="space-y-3">
              {/* Extra Checked Baggage */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Luggage className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Extra Checked Baggage (23kg)</p>
                    <p className="text-[11px] text-slate-500 font-medium">$45 per additional bag</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
                  <button
                    type="button"
                    disabled={addOns.extraBaggageCount <= 0}
                    onClick={() =>
                      setAddOns((prev) => ({
                        ...prev,
                        extraBaggageCount: Math.max(0, prev.extraBaggageCount - 1),
                      }))
                    }
                    className="w-7 h-7 rounded-lg bg-slate-100 disabled:opacity-30 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{addOns.extraBaggageCount}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAddOns((prev) => ({
                        ...prev,
                        extraBaggageCount: prev.extraBaggageCount + 1,
                      }))
                    }
                    className="w-7 h-7 rounded-lg bg-slate-100 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Comprehensive Travel Insurance */}
              <div
                onClick={() => setAddOns((prev) => ({ ...prev, insurance: !prev.insurance }))}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  addOns.insurance
                    ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-900 shadow-2xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      SkyProtect™ Comprehensive Travel Cover
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Medical emergencies, flight cancellations & lost baggage (+$20/pax)
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    addOns.insurance ? 'bg-blue-900 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {addOns.insurance && '✓'}
                </div>
              </div>

              {/* Carbon Offset */}
              <div
                onClick={() => setAddOns((prev) => ({ ...prev, carbonOffset: !prev.carbonOffset }))}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  addOns.carbonOffset
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">GreenSky Carbon Offset</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Support certified global reforestation projects (+$6/pax)
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    addOns.carbonOffset
                      ? 'bg-emerald-700 text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {addOns.carbonOffset && '✓'}
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Points Redemption Slider */}
          {userLoyaltyAccount && userLoyaltyAccount.pointsBalance > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-extrabold text-sm text-slate-900">Redeem SkyMiles for Discount</span>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {userLoyaltyAccount.pointsBalance.toLocaleString()} pts available
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Points to Redeem: <strong>{redeemedPoints} pts</strong></span>
                  <span className="text-emerald-700 font-bold">
                    -${Math.floor(redeemedPoints / 100)} Instant Discount
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxRedeemablePoints}
                  step={100}
                  value={redeemedPoints}
                  onChange={(e) => setRedeemedPoints(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>0 pts ($0)</span>
                  <span>{maxRedeemablePoints.toLocaleString()} pts (-${Math.floor(maxRedeemablePoints / 100)})</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-700" />
                <span>Payment Method</span>
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                id="payment-method-card-btn"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-blue-900 border-blue-900 text-white font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className={`w-5 h-5 mx-auto mb-1.5 ${paymentMethod === 'card' ? 'text-white' : 'text-slate-700'}`} />
                <span className="text-xs font-bold">Credit / Debit</span>
              </button>

              <button
                type="button"
                id="payment-method-saved-btn"
                onClick={() => setPaymentMethod('saved')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'saved'
                    ? 'bg-blue-900 border-blue-900 text-white font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 mx-auto mb-1.5 ${paymentMethod === 'saved' ? 'text-white' : 'text-slate-700'}`} />
                <span className="text-xs font-bold">Saved Card</span>
              </button>

              <button
                type="button"
                id="payment-method-apple-btn"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-blue-900 border-blue-900 text-white font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Lock className={`w-5 h-5 mx-auto mb-1.5 ${paymentMethod === 'apple_pay' ? 'text-white' : 'text-slate-700'}`} />
                <span className="text-xs font-bold">Apple Pay</span>
              </button>
            </div>

            {paymentError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handleProcessPayment} className="space-y-4">
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-3 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="892"
                        className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-3 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'saved' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-blue-950 rounded-lg text-white text-[10px] font-black flex items-center justify-center">
                      VISA
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Visa ending in 4242</p>
                      <p className="text-[11px] text-slate-500 font-medium">Expires 08/2028 • Primary</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    <span>Pay with Apple Pay</span>
                  </div>
                  <span className="text-xs text-sky-400 font-bold">Ready</span>
                </div>
              )}

              {/* Strict Business Rule Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Loyalty Points Earning:</span>
                </p>
                <p className="leading-relaxed">
                  Loyalty points are credited immediately following confirmed payment authorization. Exactly <strong>{Math.round(fare.totalAmount)} SkyMiles</strong> will be added to your account.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setBookingStep(4)}
                  className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Passengers</span>
                </button>

                <button
                  type="submit"
                  id="pay-confirm-btn"
                  disabled={isProcessing}
                  className="px-6 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-900/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ${fare.totalAmount} & Confirm Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Complete Summary & Fare Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-5 sticky top-20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
              Booking Review & Fare Breakdown
            </h3>

            {/* Flight summary */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-cyan-400">{selectedFlight.flightNumber}</span>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                  {selectedCabinClass} Class
                </span>
              </div>

              <div className="grid grid-cols-3 text-center items-center py-2 border-y border-slate-800">
                <div className="text-left">
                  <p className="text-2xl font-black text-white">{selectedFlight.origin.code}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{selectedFlight.origin.city}</p>
                </div>
                <div className="text-center text-[10px] text-slate-400">
                  <Plane className="w-4 h-4 mx-auto text-cyan-400 -rotate-45 mb-1" />
                  <span className="font-medium">{selectedFlight.durationFormatted}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{selectedFlight.destination.code}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{selectedFlight.destination.city}</p>
                </div>
              </div>

              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Date: {new Date(selectedFlight.departureTime).toLocaleDateString()}</span>
                <span>Aircraft: {selectedFlight.aircraftModel}</span>
              </div>
            </div>

            {/* Passengers & Seats list */}
            <div className="space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Travelers & Seats:</p>
              {passengers.map((pax, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <span className="font-bold text-slate-800">
                    {pax.firstName} {pax.lastName}
                  </span>
                  <span className="font-extrabold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Seat {selectedSeatNumbers[idx] || '12A'}
                  </span>
                </div>
              ))}
            </div>

            {/* Detailed Itemized Fare Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Airfare ({passengers.length} Pax)</span>
                <span className="font-bold text-slate-900">${fare.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Government Taxes & Security</span>
                <span className="font-bold text-slate-900">${fare.taxes}</span>
              </div>
              <div className="flex justify-between">
                <span>Airport Passenger Service Fees</span>
                <span className="font-bold text-slate-900">${fare.airportFees}</span>
              </div>
              {fare.seatSelectionFees > 0 && (
                <div className="flex justify-between text-blue-900">
                  <span>Seat Selection Fees</span>
                  <span className="font-bold">+${fare.seatSelectionFees}</span>
                </div>
              )}
              {fare.baggageFees > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Extra Checked Baggage</span>
                  <span className="font-bold">+${fare.baggageFees}</span>
                </div>
              )}
              {fare.insuranceFee > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>SkyProtect™ Travel Cover</span>
                  <span className="font-bold">+${fare.insuranceFee}</span>
                </div>
              )}
              {fare.carbonOffsetFee > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>GreenSky Carbon Offset</span>
                  <span className="font-bold">+${fare.carbonOffsetFee}</span>
                </div>
              )}
              {fare.loyaltyDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>SkyMiles Redemption Discount</span>
                  <span>-${fare.loyaltyDiscount}</span>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Amount Due</span>
                <span className="text-2xl font-black text-slate-900">${fare.totalAmount}</span>
              </div>

              <div className="pt-2 text-right">
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                  ✨ Earn +{Math.round(fare.totalAmount)} Loyalty Points on Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
