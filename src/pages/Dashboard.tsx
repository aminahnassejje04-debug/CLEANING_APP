import React from 'react';
import { Booking, Client, ActivePage } from '../types';
import { calculateEarningsSummary, formatCurrency } from '../utils/storage';

interface DashboardProps {
  clients: Client[];
  bookings: Booking[];
  setActivePage: (page: ActivePage) => void;
  onOpenNewBooking: () => void;
  onOpenNewClient: () => void;
  onViewBooking: (b: Booking) => void;
  currency: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  clients,
  bookings,
  setActivePage,
  onOpenNewBooking,
  onOpenNewClient,
  onViewBooking,
  currency,
}) => {
  const summary = calculateEarningsSummary(bookings);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getClientName = (clientId: string) => {
    const c = clients.find((client) => client.id === clientId);
    return c ? c.name : 'Unknown Client';
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview Card with Expected Earnings */}
      <div className="bg-emerald-800 text-white p-4 rounded-xl shadow-xs">
        <div className="text-xs font-semibold text-emerald-200 uppercase">
          Expected Earnings
        </div>
        <div className="text-2xl font-bold mt-1 tracking-tight">
          {formatCurrency(summary.expectedEarnings, currency)}
        </div>
        <p className="text-xs text-emerald-100 mt-1">
          Sum of Pending, Confirmed, and Completed bookings. Cancelled excluded.
        </p>

        <div className="mt-3 pt-3 border-t border-emerald-700/80 flex items-center justify-between text-xs text-emerald-100">
          <span>Excluded (Cancelled):</span>
          <span className="font-semibold text-emerald-200">
            {formatCurrency(summary.cancelledCharges, currency)}
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActivePage('clients')}
          className="bg-white p-3 rounded-xl border border-slate-200 text-left cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="text-xs text-slate-500 font-medium">Clients</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">{clients.length}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">View list &rarr;</div>
        </button>

        <button
          onClick={() => setActivePage('bookings')}
          className="bg-white p-3 rounded-xl border border-slate-200 text-left cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="text-xs text-slate-500 font-medium">Bookings</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">{bookings.length}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">View list &rarr;</div>
        </button>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
          <div className="text-xs text-slate-500 font-medium">Pending</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">{summary.pendingCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Awaiting review</div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenNewBooking}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center cursor-pointer transition-colors"
        >
          + New Booking
        </button>
        <button
          onClick={onOpenNewClient}
          className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-2.5 px-3 rounded-xl border border-slate-300 text-xs text-center cursor-pointer transition-colors"
        >
          + Add Client
        </button>
      </div>

      {/* Mobile Install & Offline Info Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between gap-2">
        <div>
          <span className="font-bold text-emerald-900 block">Install as Mobile App</span>
          <span className="text-emerald-700 text-[11px] block mt-0.5">
            Works offline &bull; Tap &ldquo;Install&rdquo; in top bar or browser menu
          </span>
        </div>
        <span className="text-[10px] font-bold bg-emerald-800 text-white px-2 py-1 rounded shrink-0">
          PWA Ready
        </span>
      </div>

      {/* Status Breakdown Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Booking Counts by Status
          </h2>
          <button
            onClick={() => setActivePage('earnings')}
            className="text-xs text-emerald-800 font-bold hover:underline"
          >
            Full Details &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
            <span className="text-slate-600">Pending:</span>
            <span className="font-bold text-slate-800">{summary.pendingCount}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
            <span className="text-slate-600">Confirmed:</span>
            <span className="font-bold text-slate-800">{summary.confirmedCount}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
            <span className="text-slate-600">Completed:</span>
            <span className="font-bold text-slate-800">{summary.completedCount}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
            <span className="text-slate-600">Cancelled:</span>
            <span className="font-bold text-rose-700">{summary.cancelledCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Recent Bookings
          </h2>
          <button
            onClick={() => setActivePage('bookings')}
            className="text-xs text-emerald-800 font-bold hover:underline"
          >
            See All ({bookings.length})
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No bookings recorded yet. Tap "+ New Booking" to add one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onViewBooking(b)}
                className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{b.serviceType}</div>
                  <div className="text-slate-500">
                    {getClientName(b.clientId)} &bull; {b.serviceDate}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-bold text-slate-900">
                    {formatCurrency(b.charge, currency)}
                  </div>
                  <div>{getStatusBadge(b.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
