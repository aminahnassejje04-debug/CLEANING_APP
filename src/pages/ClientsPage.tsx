import React, { useState, useMemo } from 'react';
import { Client, Booking } from '../types';

interface ClientsPageProps {
  clients: Client[];
  bookings: Booking[];
  onOpenNewClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onScheduleForClient: (client: Client) => void;
  currency: string;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({
  clients,
  bookings,
  onOpenNewClient,
  onEditClient,
  onDeleteClient,
  onScheduleForClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  const getClientBookingCount = (clientId: string) => {
    return bookings.filter((b) => b.clientId === clientId).length;
  };

  return (
    <div className="space-y-3">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-bold text-slate-700">
          Saved Clients: {clients.length}
        </div>
        <button
          onClick={onOpenNewClient}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-3 rounded-lg cursor-pointer transition-colors"
        >
          + Add Client
        </button>
      </div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone or address..."
          className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-800"
        />
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filteredClients.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No client records found.
          </div>
        ) : (
          filteredClients.map((client) => {
            const count = getClientBookingCount(client.id);
            return (
              <div
                key={client.id}
                className="bg-white p-3 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{client.name}</h3>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Phone: <span className="font-medium text-slate-800">{client.phone}</span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {count} {count === 1 ? 'booking' : 'bookings'}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-slate-400">Address: </span>
                  {client.address}
                </div>

                {client.notes && (
                  <div className="text-xs bg-slate-50 p-2 rounded text-slate-600">
                    <span className="font-semibold text-slate-500">Notes: </span>
                    {client.notes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onScheduleForClient(client)}
                    className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                  >
                    + Book Service
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditClient(client)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded bg-slate-100 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClient(client)}
                      className="text-xs text-rose-700 hover:text-rose-900 font-medium px-2 py-1 rounded bg-rose-50 cursor-pointer"
                    >
                      Delete
                    </button>
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
