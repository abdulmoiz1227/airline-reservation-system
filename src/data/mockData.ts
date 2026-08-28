import { Airport, Aircraft, Flight, User, LoyaltyAccount, LoyaltyTransaction, Booking, Notification, Seat } from '../types';

export const INITIAL_AIRPORTS: Airport[] = [
  {
    id: 'apt-dxb',
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    lat: 25.2532,
    lng: 55.3657,
    terminal: 'Terminal 3',
  },
  {
    id: 'apt-khi',
    code: 'KHI',
    name: 'Jinnah International Airport',
    city: 'Karachi',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    lat: 24.9065,
    lng: 67.1608,
    terminal: 'Terminal 1',
  },
  {
    id: 'apt-lhr',
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    lat: 51.4700,
    lng: -0.4543,
    terminal: 'Terminal 2',
  },
  {
    id: 'apt-jfk',
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    lat: 40.6413,
    lng: -73.7781,
    terminal: 'Terminal 4',
  },
  {
    id: 'apt-hnd',
    code: 'HND',
    name: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    lat: 35.5494,
    lng: 139.7798,
    terminal: 'Terminal 3',
  },
  {
    id: 'apt-sin',
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    lat: 1.3644,
    lng: 103.9915,
    terminal: 'Terminal 1',
  },
  {
    id: 'apt-cdg',
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    lat: 49.0097,
    lng: 2.5479,
    terminal: 'Terminal 2E',
  },
  {
    id: 'apt-fra',
    code: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    lat: 50.0379,
    lng: 8.5622,
    terminal: 'Terminal 1',
  },
  {
    id: 'apt-doh',
    code: 'DOH',
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar',
    timezone: 'Asia/Qatar',
    lat: 25.2609,
    lng: 51.5651,
    terminal: 'Main Terminal',
  },
  {
    id: 'apt-lax',
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    lat: 33.9416,
    lng: -118.4085,
    terminal: 'Tom Bradley',
  },
];

export const INITIAL_AIRCRAFTS: Aircraft[] = [
  {
    id: 'ac-b789',
    code: 'B789',
    model: 'Boeing 787-9 Dreamliner',
    manufacturer: 'Boeing',
    totalSeats: 290,
    registration: 'AP-BNK',
    layout: {
      rows: 32,
      firstClassRows: 2,
      businessClassRows: 6,
      economyRows: 24,
      columns: ['A', 'B', 'C', 'D', 'E', 'F'],
      aisleIndices: [3],
    },
  },
  {
    id: 'ac-a350',
    code: 'A359',
    model: 'Airbus A350-900',
    manufacturer: 'Airbus',
    totalSeats: 314,
    registration: 'AP-A35',
    layout: {
      rows: 35,
      firstClassRows: 2,
      businessClassRows: 7,
      economyRows: 26,
      columns: ['A', 'B', 'C', 'D', 'E', 'F'],
      aisleIndices: [3],
    },
  },
  {
    id: 'ac-b77w',
    code: 'B77W',
    model: 'Boeing 777-300ER',
    manufacturer: 'Boeing',
    totalSeats: 360,
    registration: 'AP-BHV',
    layout: {
      rows: 40,
      firstClassRows: 2,
      businessClassRows: 8,
      economyRows: 30,
      columns: ['A', 'B', 'C', 'D', 'E', 'F'],
      aisleIndices: [3],
    },
  },
];

