export type CabinClass = 'economy' | 'business' | 'first';

export type FlightStatus =
  | 'Scheduled'
  | 'Boarding'
  | 'Departed'
  | 'In Air'
  | 'Delayed'
  | 'Landed'
  | 'Cancelled';

export type SeatType = 'standard' | 'premium' | 'extra_legroom' | 'emergency_exit' | 'vip';

export type SeatStatus = 'available' | 'occupied' | 'selected' | 'held' | 'blocked';

export interface Seat {
  id: string;
  aircraftId: string;
  seatNumber: string; // e.g. "12A"
  row: number;
  col: string; // "A", "B", "C", "D", "E", "F"
  cabinClass: CabinClass;
  seatType: SeatType;
  priceModifier: number; // e.g. +$25 for extra legroom, +$0 standard
  isEmergencyExit?: boolean;
  status: SeatStatus;
  heldUntil?: number; // timestamp
  heldByUserId?: string;
}

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
  terminal?: string;
}

export interface Aircraft {
  id: string;
  code: string;
  model: string; // e.g. "Boeing 787-9 Dreamliner"
  manufacturer: string;
  totalSeats: number;
  layout: {
    rows: number;
    firstClassRows: number;
    businessClassRows: number;
    economyRows: number;
    columns: string[]; // e.g. ["A", "B", "C", "D", "E", "F"]
    aisleIndices: number[]; // where aisles are placed
  };
  registration: string;
}

export interface Flight {
  id: string;
  flightNumber: string; // e.g. "SK 301"
  airline: string; // "SkyLink Airways"
  airlineLogo?: string;
  aircraftId: string;
  aircraftModel: string;
  originAirportId: string;
  destinationAirportId: string;
  origin: Airport;
  destination: Airport;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  durationMinutes: number;
  durationFormatted: string; // "2h 45m"
  status: FlightStatus;
  gate: string;
  terminal: string;
  baggageCarousel?: string;
  delayMinutes?: number;
  basePrices: {
    economy: number;
    business: number;
    first: number;
  };
  availableSeats: {
    economy: number;
    business: number;
    first: number;
    total: number;
  };
  stops: number; // 0 for Direct
  stopAirport?: string;
  // Live flight tracking coordinates & telemetry
  telemetry?: {
    currentLat: number;
    currentLng: number;
    altitudeFt: number;
    groundSpeedMph: number;
    progressPercent: number;
    headingDeg: number;
    estimatedArrival: string;
  };
}

export interface Passenger {
  id: string;
  title?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  email: string;
  phone: string;
  mealPreference?: string;
  specialAssistance?: string;
  seatId?: string;
  seatNumber?: string;
  seatPrice?: number;
}

export interface BookingFareBreakdown {
  baseFare: number;
  taxes: number;
  airportFees: number;
  baggageFees: number;
  seatSelectionFees: number;
  insuranceFee: number;
  carbonOffsetFee: number;
  loyaltyDiscount: number;
  totalAmount: number;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type BookingStatus = 'confirmed' | 'pending_payment' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  pnr: string; // Booking Reference (e.g. "SK-928410")
  userId: string;
  flightId: string;
  flight: Flight;
  cabinClass: CabinClass;
  passengers: Passenger[];
  selectedSeats: {
    passengerId: string;
    seatNumber: string;
    seatType: SeatType;
    price: number;
  }[];
  fareBreakdown: BookingFareBreakdown;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  loyaltyPointsEarned: number;
  loyaltyPointsRedeemed: number;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  isRefunded?: boolean;
  refundedAmount?: number;
}

export type LoyaltyTier = 'Blue' | 'Silver' | 'Gold' | 'Platinum';

export interface LoyaltyAccount {
  userId: string;
  pointsBalance: number;
  lifetimePoints: number;
  pointsRedeemed: number;
  tier: LoyaltyTier;
  tierProgress: number; // percentage to next tier
  milesTravelled: number;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  bookingId?: string;
  bookingPnr?: string;
  points: number; // positive for earn, negative for redeem, negative for reversed
  transactionType: 'EARN_BOOKING' | 'REDEEM_DISCOUNT' | 'POINTS_REVERSED' | 'ADMIN_ADJUSTMENT' | 'BONUS_SIGNUP';
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  preferences?: {
    seatPreference: 'window' | 'aisle' | 'no_preference';
    mealPreference: string;
    currency: 'USD' | 'EUR' | 'GBP' | 'AED' | 'PKR';
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
  };
  createdAt: string;
}

export type NotificationType =
  | 'booking_confirmed'
  | 'payment_success'
  | 'flight_delay'
  | 'gate_change'
  | 'boarding_alert'
  | 'loyalty_earned'
  | 'cancellation_refund';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionLink?: string;
  metadata?: Record<string, any>;
}

export interface SearchFlightParams {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  passengersCount: number;
  cabinClass: CabinClass;
}
