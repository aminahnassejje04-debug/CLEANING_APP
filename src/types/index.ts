export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  serviceType: string;
  serviceDate: string; // YYYY-MM-DD
  serviceTime?: string; // e.g. '09:00 AM'
  charge: number; // numeric, non-negative
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export type ActivePage = 'dashboard' | 'bookings' | 'clients' | 'earnings';

export interface EarningsSummaryData {
  expectedEarnings: number;
  totalBookings: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  pendingEarnings: number;
  confirmedEarnings: number;
  completedEarnings: number;
  cancelledCharges: number;
}
