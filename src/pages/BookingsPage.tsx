import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, Client } from '../types';
import { formatCurrency } from '../utils/storage';

interface BookingsPageProps {
  bookings: Booking[];
  clients: Client[];
  onOpenNewBooking: () => void;
  onViewBooking: (b: Booking) => void;
  onEditBooking: (b: Booking) => void;
  onDeleteBooking: (b: Booking) => void;
  onChangeStatus: (bookingId: string, newStatus: BookingStatus) => void;
  currency: string;
}

export const BookingsPage: React.FC<BookingsPageProps> = ({
  bookings,
  clients,
  onOpenNewBooking,
  onViewBooking,
  onEditBooking,
  onDeleteBooking,
  onChangeStatus,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        if (statusFilter !== 'All' && b.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const client = clients.find((c) => c.id === b.clientId);
          const clientName = client ? client.name.toLowerCase() : '';
          return (
            clientName.includes(q) ||
            b.serviceType.toLowerCase().includes(q) ||
            (b.notes && b.notes.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
  }, [bookings, clients, statusFilter, searchQuery]);

  const getClient = (clientId: string) => clients.find((c) => c.id === clientId);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-slate-700">
          Total Bookings: {bookings.length}
        </div>
        <button
          onClick={onOpenNewBooking}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-3 rounded-lg cursor-pointer transition-colors"
        >
          + New Booking
        </button>
      </div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client or service..."
          className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-800"
        />
      </div>

      {/* Status Filter Horizontal Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
        {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium cursor-pointer transition-colors ${
              statusFilter === st
                ? 'bg-emerald-800 text-white font-bold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-2">
        {filteredBookings.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No bookings found.
          </div>
        ) : (
          filteredBookings.map((b) => {
            const client = getClient(b.clientId);
            return (
              <div
                key={b.id}
                onClick={() => onViewBooking(b)}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {b.serviceType}
                    </h3>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Client: <span className="font-semibold">{client ? client.name : 'Unknown'}</span>
                    </div>
                  </div>
                  <div>{getStatusBadge(b.status)}</div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Date: <span className="font-medium text-slate-700">{b.serviceDate}</span>
                    {b.serviceTime ? ` (${b.serviceTime})` : ''}
                  </div>
                  <div className="font-bold text-slate-900">
                    {formatCurrency(b.charge, currency)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
