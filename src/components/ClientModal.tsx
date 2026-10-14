import React, { useState, useEffect } from 'react';
import { Client } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt'> & { id?: string }) => void;
  clientToEdit?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setAddress(clientToEdit.address || '');
      setNotes(clientToEdit.notes || '');
    } else {
      setName('');
      setPhone('');
      setAddress('');
      setNotes('');
    }
    setErrors({});
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) {
      errs.name = 'Client full name is required.';
    }
    if (!phone.trim()) {
      errs.phone = 'Phone number is required.';
    }
    if (!address.trim()) {
      errs.address = 'Service location / address is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: clientToEdit ? clientToEdit.id : undefined,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
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
            {clientToEdit ? 'Edit Client Record' : 'Add New Client'}
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Nakato"
              className={`w-full p-2 border rounded text-xs focus:outline-hidden ${
                errors.name ? 'border-rose-500' : 'border-slate-300'
              }`}
            />
            {errors.name && <p className="text-rose-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +256 701 234 567"
              className={`w-full p-2 border rounded text-xs focus:outline-hidden ${
                errors.phone ? 'border-rose-500' : 'border-slate-300'
              }`}
            />
            {errors.phone && <p className="text-rose-600 mt-1 font-medium">{errors.phone}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Address / Service Location *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Plot 14 Kyadondo Road, Nakasero"
              className={`w-full p-2 border rounded text-xs focus:outline-hidden ${
                errors.address ? 'border-rose-500' : 'border-slate-300'
              }`}
            />
            {errors.address && (
              <p className="text-rose-600 mt-1 font-medium">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cleaning preferences, gate codes..."
              className="w-full p-2 border border-slate-300 rounded text-xs focus:outline-hidden resize-none"
            />
          </div>

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
              {clientToEdit ? 'Save Changes' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
