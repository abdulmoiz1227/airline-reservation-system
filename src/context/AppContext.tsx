import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Airport,
  Aircraft,
  Flight,
  User,
  LoyaltyAccount,
  LoyaltyTransaction,
  Booking,
  Notification,
  SearchFlightParams,
  Seat,
  CabinClass,
  Passenger,
  BookingFareBreakdown,
  FlightStatus,
} from '../types';
import {
  INITIAL_AIRPORTS,
  INITIAL_AIRCRAFTS,
  INITIAL_FLIGHTS,
  DEMO_USERS,
  INITIAL_LOYALTY_ACCOUNTS,
  INITIAL_LOYALTY_TRANSACTIONS,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  generateSeatsForAircraft,
} from '../data/mockData';

export type ActiveTab =
  | 'dashboard'
  | 'search'
  | 'schedule'
  | 'bookings'
  | 'tracker'
  | 'rewards'
  | 'profile'
  | 'notifications'
  | 'admin';

interface AppContextType {
  // Navigation & Active View
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  adminSubTab: string;
  setAdminSubTab: (tab: string) => void;

  // Auth & User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
  login: (email: string, password?: string) => boolean;
  signup: (userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password?: string }) => void;
  logout: () => void;
  updateUserProfile: (updated: Partial<User>) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot' | 'reset';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot' | 'reset') => void;

  // Data Collections
  airports: Airport[];
  aircrafts: Aircraft[];
  flights: Flight[];
  bookings: Booking[];
  notifications: Notification[];
  loyaltyAccounts: Record<string, LoyaltyAccount>;
  loyaltyTransactions: LoyaltyTransaction[];

  // Seat Management & Holds
  flightSeatsMap: Record<string, Seat[]>; // flightId -> Seat[]
  getFlightSeats: (flightId: string) => Seat[];
  holdSeat: (flightId: string, seatNumber: string, userId: string) => boolean;
  releaseSeat: (flightId: string, seatNumber: string) => void;
  releaseAllUserHolds: (flightId: string, userId: string) => void;

  // Booking Flow State (Step 1-6)
  bookingStep: number; // 1: Search, 2: Select Flight, 3: Seat, 4: Passenger, 5: Payment, 6: Confirmation
  setBookingStep: (step: number) => void;
  searchParams: SearchFlightParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchFlightParams>>;
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  selectedCabinClass: CabinClass;
  setSelectedCabinClass: (cabin: CabinClass) => void;
  selectedSeatNumbers: string[]; // for each passenger
  setSelectedSeatNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
  addOns: {
    insurance: boolean;
    carbonOffset: boolean;
    extraBaggageCount: number;
    mealSelection: string;
  };
  setAddOns: React.Dispatch<React.SetStateAction<{
    insurance: boolean;
    carbonOffset: boolean;
    extraBaggageCount: number;
    mealSelection: string;
  }>>;
  redeemedPoints: number;
  setRedeemedPoints: (points: number) => void;
  activeHoldExpiresAt: number | null; // epoch timestamp
  calculateFareBreakdown: () => BookingFareBreakdown;
  startBookingForFlight: (flight: Flight, cabin?: CabinClass) => void;
  completeBookingPayment: (paymentMethodString: string) => Promise<Booking>;
  resetBookingFlow: () => void;
  latestConfirmedBooking: Booking | null;
  setLatestConfirmedBooking: (b: Booking | null) => void;

  // Ticket & Boarding Pass View Modal
  ticketModalBooking: Booking | null;
  setTicketModalBooking: (b: Booking | null) => void;

  // Flight Tracking state
  trackedFlight: Flight | null;
  setTrackedFlight: (f: Flight | null) => void;
  trackFlightByQuery: (query: string) => Flight | null;

  // My Bookings Actions
  cancelBooking: (bookingId: string) => boolean;

  // Notifications Actions
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;

  // Loyalty Program Config & Actions
  pointsPerDollar: number;
  setPointsPerDollar: (rate: number) => void;
  userLoyaltyAccount: LoyaltyAccount | undefined;
  adminAdjustPoints: (userId: string, points: number, reason: string) => void;

  // Admin Operations
  createFlight: (flightData: Omit<Flight, 'id' | 'origin' | 'destination'>) => void;
  updateFlight: (flightId: string, updates: Partial<Flight>) => void;
  updateFlightStatus: (flightId: string, status: FlightStatus, delayMinutes?: number, gate?: string) => void;
  cancelFlightByAdmin: (flightId: string) => void;
  toggleSeatBlock: (flightId: string, seatNumber: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'skylink_airline_app_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or persisted state
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  };

  const savedData = loadSavedState();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [adminSubTab, setAdminSubTab] = useState<string>('analytics');

  // Users
  const [allUsers, setAllUsers] = useState<User[]>(savedData?.allUsers || DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(
    savedData?.currentUser !== undefined ? savedData.currentUser : DEMO_USERS[0]
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');

  // Core Data
  const [airports] = useState<Airport[]>(savedData?.airports || INITIAL_AIRPORTS);
  const [aircrafts] = useState<Aircraft[]>(savedData?.aircrafts || INITIAL_AIRCRAFTS);
  const [flights, setFlights] = useState<Flight[]>(savedData?.flights || INITIAL_FLIGHTS);
  const [bookings, setBookings] = useState<Booking[]>(savedData?.bookings || INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<Notification[]>(
    savedData?.notifications || INITIAL_NOTIFICATIONS
  );
  const [loyaltyAccounts, setLoyaltyAccounts] = useState<Record<string, LoyaltyAccount>>(
    savedData?.loyaltyAccounts || INITIAL_LOYALTY_ACCOUNTS
  );
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(
    savedData?.loyaltyTransactions || INITIAL_LOYALTY_TRANSACTIONS
  );
  const [pointsPerDollar, setPointsPerDollar] = useState<number>(savedData?.pointsPerDollar || 1);

  // Seat maps per flight
  const [flightSeatsMap, setFlightSeatsMap] = useState<Record<string, Seat[]>>(() => {
    if (savedData?.flightSeatsMap) return savedData.flightSeatsMap;
    const initialMap: Record<string, Seat[]> = {};
    INITIAL_FLIGHTS.forEach((fl) => {
      initialMap[fl.id] = generateSeatsForAircraft(fl.aircraftId);
    });
    return initialMap;
  });

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [searchParams, setSearchParams] = useState<SearchFlightParams>({
    originCode: 'KHI',
    destinationCode: 'DXB',
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    tripType: 'one-way',
    passengersCount: 1,
    cabinClass: 'economy',
  });
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedCabinClass, setSelectedCabinClass] = useState<CabinClass>('economy');
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: 'pax-1',
      title: 'Mr',
      firstName: currentUser ? currentUser.name.split(' ')[0] : 'Alex',
      lastName: currentUser ? currentUser.name.split(' ').slice(1).join(' ') || 'Mercer' : 'Mercer',
      dateOfBirth: currentUser?.dateOfBirth || '1992-05-14',
      gender: 'male',
      nationality: currentUser?.nationality || 'American',
      passportNumber: currentUser?.passportNumber || 'US89412093',
      passportExpiry: currentUser?.passportExpiry || '2030-11-20',
      email: currentUser?.email || 'alex.mercer@example.com',
      phone: currentUser?.phone || '+1 (555) 234-8901',
    },
  ]);
  const [addOns, setAddOns] = useState({
    insurance: false,
    carbonOffset: false,
    extraBaggageCount: 0,
    mealSelection: 'Standard Non-Vegetarian',
  });
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);
  const [activeHoldExpiresAt, setActiveHoldExpiresAt] = useState<number | null>(null);
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState<Booking | null>(null);
  const [ticketModalBooking, setTicketModalBooking] = useState<Booking | null>(null);
  const [trackedFlight, setTrackedFlight] = useState<Flight | null>(INITIAL_FLIGHTS[0]);

  // Persist key state to localStorage
  useEffect(() => {
    const dataToSave = {
      allUsers,
      currentUser,
      flights,
      bookings,
      notifications,
      loyaltyAccounts,
      loyaltyTransactions,
      pointsPerDollar,
      flightSeatsMap,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // storage quota
    }
  }, [
    allUsers,
    currentUser,
    flights,
    bookings,
    notifications,
    loyaltyAccounts,
    loyaltyTransactions,
    pointsPerDollar,
    flightSeatsMap,
  ]);

  // Check and auto-release expired seat holds every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      let changed = false;
      const updatedMap = { ...flightSeatsMap };

      Object.keys(updatedMap).forEach((fId) => {
        const seats = updatedMap[fId];
        const newSeats = seats.map((seat) => {
          if (seat.status === 'held' && seat.heldUntil && seat.heldUntil < currentTime) {
            changed = true;
            return {
              ...seat,
              status: 'available' as const,
              heldUntil: undefined,
              heldByUserId: undefined,
            };
          }
          return seat;
        });
        if (changed) {
          updatedMap[fId] = newSeats;
        }
      });

      if (changed) {
        setFlightSeatsMap(updatedMap);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [flightSeatsMap]);

  // Seat hold logic
  const getFlightSeats = (flightId: string): Seat[] => {
    if (flightSeatsMap[flightId]) {
      return flightSeatsMap[flightId];
    }
    const flight = flights.find((f) => f.id === flightId);
    const newSeats = generateSeatsForAircraft(flight?.aircraftId || 'ac-b789');
    setFlightSeatsMap((prev) => ({ ...prev, [flightId]: newSeats }));
    return newSeats;
  };

  const holdSeat = (flightId: string, seatNumber: string, userId: string): boolean => {
    const currentSeats = getFlightSeats(flightId);
    const targetSeat = currentSeats.find((s) => s.seatNumber === seatNumber);

    if (!targetSeat) return false;
    // Check if occupied or blocked or already held by another user
    if (targetSeat.status === 'occupied' || targetSeat.status === 'blocked') {
      return false;
    }
    if (
      targetSeat.status === 'held' &&
      targetSeat.heldByUserId &&
      targetSeat.heldByUserId !== userId &&
      targetSeat.heldUntil &&
      targetSeat.heldUntil > Date.now()
    ) {
      return false;
    }

    const holdUntilTimestamp = Date.now() + 10 * 60 * 1000; // 10 minute lock

    setFlightSeatsMap((prev) => ({
      ...prev,
      [flightId]: (prev[flightId] || currentSeats).map((s) =>
        s.seatNumber === seatNumber
          ? {
              ...s,
              status: 'held',
              heldUntil: holdUntilTimestamp,
              heldByUserId: userId,
            }
          : s
      ),
    }));

    setActiveHoldExpiresAt(holdUntilTimestamp);
    return true;
  };

  const releaseSeat = (flightId: string, seatNumber: string) => {
    setFlightSeatsMap((prev) => {
      if (!prev[flightId]) return prev;
      return {
        ...prev,
        [flightId]: prev[flightId].map((s) =>
          s.seatNumber === seatNumber && s.status === 'held'
            ? {
                ...s,
                status: 'available',
                heldUntil: undefined,
                heldByUserId: undefined,
              }
            : s
        ),
      };
    });
  };

  const releaseAllUserHolds = (flightId: string, userId: string) => {
    setFlightSeatsMap((prev) => {
      if (!prev[flightId]) return prev;
      return {
        ...prev,
        [flightId]: prev[flightId].map((s) =>
          s.heldByUserId === userId && s.status === 'held'
            ? {
                ...s,
                status: 'available',
                heldUntil: undefined,
                heldByUserId: undefined,
              }
            : s
        ),
      };
    });
  };

  // Auth Operations
  const login = (email: string, _password?: string): boolean => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const signup = (userData: Omit<User, 'id' | 'role' | 'createdAt'> & { password?: string }) => {
    const newUserId = `usr-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newUserId,
      role: 'customer',
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      preferences: {
        seatPreference: 'window',
        mealPreference: 'Standard Non-Vegetarian',
        currency: 'USD',
        emailNotifications: true,
        smsNotifications: true,
        language: 'English (US)',
      },
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Initialize loyalty account to 0 points
    setLoyaltyAccounts((prev) => ({
      ...prev,
      [newUserId]: {
        userId: newUserId,
        pointsBalance: 0,
        lifetimePoints: 0,
        pointsRedeemed: 0,
        tier: 'Blue',
        tierProgress: 0,
        milesTravelled: 0,
      },
    }));

    // Welcome Notification
    addNotification({
      userId: newUserId,
      title: '👋 Welcome to SkyLink Airlines!',
      message: 'Your account is ready. Search flights, pick seats, and earn loyalty points on every journey.',
      type: 'booking_confirmed',
      actionLink: 'search',
    });

    setAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  // Fare calculation
  const calculateFareBreakdown = (): BookingFareBreakdown => {
    if (!selectedFlight) {
      return {
        baseFare: 0,
        taxes: 0,
        airportFees: 0,
        baggageFees: 0,
        seatSelectionFees: 0,
        insuranceFee: 0,
        carbonOffsetFee: 0,
        loyaltyDiscount: 0,
        totalAmount: 0,
      };
    }

    const paxCount = passengers.length || 1;
    const basePricePerPax = selectedFlight.basePrices[selectedCabinClass] || selectedFlight.basePrices.economy;
    const baseFare = basePricePerPax * paxCount;
    const taxes = Math.round(baseFare * 0.12);
    const airportFees = 25 * paxCount;
    const baggageFees = addOns.extraBaggageCount * 45;

    // Calculate seat selection fees
    let seatFees = 0;
    const flightSeats = getFlightSeats(selectedFlight.id);
    selectedSeatNumbers.forEach((seatNum) => {
      const seat = flightSeats.find((s) => s.seatNumber === seatNum);
      if (seat && seat.priceModifier) {
        seatFees += seat.priceModifier;
      }
    });

    const insuranceFee = addOns.insurance ? 20 * paxCount : 0;
    const carbonOffsetFee = addOns.carbonOffset ? 6 * paxCount : 0;

    // Loyalty points discount: 1000 points = $10 discount
    const loyaltyDiscount = Math.floor(redeemedPoints / 100);

    const subTotal = baseFare + taxes + airportFees + baggageFees + seatFees + insuranceFee + carbonOffsetFee;
    const totalAmount = Math.max(0, subTotal - loyaltyDiscount);

    return {
      baseFare,
      taxes,
      airportFees,
      baggageFees,
      seatSelectionFees: seatFees,
      insuranceFee,
      carbonOffsetFee,
      loyaltyDiscount,
      totalAmount,
    };
  };

  // Start booking wizard for a specific flight
  const startBookingForFlight = (flight: Flight, cabin: CabinClass = 'economy') => {
    setSelectedFlight(flight);
    setSelectedCabinClass(cabin);
    setSelectedSeatNumbers([]);
    setBookingStep(3); // jump directly to seat selection step
    setActiveTab('search');

    // Initialize passenger list based on search count
    const count = searchParams.passengersCount || 1;
    const initialPaxList: Passenger[] = [];
    for (let i = 0; i < count; i++) {
      if (i === 0 && currentUser) {
        initialPaxList.push({
          id: `pax-${i + 1}`,
          title: 'Mr',
          firstName: currentUser.name.split(' ')[0] || 'Alex',
          lastName: currentUser.name.split(' ').slice(1).join(' ') || 'Mercer',
          dateOfBirth: currentUser.dateOfBirth || '1992-05-14',
          gender: 'male',
          nationality: currentUser.nationality || 'American',
          passportNumber: currentUser.passportNumber || 'US89412093',
          passportExpiry: currentUser.passportExpiry || '2030-11-20',
          email: currentUser.email || 'alex.mercer@example.com',
          phone: currentUser.phone || '+1 (555) 234-8901',
        });
      } else {
        initialPaxList.push({
          id: `pax-${i + 1}`,
          title: 'Ms',
          firstName: '',
          lastName: '',
          dateOfBirth: '1995-01-01',
          gender: 'female',
          nationality: 'American',
          passportNumber: '',
          passportExpiry: '2032-01-01',
          email: '',
          phone: '',
        });
      }
    }
    setPassengers(initialPaxList);
  };

  // Complete Payment & Award Loyalty Points
  const completeBookingPayment = async (paymentMethodString: string): Promise<Booking> => {
    if (!selectedFlight) throw new Error('No flight selected');
    const breakdown = calculateFareBreakdown();
    const userId = currentUser ? currentUser.id : 'usr-guest';

    // Generate clean PNR
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const pnr = `SK-${randomDigits}`;

    // Map passenger seats
    const flightSeats = getFlightSeats(selectedFlight.id);
    const confirmedPassengers: Passenger[] = passengers.map((pax, idx) => {
      const seatNum = selectedSeatNumbers[idx] || '14B';
      const seatObj = flightSeats.find((s) => s.seatNumber === seatNum);
      return {
        ...pax,
        seatNumber: seatNum,
        seatId: seatObj?.id,
        seatPrice: seatObj?.priceModifier || 0,
      };
    });

    const selectedSeatsSummary = confirmedPassengers.map((pax) => {
      const seatObj = flightSeats.find((s) => s.seatNumber === pax.seatNumber);
      return {
        passengerId: pax.id,
        seatNumber: pax.seatNumber || '14B',
        seatType: seatObj?.seatType || 'standard',
        price: seatObj?.priceModifier || 0,
      };
    });

    // Calculate loyalty points earned based on configurable rate and user tier
    const userAcc = userId !== 'usr-guest' ? loyaltyAccounts[userId] : null;
    let tierMultiplier = 1.0;
    if (userAcc?.tier === 'Silver') tierMultiplier = 1.1;
    if (userAcc?.tier === 'Gold') tierMultiplier = 1.25;
    if (userAcc?.tier === 'Platinum') tierMultiplier = 1.5;

    const pointsEarned = Math.round(breakdown.totalAmount * pointsPerDollar * tierMultiplier);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      pnr,
      userId,
      flightId: selectedFlight.id,
      flight: selectedFlight,
      cabinClass: selectedCabinClass,
      passengers: confirmedPassengers,
      selectedSeats: selectedSeatsSummary,
      fareBreakdown: breakdown,
      totalAmount: breakdown.totalAmount,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsRedeemed: redeemedPoints,
      paymentMethod: paymentMethodString,
      transactionId: `tx_stripe_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // 1. Permanently update seats to occupied
    setFlightSeatsMap((prev) => {
      const current = prev[selectedFlight.id] || [];
      return {
        ...prev,
        [selectedFlight.id]: current.map((seat) => {
          if (selectedSeatNumbers.includes(seat.seatNumber)) {
            return {
              ...seat,
              status: 'occupied',
              heldUntil: undefined,
              heldByUserId: undefined,
            };
          }
          return seat;
        }),
      };
    });

    // 2. Decrement available seats count on flight
    setFlights((prev) =>
      prev.map((fl) => {
        if (fl.id === selectedFlight.id) {
          const bookedCount = confirmedPassengers.length;
          return {
            ...fl,
            availableSeats: {
              ...fl.availableSeats,
              [selectedCabinClass]: Math.max(0, fl.availableSeats[selectedCabinClass] - bookedCount),
              total: Math.max(0, fl.availableSeats.total - bookedCount),
            },
          };
        }
        return fl;
      })
    );

    // 3. Save booking record
    setBookings((prev) => [newBooking, ...prev]);
    setLatestConfirmedBooking(newBooking);

    // 4. Update Loyalty Balance & Ledger (ONLY after successful payment!)
    if (userId !== 'usr-guest') {
      const currentAcc = loyaltyAccounts[userId] || {
        userId,
        pointsBalance: 0,
        lifetimePoints: 0,
        pointsRedeemed: 0,
        tier: 'Blue',
        tierProgress: 0,
        milesTravelled: 0,
      };

      const newBalance = currentAcc.pointsBalance - redeemedPoints + pointsEarned;
      const newLifetime = currentAcc.lifetimePoints + pointsEarned;
      const newRedeemed = currentAcc.pointsRedeemed + redeemedPoints;
      const milesAdded = Math.round(selectedFlight.durationMinutes * 9.2);

      // Determine updated tier
      let newTier: 'Blue' | 'Silver' | 'Gold' | 'Platinum' = 'Blue';
      let tierProgress = 0;
      if (newLifetime >= 10000) {
        newTier = 'Platinum';
        tierProgress = 100;
      } else if (newLifetime >= 5000) {
        newTier = 'Gold';
        tierProgress = Math.min(100, Math.round(((newLifetime - 5000) / 5000) * 100));
      } else if (newLifetime >= 2000) {
        newTier = 'Silver';
        tierProgress = Math.min(100, Math.round(((newLifetime - 2000) / 3000) * 100));
      } else {
        tierProgress = Math.min(100, Math.round((newLifetime / 2000) * 100));
      }

      setLoyaltyAccounts((prev) => ({
        ...prev,
        [userId]: {
          ...currentAcc,
          pointsBalance: newBalance,
          lifetimePoints: newLifetime,
          pointsRedeemed: newRedeemed,
          tier: newTier,
          tierProgress,
          milesTravelled: currentAcc.milesTravelled + milesAdded,
        },
      }));

      // Create transaction logs
      const transactionsToAdd: LoyaltyTransaction[] = [];
      if (redeemedPoints > 0) {
        transactionsToAdd.push({
          id: `lt-${Date.now()}-red`,
          userId,
          bookingId: newBooking.id,
          bookingPnr: newBooking.pnr,
          points: -redeemedPoints,
          transactionType: 'REDEEM_DISCOUNT',
          description: `Redeemed ${redeemedPoints} pts for $${breakdown.loyaltyDiscount} discount on ${selectedFlight.flightNumber}`,
          createdAt: new Date().toISOString(),
        });
      }

      if (pointsEarned > 0) {
        transactionsToAdd.push({
          id: `lt-${Date.now()}-earn`,
          userId,
          bookingId: newBooking.id,
          bookingPnr: newBooking.pnr,
          points: pointsEarned,
          transactionType: 'EARN_BOOKING',
          description: `Earned ${pointsEarned} pts for Flight ${selectedFlight.flightNumber} (${selectedFlight.origin.code} → ${selectedFlight.destination.code})`,
          createdAt: new Date().toISOString(),
        });
      }

      setLoyaltyTransactions((prev) => [...transactionsToAdd, ...prev]);

      // Notifications
      addNotification({
        userId,
        title: `🎉 Booking Confirmed — ${selectedFlight.flightNumber}`,
        message: `Your booking from ${selectedFlight.origin.city} to ${selectedFlight.destination.city} is confirmed. PNR: ${newBooking.pnr}`,
        type: 'booking_confirmed',
        actionLink: 'bookings',
      });

      if (pointsEarned > 0) {
        addNotification({
          userId,
          title: `✨ +${pointsEarned} Loyalty Points Credited!`,
          message: `Your flight payment was successful and ${pointsEarned} loyalty points have been added to your balance.`,
          type: 'loyalty_earned',
          actionLink: 'rewards',
        });
      }
    }

    setBookingStep(6); // Confirmation screen
    setActiveHoldExpiresAt(null);
    return newBooking;
  };

  const resetBookingFlow = () => {
    if (selectedFlight && currentUser) {
      releaseAllUserHolds(selectedFlight.id, currentUser.id);
    }
    setSelectedFlight(null);
    setSelectedSeatNumbers([]);
    setBookingStep(1);
    setRedeemedPoints(0);
    setActiveHoldExpiresAt(null);
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string): boolean => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || booking.bookingStatus === 'cancelled') return false;

    // 1. Release seats back to available
    setFlightSeatsMap((prev) => {
      const flightId = booking.flightId;
      const current = prev[flightId] || [];
      const bookedSeats = booking.selectedSeats.map((s) => s.seatNumber);
      return {
        ...prev,
        [flightId]: current.map((seat) =>
          bookedSeats.includes(seat.seatNumber) ? { ...seat, status: 'available' } : seat
        ),
      };
    });

    // 2. Restore flight available seat counts
    setFlights((prev) =>
      prev.map((fl) => {
        if (fl.id === booking.flightId) {
          const seatCount = booking.passengers.length;
          return {
            ...fl,
            availableSeats: {
              ...fl.availableSeats,
              [booking.cabinClass]: fl.availableSeats[booking.cabinClass] + seatCount,
              total: fl.availableSeats.total + seatCount,
            },
          };
        }
        return fl;
      })
    );

    // 3. Mark booking as cancelled & refunded
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              bookingStatus: 'cancelled',
              paymentStatus: 'refunded',
              isRefunded: true,
              refundedAmount: b.totalAmount,
            }
          : b
      )
    );

    // 4. Reverse Loyalty Points
    const userId = booking.userId;
    if (userId && loyaltyAccounts[userId]) {
      const acc = loyaltyAccounts[userId];
      const reversedPoints = booking.loyaltyPointsEarned || 0;
      const restoredPoints = booking.loyaltyPointsRedeemed || 0;
      const newBal = Math.max(0, acc.pointsBalance - reversedPoints + restoredPoints);

      setLoyaltyAccounts((prev) => ({
        ...prev,
        [userId]: {
          ...acc,
          pointsBalance: newBal,
          pointsRedeemed: Math.max(0, acc.pointsRedeemed - restoredPoints),
        },
      }));

      const reversalTx: LoyaltyTransaction = {
        id: `lt-${Date.now()}-rev`,
        userId,
        bookingId: booking.id,
        bookingPnr: booking.pnr,
        points: -reversedPoints,
        transactionType: 'POINTS_REVERSED',
        description: `Points reversed due to cancellation of Booking ${booking.pnr}`,
        createdAt: new Date().toISOString(),
      };

      setLoyaltyTransactions((prev) => [reversalTx, ...prev]);

      addNotification({
        userId,
        title: `🚫 Booking Cancelled & Refunded — ${booking.pnr}`,
        message: `Your booking for ${booking.flight.flightNumber} was cancelled. $${booking.totalAmount} has been refunded to your original payment method.`,
        type: 'cancellation_refund',
        actionLink: 'bookings',
      });
    }

    return true;
  };

  // Flight Tracking query
  const trackFlightByQuery = (query: string): Flight | null => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) return null;

    // Check by flight number
    const byFlightNo = flights.find(
      (f) =>
        f.flightNumber.replace(/\s+/g, '').toUpperCase() === cleanQuery.replace(/\s+/g, '') ||
        f.flightNumber.toUpperCase() === cleanQuery
    );
    if (byFlightNo) {
      setTrackedFlight(byFlightNo);
      return byFlightNo;
    }

    // Check by PNR
    const byBooking = bookings.find((b) => b.pnr.toUpperCase() === cleanQuery);
    if (byBooking) {
      setTrackedFlight(byBooking.flight);
      return byBooking.flight;
    }

    return null;
  };

  // Notifications
  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length
    : 0;

  // Loyalty Admin Adjustment
  const adminAdjustPoints = (userId: string, points: number, reason: string) => {
    const acc = loyaltyAccounts[userId] || {
      userId,
      pointsBalance: 0,
      lifetimePoints: 0,
      pointsRedeemed: 0,
      tier: 'Blue',
      tierProgress: 0,
      milesTravelled: 0,
    };

    const newBal = Math.max(0, acc.pointsBalance + points);
    const newLifetime = points > 0 ? acc.lifetimePoints + points : acc.lifetimePoints;

    setLoyaltyAccounts((prev) => ({
      ...prev,
      [userId]: {
        ...acc,
        pointsBalance: newBal,
        lifetimePoints: newLifetime,
      },
    }));

    const tx: LoyaltyTransaction = {
      id: `lt-${Date.now()}-adj`,
      userId,
      points,
      transactionType: 'ADMIN_ADJUSTMENT',
      description: `Manual adjustment by Airline Administration: ${reason}`,
      createdAt: new Date().toISOString(),
    };

    setLoyaltyTransactions((prev) => [tx, ...prev]);

    addNotification({
      userId,
      title: points >= 0 ? `✨ ${points} Bonus Points Awarded` : `⚠️ ${Math.abs(points)} Points Adjusted`,
      message: `Administrator notice: ${reason}`,
      type: 'loyalty_earned',
      actionLink: 'rewards',
    });
  };

  // Admin Flight operations
  const createFlight = (flightData: Omit<Flight, 'id' | 'origin' | 'destination'>) => {
    const origin = airports.find((a) => a.id === flightData.originAirportId) || airports[0];
    const destination = airports.find((a) => a.id === flightData.destinationAirportId) || airports[1];
    const newFlight: Flight = {
      ...flightData,
      id: `fl-${Date.now()}`,
      origin,
      destination,
      durationMinutes: 180,
      durationFormatted: '3h 00m',
      availableSeats: {
        economy: 120,
        business: 24,
        first: 8,
        total: 152,
      },
    };

    setFlights((prev) => [newFlight, ...prev]);
    // generate seat map
    setFlightSeatsMap((prev) => ({
      ...prev,
      [newFlight.id]: generateSeatsForAircraft(newFlight.aircraftId),
    }));
  };

  const updateFlight = (flightId: string, updates: Partial<Flight>) => {
    setFlights((prev) =>
      prev.map((fl) => {
        if (fl.id === flightId) {
          const updated = { ...fl, ...updates };
          if (updates.originAirportId) {
            updated.origin = airports.find((a) => a.id === updates.originAirportId) || fl.origin;
          }
          if (updates.destinationAirportId) {
            updated.destination =
              airports.find((a) => a.id === updates.destinationAirportId) || fl.destination;
          }
          return updated;
        }
        return fl;
      })
    );
  };

  const updateFlightStatus = (
    flightId: string,
    status: FlightStatus,
    delayMinutes?: number,
    gate?: string
  ) => {
    setFlights((prev) =>
      prev.map((fl) => {
        if (fl.id === flightId) {
          const updated = {
            ...fl,
            status,
            delayMinutes: delayMinutes !== undefined ? delayMinutes : fl.delayMinutes,
            gate: gate || fl.gate,
          };
          // Send notification to passengers with bookings on this flight
          const affectedBookings = bookings.filter(
            (b) => b.flightId === flightId && b.bookingStatus === 'confirmed'
          );
          affectedBookings.forEach((b) => {
            if (status === 'Delayed') {
              addNotification({
                userId: b.userId,
                title: `⚠️ Flight Delay Notice — ${fl.flightNumber}`,
                message: `Flight ${fl.flightNumber} has been delayed by ${delayMinutes || 30} minutes. Departure gate is ${updated.gate}.`,
                type: 'flight_delay',
                actionLink: 'tracker',
              });
            } else if (status === 'Boarding') {
              addNotification({
                userId: b.userId,
                title: `📢 Now Boarding — ${fl.flightNumber}`,
                message: `Gate ${updated.gate} is now open for boarding. Please proceed with your boarding pass.`,
                type: 'boarding_alert',
                actionLink: 'tracker',
              });
            } else if (status === 'Cancelled') {
              addNotification({
                userId: b.userId,
                title: `🚫 Flight Cancellation — ${fl.flightNumber}`,
                message: `Flight ${fl.flightNumber} has been cancelled by operations. Full refund processing is available.`,
                type: 'cancellation_refund',
                actionLink: 'bookings',
              });
            }
          });

          return updated;
        }
        return fl;
      })
    );
  };

  const cancelFlightByAdmin = (flightId: string) => {
    updateFlightStatus(flightId, 'Cancelled');
  };

  const toggleSeatBlock = (flightId: string, seatNumber: string) => {
    setFlightSeatsMap((prev) => {
      const current = prev[flightId] || [];
      return {
        ...prev,
        [flightId]: current.map((s) => {
          if (s.seatNumber === seatNumber) {
            return {
              ...s,
              status: s.status === 'blocked' ? 'available' : 'blocked',
            };
          }
          return s;
        }),
      };
    });
  };

  const userLoyaltyAccount = currentUser ? loyaltyAccounts[currentUser.id] : undefined;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        adminSubTab,
        setAdminSubTab,
        currentUser,
        setCurrentUser,
        allUsers,
        login,
        signup,
        logout,
        updateUserProfile,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        airports,
        aircrafts,
        flights,
        bookings,
        notifications,
        loyaltyAccounts,
        loyaltyTransactions,
        flightSeatsMap,
        getFlightSeats,
        holdSeat,
        releaseSeat,
        releaseAllUserHolds,
        bookingStep,
        setBookingStep,
        searchParams,
        setSearchParams,
        selectedFlight,
        setSelectedFlight,
        selectedCabinClass,
        setSelectedCabinClass,
        selectedSeatNumbers,
        setSelectedSeatNumbers,
        passengers,
        setPassengers,
        addOns,
        setAddOns,
        redeemedPoints,
        setRedeemedPoints,
        activeHoldExpiresAt,
        calculateFareBreakdown,
        startBookingForFlight,
        completeBookingPayment,
        resetBookingFlow,
        latestConfirmedBooking,
        setLatestConfirmedBooking,
        ticketModalBooking,
        setTicketModalBooking,
        trackedFlight,
        setTrackedFlight,
        trackFlightByQuery,
        cancelBooking,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        pointsPerDollar,
        setPointsPerDollar,
        userLoyaltyAccount,
        adminAdjustPoints,
        createFlight,
        updateFlight,
        updateFlightStatus,
        cancelFlightByAdmin,
        toggleSeatBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
