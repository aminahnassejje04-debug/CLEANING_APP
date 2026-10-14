import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, Client } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookingData: Omit<Booking, 'id' | 'createdAt'> & { id?: string }) => void;
  clients: Client[];
  bookingToEdit?: Booking | null;
  onOpenNewClient: () => void;
  currency: string;
}

const COMMON_SERVICES = [
  'Standard Residential Clean',
  'Deep House Cleaning',
  'Move-In / Move-Out Clean',
  'Office Cleaning',
  'Post-Construction Clean',
  'Carpet & Upholstery Clean',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
  bookingToEdit,
  onOpenNewClient,
  currency,
}) => {
  const [clientId, setClientId] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('09:00 AM');
  const [charge, setCharge] = useState<string>('50000');
  const [status, setStatus] = useState<BookingStatus>('Pending');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (bookingToEdit) {
      setClientId(bookingToEdit.clientId);
      setServiceType(bookingToEdit.serviceType);
      setServiceDate(bookingToEdit.serviceDate);
      setServiceTime(bookingToEdit.serviceTime || '09:00 AM');
      setCharge(bookingToEdit.charge.toString());
      setStatus(bookingToEdit.status);
      setNotes(bookingToEdit.notes || '');
    } else {
      setClientId(clients.length > 0 ? clients[0].id : '');
      setServiceType('Standard Residential Clean');
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setServiceDate(tomorrow);
      setServiceTime('09:00 AM');
      setCharge('50000');
      setStatus('Pending');
      setNotes('');
    }
    setErrors({});
  }, [bookingToEdit, isOpen, clients]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!clientId) {
      errs.clientId = 'Please select a client for this booking.';
    }

    if (!serviceType.trim()) {
      errs.serviceType = 'Service description cannot be blank.';
    }

    if (!serviceDate) {
      errs.serviceDate = 'A service date is required.';
    }

    const numCharge = parseFloat(charge);
    if (isNaN(numCharge)) {
      errs.charge = 'Charge must be a numeric value.';
    } else if (numCharge < 0) {
      errs.charge = 'Charge cannot be negative.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: bookingToEdit ? bookingToEdit.id : undefined,
      clientId,
      serviceType: serviceType.trim(),
      serviceDate,
      serviceTime: serviceTime.trim() || undefined,
      charge: parseFloat(charge),
      status,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 bg-emerald-800 text-white flex items-center justify-between">
          <h2 className="text-sm font-bold">
            {bookingToEdit ? 'Edit Booking' : 'New Booking'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-emerald-200 text-lg font-bold px-2 py-0.5 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3 text-xs">
          {/* Select Client */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Client *</label>
              <button
                type="button"
                onClick={onOpenNewClient}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                + New Client
              </button>
            </div>
            {clients.length === 0 ? (
              <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded">
                No clients yet. Please add a client first.
              </div>
            ) : (
              <select
                aria-label="Client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className={`w-full p-2 bg-white border rounded text-xs focus:outline-hidden ${
                  errors.clientId ? 'border-rose-500' : 'border-slate-300'
                }`}
              >
                <option value="" disabled>
                  -- Select a Client --
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            )}
            {errors.clientId && (
              <p className="text-rose-600 mt-1 font-medium">{errors.clientId}</p>
            )}
          </div>

          {/* Service Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Service Description *</label>
            <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g. Standard Residential Clean"
              className={`w-full p-2 border rounded text-xs focus:outline-hidden ${
                errors.serviceType ? 'border-rose-500' : 'border-slate-300'
              }`}
            />
            {/* Quick choices */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {COMMON_SERVICES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setServiceType(s)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.serviceType && (
              <p className="text-rose-600 mt-1 font-medium">{errors.serviceType}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Date *</label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className={`w-full p-2 border rounded text-xs focus:outline-hidden ${
                  errors.serviceDate ? 'border-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.serviceDate && (
                <p className="text-rose-600 mt-1 font-medium">{errors.serviceDate}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
              <input
                type="text"
                value={serviceTime}
                onChange={(e) => setServiceTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full p-2 border border-slate-300 rounded text-xs focus:outline-hidden"
              />
            </div>
          </div>

          {/* Charge & Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Charge ({currency}) *
              </label>
              <input
                type="number"
                min="0"
                value={charge}
                onChange={(e) => setCharge(e.target.value)}
                placeholder="50000"
                className={`w-full p-2 border rounded text-xs font-semibold focus:outline-hidden ${
                  errors.charge ? 'border-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.charge && (
                <p className="text-rose-600 mt-1 font-medium">{errors.charge}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status *</label>
              <select
                aria-label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-hidden"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific client instructions..."
              className="w-full p-2 border border-slate-300 rounded text-xs focus:outline-hidden resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold cursor-pointer"
            >
              {bookingToEdit ? 'Save Changes' : 'Save Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