// Helper to generate seat map
export function generateSeatsForAircraft(aircraftId: string, aircraft?: Aircraft): Seat[] {
  const targetAircraft = aircraft || INITIAL_AIRCRAFTS.find(a => a.id === aircraftId) || INITIAL_AIRCRAFTS[0];
  const seats: Seat[] = [];
  const { rows, firstClassRows, businessClassRows, columns } = targetAircraft.layout;

  for (let r = 1; r <= rows; r++) {
    let cabinClass: 'first' | 'business' | 'economy' = 'economy';
    if (r <= firstClassRows) {
      cabinClass = 'first';
    } else if (r <= firstClassRows + businessClassRows) {
      cabinClass = 'business';
    }

    const isExitRow = r === firstClassRows + businessClassRows + 1 || r === 18;

    for (const col of columns) {
      // In first class, only A, C, D, F for wider seats
      if (cabinClass === 'first' && (col === 'B' || col === 'E')) continue;

      let seatType: Seat['seatType'] = 'standard';
      let priceModifier = 0;

      if (cabinClass === 'first') {
        seatType = 'vip';
        priceModifier = 0;
      } else if (cabinClass === 'business') {
        seatType = 'premium';
        priceModifier = 0;
      } else {
        if (isExitRow) {
          seatType = 'emergency_exit';
          priceModifier = 35;
        } else if (r <= firstClassRows + businessClassRows + 4) {
          seatType = 'extra_legroom';
          priceModifier = 25;
        } else if (col === 'A' || col === 'F') {
          seatType = 'premium'; // window seat
          priceModifier = 10;
        }
      }

      // Pre-occupy ~30% randomly based on deterministic seed for realism
      const hash = (r * 13 + col.charCodeAt(0) * 7) % 10;
      const isOccupied = hash < 3 && !isExitRow;

      seats.push({
        id: `${aircraftId}-${r}${col}`,
        aircraftId,
        seatNumber: `${r}${col}`,
        row: r,
        col,
        cabinClass,
        seatType,
        priceModifier,
        isEmergencyExit: isExitRow,
        status: isOccupied ? 'occupied' : 'available',
      });
    }
  }

  return seats;
}

