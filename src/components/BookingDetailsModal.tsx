import React from 'react';
import { Booking, BookingStatus, Client } from '../types';
import { formatCurrency } from '../utils/storage';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  client?: Client | null;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onChangeStatus: (bookingId: string, newStatus: BookingStatus) => void;
  currency: string;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  client,
  onEdit,
  onDelete,
  onChangeStatus,
  currency,
}) => {
  if (!isOpen || !booking) return null;

  const isIncluded = booking.status !== 'Cancelled';

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl text-xs">
        {/* Header */}
        <div className="px-4 py-3 bg-emerald-800 text-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">{booking.serviceType}</h2>
            <div className="text-[10px] text-emerald-200">ID: {booking.id}</div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-emerald-200 text-lg font-bold px-2 py-0.5 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3">
          {/* Status and Price banner */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Booking Status</div>
              <div className="mt-1">{getStatusBadge(booking.status)}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-medium">Agreed Charge</div>
              <div className="text-base font-bold text-slate-900">
                {formatCurrency(booking.charge, currency)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isIncluded ? 'Included in Expected' : 'Excluded from Expected'}
              </div>
            </div>
          </div>

          {/* Quick status change buttons */}
          <div>
            <div className="text-[11px] font-bold text-slate-700 uppercase mb-1.5">
              Change Status:
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onChangeStatus(booking.id, st)}
                  className={`py-1.5 text-xs font-semibold rounded border cursor-pointer transition-colors ${
                    booking.status === st
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Client info */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-700 uppercase">Client Details</div>
            {client ? (
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">{client.name}</div>
                <div className="text-slate-600">Phone: {client.phone}</div>
                <div className="text-slate-600">Location: {client.address}</div>
                {client.notes && (
                  <div className="text-slate-500 italic mt-1">&ldquo;{client.notes}&rdquo;</div>
                )}
              </div>
            ) : (
              <div className="text-rose-600">Client record not found</div>
            )}
          </div>

          {/* Schedule details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Service Date</div>
              <div className="font-bold text-slate-800 mt-0.5">{booking.serviceDate}</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Time Slot</div>
              <div className="font-bold text-slate-800 mt-0.5">
                {booking.serviceTime || 'Standard'}
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">
                Booking Notes
              </div>
              <p className="text-slate-700">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(booking)}
            className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-900 bg-white border border-rose-200 rounded font-semibold cursor-pointer"
          >
            Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded font-medium cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(booking)}
              className="px-3 py-1.5 text-xs text-white bg-emerald-800 hover:bg-emerald-900 rounded font-bold cursor-pointer"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
