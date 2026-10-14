import { Client, Booking, EarningsSummaryData } from '../types';

const CLIENTS_STORAGE_KEY = 'cleaning_service_clients_v1';
const BOOKINGS_STORAGE_KEY = 'cleaning_service_bookings_v1';
const CURRENCY_KEY = 'cleaning_service_currency_v1';

// Seed data based strictly on the documentation's example values
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Sarah Nakato',
    phone: '+256 701 234 567',
    address: 'Plot 14 Kyadondo Road, Nakasero, Kampala',
    notes: 'Regular residential cleaning client. Prefers eco-friendly detergents.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'client-2',
    name: 'David Ochieng',
    phone: '+256 772 987 654',
    address: 'Block B, Victoria Heights, Kololo',
    notes: 'Office suite & conference rooms. High pile carpets.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'client-3',
    name: 'Grace Namubiru',
    phone: '+256 754 112 233',
    address: 'Apartment 402, Acacia Boulevard, Bukoto',
    notes: 'Move-in deep sanitize. Has marble kitchen countertops.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'client-4',
    name: 'Brian Mukasa',
    phone: '+256 788 445 566',
    address: 'Entebbe Road, Lubowa Estate',
    notes: 'Post-construction dust cleanup.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// Reflecting the documentation's figures:
// Pending: UGX 50,000
// Confirmed: UGX 80,000
// Completed: UGX 40,000
// Cancelled: UGX 30,000
// Example Expected Earnings = UGX 170,000
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    clientId: 'client-1',
    serviceType: 'Residential Standard Clean',
    serviceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    serviceTime: '09:00 AM',
    charge: 50000,
    status: 'Pending',
    notes: 'Living room, 2 bedrooms, kitchen and bathrooms.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'booking-2',
    clientId: 'client-2',
    serviceType: 'Office Suite Deep Sanitization',
    serviceDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    serviceTime: '01:30 PM',
    charge: 80000,
    status: 'Confirmed',
    notes: 'Access card provided at main reception. Disinfect all workstations.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'booking-3',
    clientId: 'client-3',
    serviceType: 'Move-in Detailed Cleaning',
    serviceDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    serviceTime: '10:00 AM',
    charge: 40000,
    status: 'Completed',
    notes: 'Balcony windows polished and kitchen grease degreased. Client signed off happily.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'booking-4',
    clientId: 'client-4',
    serviceType: 'Post-renovation Window Washing',
    serviceDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    serviceTime: '02:00 PM',
    charge: 30000,
    status: 'Cancelled',
    notes: 'Client rescheduled renovation timeline. Not charged.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load clients from localStorage:', err);
    return INITIAL_CLIENTS;
  }
}

export function saveClients(clients: Client[]): void {
  try {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  } catch (err) {
    console.error('Failed to save clients:', err);
  }
}

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load bookings from localStorage:', err);
    return INITIAL_BOOKINGS;
  }
}

export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('Failed to save bookings:', err);
  }
}

export function getCurrency(): string {
  return localStorage.getItem(CURRENCY_KEY) || 'UGX';
}

export function setCurrency(currency: string): void {
  localStorage.setItem(CURRENCY_KEY, currency);
}

export function resetToSampleData(): { clients: Client[]; bookings: Booking[] } {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
  return { clients: INITIAL_CLIENTS, bookings: INITIAL_BOOKINGS };
}

/**
 * Expected Earnings calculation according to Section 9:
 * "The app's proposed expected-earnings calculation is the sum of the charges for all bookings whose
 * status is Pending, Confirmed, or Completed. Cancelled bookings are excluded."
 */
export function calculateEarningsSummary(bookings: Booking[]): EarningsSummaryData {
  let pendingCount = 0;
  let confirmedCount = 0;
  let completedCount = 0;
  let cancelledCount = 0;

  let pendingEarnings = 0;
  let confirmedEarnings = 0;
  let completedEarnings = 0;
  let cancelledCharges = 0;

  bookings.forEach((booking) => {
    const charge = Number(booking.charge) || 0;
    switch (booking.status) {
      case 'Pending':
        pendingCount++;
        pendingEarnings += charge;
        break;
      case 'Confirmed':
        confirmedCount++;
        confirmedEarnings += charge;
        break;
      case 'Completed':
        completedCount++;
        completedEarnings += charge;
        break;
      case 'Cancelled':
        cancelledCount++;
        cancelledCharges += charge;
        break;
    }
  });

  const expectedEarnings = pendingEarnings + confirmedEarnings + completedEarnings;

  return {
    expectedEarnings,
    totalBookings: bookings.length,
    pendingCount,
    confirmedCount,
    completedCount,
    cancelledCount,
    pendingEarnings,
    confirmedEarnings,
    completedEarnings,
    cancelledCharges,
  };
}

export function formatCurrency(amount: number, currency: string = 'UGX'): string {
  const formattedNumber = new Intl.NumberFormat('en-US').format(Math.round(amount));
  return `${currency} ${formattedNumber}`;
}