// Generate realistic date relative to today
const now = new Date();
const formatDateWithOffset = (daysOffset: number, hour: number, minute: number) => {
  const d = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const INITIAL_FLIGHTS: Flight[] = [
  {
    id: 'fl-301',
    flightNumber: 'SK 301',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-b789',
    aircraftModel: 'Boeing 787-9 Dreamliner',
    originAirportId: 'apt-khi',
    destinationAirportId: 'apt-dxb',
    origin: INITIAL_AIRPORTS[1], // Karachi
    destination: INITIAL_AIRPORTS[0], // Dubai
    departureTime: formatDateWithOffset(0, 10, 30),
    arrivalTime: formatDateWithOffset(0, 12, 15),
    durationMinutes: 165,
    durationFormatted: '2h 45m',
    status: 'In Air',
    gate: 'B14',
    terminal: 'T1',
    baggageCarousel: 'Belt 4',
    basePrices: {
      economy: 250,
      business: 650,
      first: 1200,
    },
    availableSeats: {
      economy: 14,
      business: 8,
      first: 3,
      total: 25,
    },
    stops: 0,
    telemetry: {
      currentLat: 25.10,
      currentLng: 61.50,
      altitudeFt: 36000,
      groundSpeedMph: 540,
      progressPercent: 62,
      headingDeg: 278,
      estimatedArrival: formatDateWithOffset(0, 12, 15),
    },
  },
  {
    id: 'fl-205',
    flightNumber: 'SK 205',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-a350',
    aircraftModel: 'Airbus A350-900',
    originAirportId: 'apt-dxb',
    destinationAirportId: 'apt-lhr',
    origin: INITIAL_AIRPORTS[0], // Dubai
    destination: INITIAL_AIRPORTS[2], // London
    departureTime: formatDateWithOffset(0, 14, 0),
    arrivalTime: formatDateWithOffset(0, 18, 30),
    durationMinutes: 450,
    durationFormatted: '7h 30m',
    status: 'Boarding',
    gate: 'A7',
    terminal: 'T3',
    baggageCarousel: 'Belt 8',
    basePrices: {
      economy: 480,
      business: 1450,
      first: 2900,
    },
    availableSeats: {
      economy: 22,
      business: 6,
      first: 2,
      total: 30,
    },
    stops: 0,
  },
  {
    id: 'fl-412',
    flightNumber: 'SK 412',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-b77w',
    aircraftModel: 'Boeing 777-300ER',
    originAirportId: 'apt-jfk',
    destinationAirportId: 'apt-lhr',
    origin: INITIAL_AIRPORTS[3], // New York
    destination: INITIAL_AIRPORTS[2], // London
    departureTime: formatDateWithOffset(0, 19, 45),
    arrivalTime: formatDateWithOffset(1, 7, 30),
    durationMinutes: 405,
    durationFormatted: '6h 45m',
    status: 'Scheduled',
    gate: 'Gate 22',
    terminal: 'T4',
    baggageCarousel: 'Belt 2',
    basePrices: {
      economy: 520,
      business: 1800,
      first: 3400,
    },
    availableSeats: {
      economy: 45,
      business: 12,
      first: 4,
      total: 61,
    },
    stops: 0,
  },
  {
    id: 'fl-809',
    flightNumber: 'SK 809',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-b789',
    aircraftModel: 'Boeing 787-9 Dreamliner',
    originAirportId: 'apt-sin',
    destinationAirportId: 'apt-hnd',
    origin: INITIAL_AIRPORTS[5], // Singapore
    destination: INITIAL_AIRPORTS[4], // Tokyo
    departureTime: formatDateWithOffset(0, 8, 15),
    arrivalTime: formatDateWithOffset(0, 15, 50),
    durationMinutes: 395,
    durationFormatted: '6h 35m',
    status: 'In Air',
    gate: 'C19',
    terminal: 'T1',
    baggageCarousel: 'Belt 6',
    basePrices: {
      economy: 410,
      business: 1250,
      first: 2600,
    },
    availableSeats: {
      economy: 31,
      business: 9,
      first: 3,
      total: 43,
    },
    stops: 0,
    telemetry: {
      currentLat: 22.45,
      currentLng: 121.20,
      altitudeFt: 38000,
      groundSpeedMph: 565,
      progressPercent: 78,
      headingDeg: 42,
      estimatedArrival: formatDateWithOffset(0, 15, 50),
    },
  },
  {
    id: 'fl-115',
    flightNumber: 'SK 115',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-a350',
    aircraftModel: 'Airbus A350-900',
    originAirportId: 'apt-cdg',
    destinationAirportId: 'apt-dxb',
    origin: INITIAL_AIRPORTS[6], // Paris
    destination: INITIAL_AIRPORTS[0], // Dubai
    departureTime: formatDateWithOffset(0, 16, 20),
    arrivalTime: formatDateWithOffset(1, 0, 50),
    durationMinutes: 390,
    durationFormatted: '6h 30m',
    status: 'Delayed',
    delayMinutes: 45,
    gate: 'E4',
    terminal: 'T2E',
    baggageCarousel: 'Belt 9',
    basePrices: {
      economy: 390,
      business: 1100,
      first: 2200,
    },
    availableSeats: {
      economy: 18,
      business: 4,
      first: 1,
      total: 23,
    },
    stops: 0,
  },
  {
    id: 'fl-604',
    flightNumber: 'SK 604',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-b789',
    aircraftModel: 'Boeing 787-9 Dreamliner',
    originAirportId: 'apt-fra',
    destinationAirportId: 'apt-jfk',
    origin: INITIAL_AIRPORTS[7], // Frankfurt
    destination: INITIAL_AIRPORTS[3], // New York
    departureTime: formatDateWithOffset(1, 11, 0),
    arrivalTime: formatDateWithOffset(1, 14, 15),
    durationMinutes: 495,
    durationFormatted: '8h 15m',
    status: 'Scheduled',
    gate: 'Z12',
    terminal: 'T1',
    baggageCarousel: 'Belt 3',
    basePrices: {
      economy: 550,
      business: 1650,
      first: 3100,
    },
    availableSeats: {
      economy: 50,
      business: 14,
      first: 4,
      total: 68,
    },
    stops: 0,
  },
  {
    id: 'fl-742',
    flightNumber: 'SK 742',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-b77w',
    aircraftModel: 'Boeing 777-300ER',
    originAirportId: 'apt-dxb',
    destinationAirportId: 'apt-khi',
    origin: INITIAL_AIRPORTS[0], // Dubai
    destination: INITIAL_AIRPORTS[1], // Karachi
    departureTime: formatDateWithOffset(1, 18, 30),
    arrivalTime: formatDateWithOffset(1, 21, 40),
    durationMinutes: 130,
    durationFormatted: '2h 10m',
    status: 'Scheduled',
    gate: 'B8',
    terminal: 'T3',
    baggageCarousel: 'Belt 5',
    basePrices: {
      economy: 230,
      business: 590,
      first: 1100,
    },
    availableSeats: {
      economy: 28,
      business: 10,
      first: 2,
      total: 40,
    },
    stops: 0,
  },
  {
    id: 'fl-920',
    flightNumber: 'SK 920',
    airline: 'SkyLink Airways',
    aircraftId: 'ac-a350',
    aircraftModel: 'Airbus A350-900',
    originAirportId: 'apt-doh',
    destinationAirportId: 'apt-lax',
    origin: INITIAL_AIRPORTS[8], // Doha
    destination: INITIAL_AIRPORTS[9], // Los Angeles
    departureTime: formatDateWithOffset(1, 7, 10),
    arrivalTime: formatDateWithOffset(1, 13, 30),
    durationMinutes: 980,
    durationFormatted: '16h 20m',
    status: 'Scheduled',
    gate: 'A15',
    terminal: 'Main',
    baggageCarousel: 'Belt 11',
    basePrices: {
      economy: 890,
      business: 3200,
      first: 5800,
    },
    availableSeats: {
      economy: 64,
      business: 15,
      first: 6,
      total: 85,
    },
    stops: 0,
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr-alex',
    name: 'Alex Mercer',
    email: 'alex.mercer@example.com',
    phone: '+1 (555) 234-8901',
    dateOfBirth: '1992-05-14',
    country: 'United States',
    nationality: 'American',
    passportNumber: 'US89412093',
    passportExpiry: '2030-11-20',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    preferences: {
      seatPreference: 'window',
      mealPreference: 'Standard Non-Vegetarian',
      currency: 'USD',
      emailNotifications: true,
      smsNotifications: true,
      language: 'English (US)',
    },
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'usr-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+44 7700 900123',
    dateOfBirth: '1988-09-22',
    country: 'United Kingdom',
    nationality: 'British',
    passportNumber: 'GB77492100',
    passportExpiry: '2032-04-15',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    preferences: {
      seatPreference: 'aisle',
      mealPreference: 'Vegetarian Lacto-Ovo',
      currency: 'USD',
      emailNotifications: true,
      smsNotifications: true,
      language: 'English (UK)',
    },
    createdAt: '2024-06-18T14:30:00Z',
  },
  {
    id: 'usr-admin',
    name: 'Captain Marcus Vance',
    email: 'admin@skylinkair.com',
    phone: '+1 (800) 555-0199',
    dateOfBirth: '1979-11-03',
    country: 'United States',
    nationality: 'American',
    passportNumber: 'US44091823',
    passportExpiry: '2031-08-10',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2023-01-01T08:00:00Z',
  },
];

export const INITIAL_LOYALTY_ACCOUNTS: Record<string, LoyaltyAccount> = {
  'usr-alex': {
    userId: 'usr-alex',
    pointsBalance: 2450,
    lifetimePoints: 3450,
    pointsRedeemed: 1000,
    tier: 'Gold',
    tierProgress: 68,
    milesTravelled: 14850,
  },
  'usr-sarah': {
    userId: 'usr-sarah',
    pointsBalance: 8750,
    lifetimePoints: 12500,
    pointsRedeemed: 3750,
    tier: 'Platinum',
    tierProgress: 92,
    milesTravelled: 42300,
  },
  'usr-admin': {
    userId: 'usr-admin',
    pointsBalance: 5000,
    lifetimePoints: 5000,
    pointsRedeemed: 0,
    tier: 'Platinum',
    tierProgress: 100,
    milesTravelled: 85000,
  },
};

export const INITIAL_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: 'lt-101',
    userId: 'usr-alex',
    bookingId: 'bk-301',
    bookingPnr: 'SK-948271',
    points: 500,
    transactionType: 'EARN_BOOKING',
    description: 'Points earned for Flight SK 301 (Karachi → Dubai)',
    createdAt: '2026-08-20T11:45:00Z',
  },
  {
    id: 'lt-102',
    userId: 'usr-alex',
    bookingId: 'bk-205',
    bookingPnr: 'SK-771920',
    points: 350,
    transactionType: 'EARN_BOOKING',
    description: 'Points earned for Flight SK 205 (Dubai → London)',
    createdAt: '2026-07-15T16:20:00Z',
  },
  {
    id: 'lt-103',
    userId: 'usr-alex',
    bookingId: 'bk-412',
    bookingPnr: 'SK-449182',
    points: 200,
    transactionType: 'EARN_BOOKING',
    description: 'Points earned for Flight SK 412 (New York → London)',
    createdAt: '2026-06-02T09:10:00Z',
  },
  {
    id: 'lt-104',
    userId: 'usr-alex',
    points: 1400,
    transactionType: 'BONUS_SIGNUP',
    description: 'Welcome Bonus & Gold Tier fast-track rewards',
    createdAt: '2026-01-10T10:00:00Z',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-301',
    pnr: 'SK-948271',
    userId: 'usr-alex',
    flightId: 'fl-301',
    flight: INITIAL_FLIGHTS[0], // SK 301
    cabinClass: 'economy',
    passengers: [
      {
        id: 'pax-1',
        title: 'Mr',
        firstName: 'Alex',
        lastName: 'Mercer',
        dateOfBirth: '1992-05-14',
        gender: 'male',
        nationality: 'American',
        passportNumber: 'US89412093',
        passportExpiry: '2030-11-20',
        email: 'alex.mercer@example.com',
        phone: '+1 (555) 234-8901',
        seatNumber: '12A',
        seatId: 'ac-b789-12A',
        seatPrice: 10,
      },
    ],
    selectedSeats: [
      {
        passengerId: 'pax-1',
        seatNumber: '12A',
        seatType: 'premium',
        price: 10,
      },
    ],
    fareBreakdown: {
      baseFare: 250,
      taxes: 35,
      airportFees: 20,
      baggageFees: 0,
      seatSelectionFees: 10,
      insuranceFee: 15,
      carbonOffsetFee: 5,
      loyaltyDiscount: 0,
      totalAmount: 335,
    },
    totalAmount: 335,
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    loyaltyPointsEarned: 335,
    loyaltyPointsRedeemed: 0,
    paymentMethod: 'Visa •••• 4242',
    transactionId: 'tx_stripe_9841029384',
    createdAt: '2026-08-20T11:45:00Z',
  },
  {
    id: 'bk-205',
    pnr: 'SK-771920',
    userId: 'usr-alex',
    flightId: 'fl-205',
    flight: INITIAL_FLIGHTS[1], // SK 205
    cabinClass: 'business',
    passengers: [
      {
        id: 'pax-1',
        title: 'Mr',
        firstName: 'Alex',
        lastName: 'Mercer',
        dateOfBirth: '1992-05-14',
        gender: 'male',
        nationality: 'American',
        passportNumber: 'US89412093',
        passportExpiry: '2030-11-20',
        email: 'alex.mercer@example.com',
        phone: '+1 (555) 234-8901',
        seatNumber: '4A',
        seatId: 'ac-a350-4A',
        seatPrice: 0,
      },
    ],
    selectedSeats: [
      {
        passengerId: 'pax-1',
        seatNumber: '4A',
        seatType: 'premium',
        price: 0,
      },
    ],
    fareBreakdown: {
      baseFare: 1450,
      taxes: 120,
      airportFees: 65,
      baggageFees: 0,
      seatSelectionFees: 0,
      insuranceFee: 25,
      carbonOffsetFee: 10,
      loyaltyDiscount: 0,
      totalAmount: 1670,
    },
    totalAmount: 1670,
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    loyaltyPointsEarned: 1670,
    loyaltyPointsRedeemed: 0,
    paymentMethod: 'Mastercard •••• 8812',
    transactionId: 'tx_stripe_7719203810',
    createdAt: '2026-08-25T14:10:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-alex',
    title: '🎉 Booking Confirmed — SK 301',
    message: 'Your flight from Karachi (KHI) to Dubai (DXB) is confirmed. PNR: SK-948271.',
    type: 'booking_confirmed',
    read: false,
    createdAt: '2026-08-27T10:00:00Z',
    actionLink: 'bookings',
  },
  {
    id: 'notif-2',
    userId: 'usr-alex',
    title: '✨ 335 Loyalty Points Credited!',
    message: 'Congratulations! 335 SkyMiles points have been deposited to your account balance.',
    type: 'loyalty_earned',
    read: false,
    createdAt: '2026-08-27T10:02:00Z',
    actionLink: 'rewards',
  },
  {
    id: 'notif-3',
    userId: 'usr-alex',
    title: '✈️ Flight SK 301 is now In Air',
    message: 'Aircraft Boeing 787-9 has departed and is cruising smoothly. ETA: 12:15 PM.',
    type: 'boarding_alert',
    read: true,
    createdAt: '2026-08-27T10:35:00Z',
    actionLink: 'tracker',
  },
];
