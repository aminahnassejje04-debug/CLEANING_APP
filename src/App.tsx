/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, Client, Booking, BookingStatus } from './types';
import {
  loadClients,
  saveClients,
  loadBookings,
  saveBookings,
  getCurrency,
  setCurrency as setStorageCurrency,
  resetToSampleData,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { BookingsPage } from './pages/BookingsPage';
import { ClientsPage } from './pages/ClientsPage';
import { EarningsPage } from './pages/EarningsPage';
import { BookingModal } from './components/BookingModal';
import { ClientModal } from './components/ClientModal';
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { ConfirmModal } from './components/ConfirmModal';
import { AutoInstallPrompt } from './components/AutoInstallPrompt';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currency, setCurrencyState] = useState<string>('UGX');

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Pre-filled booking state
  const [prefilledBooking, setPrefilledBooking] = useState<{
    clientId?: string;
    serviceType?: string;
    charge?: number;
    notes?: string;
  } | null>(null);

  // Confirm delete modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'booking' | 'client' | 'reset';
    item: any;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'booking',
    item: null,
    title: '',
    message: '',
  });

  // Simple Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load initial data on mount
  useEffect(() => {
    setClients(loadClients());
    setBookings(loadBookings());
    setCurrencyState(getCurrency());
  }, []);

  const handleCurrencyChange = (newCur: string) => {
    setCurrencyState(newCur);
    setStorageCurrency(newCur);
    showToast(`Currency set to ${newCur}`);
  };

  // -------------------------------------------------------------
  // CLIENT ACTIONS
  // -------------------------------------------------------------
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'> & { id?: string }) => {
    let updated: Client[];
    if (clientData.id) {
      updated = clients.map((c) =>
        c.id === clientData.id
          ? {
              ...c,
              name: clientData.name,
              phone: clientData.phone,
              address: clientData.address,
              notes: clientData.notes,
            }
          : c
      );
      showToast(`Client "${clientData.name}" updated.`);
    } else {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        name: clientData.name,
        phone: clientData.phone,
        address: clientData.address,
        notes: clientData.notes,
        createdAt: new Date().toISOString(),
      };
      updated = [newClient, ...clients];
      showToast(`Client "${clientData.name}" added.`);
    }
    setClients(updated);
    saveClients(updated);
  };

  const handlePromptDeleteClient = (client: Client) => {
    const linked = bookings.filter((b) => b.clientId === client.id);
    setConfirmModal({
      isOpen: true,
      type: 'client',
      item: client,
      title: `Delete ${client.name}?`,
      message:
        linked.length > 0
          ? `This client has ${linked.length} linked booking(s). Deleting will also remove those bookings.`
          : 'Are you sure you want to delete this client record?',
    });
  };

  // -------------------------------------------------------------
  // BOOKING ACTIONS
  // -------------------------------------------------------------
  const handleSaveBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'> & { id?: string }) => {
    let updated: Booking[];
    if (bookingData.id) {
      updated = bookings.map((b) =>
        b.id === bookingData.id
          ? {
              ...b,
              clientId: bookingData.clientId,
              serviceType: bookingData.serviceType,
              serviceDate: bookingData.serviceDate,
              serviceTime: bookingData.serviceTime,
              charge: bookingData.charge,
              status: bookingData.status,
              notes: bookingData.notes,
            }
          : b
      );
      showToast('Booking updated.');
      if (selectedBooking && selectedBooking.id === bookingData.id) {
        setSelectedBooking(updated.find((b) => b.id === bookingData.id) || null);
      }
    } else {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        clientId: bookingData.clientId,
        serviceType: bookingData.serviceType,
        serviceDate: bookingData.serviceDate,
        serviceTime: bookingData.serviceTime,
        charge: bookingData.charge,
        status: bookingData.status,
        notes: bookingData.notes,
        createdAt: new Date().toISOString(),
      };
      updated = [newBooking, ...bookings];
      showToast('Booking saved.');
    }
    setBookings(updated);
    saveBookings(updated);
  };

  const handleChangeStatus = (bookingId: string, newStatus: BookingStatus) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b));
    setBookings(updated);
    saveBookings(updated);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
    showToast(`Status changed to ${newStatus}.`);
  };

  const handlePromptDeleteBooking = (booking: Booking) => {
    setConfirmModal({
      isOpen: true,
      type: 'booking',
      item: booking,
      title: 'Delete Booking?',
      message: `Are you sure you want to delete the booking for "${booking.serviceType}"?`,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.type === 'booking') {
      const b = confirmModal.item as Booking;
      const updated = bookings.filter((item) => item.id !== b.id);
      setBookings(updated);
      saveBookings(updated);
      if (selectedBooking?.id === b.id) {
        setIsDetailsModalOpen(false);
        setSelectedBooking(null);
      }
      showToast('Booking deleted.');
    } else if (confirmModal.type === 'client') {
      const c = confirmModal.item as Client;
      const updatedClients = clients.filter((item) => item.id !== c.id);
      const updatedBookings = bookings.filter((b) => b.clientId !== c.id);
      setClients(updatedClients);
      saveClients(updatedClients);
      setBookings(updatedBookings);
      saveBookings(updatedBookings);
      showToast(`Client "${c.name}" deleted.`);
    } else if (confirmModal.type === 'reset') {
      const reset = resetToSampleData();
      setClients(reset.clients);
      setBookings(reset.bookings);
      setCurrencyState('UGX');
      showToast('Reset to documentation sample data.');
    }

    setConfirmModal({
      isOpen: false,
      type: 'booking',
      item: null,
      title: '',
      message: '',
    });
  };

  const handleScheduleForClient = (client: Client) => {
    setPrefilledBooking({
      clientId: client.id,
      serviceType: 'Standard Residential Clean',
      charge: 50000,
    });
    setBookingToEdit(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenNewBooking = () => {
    setBookingToEdit(null);
    setPrefilledBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenEditBooking = (b: Booking) => {
    setBookingToEdit(b);
    setIsBookingModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleViewBooking = (b: Booking) => {
    setSelectedBooking(b);
    setIsDetailsModalOpen(true);
  };

  const handleOpenNewClient = () => {
    setClientToEdit(null);
    setIsClientModalOpen(true);
  };

  const handleOpenEditClient = (c: Client) => {
    setClientToEdit(c);
    setIsClientModalOpen(true);
  };

  const handlePromptReset = () => {
    setConfirmModal({
      isOpen: true,
      type: 'reset',
      item: null,
      title: 'Reset to Sample Data?',
      message: 'Restore the 4 clients and 4 bookings from the documentation example (UGX 170,000 expected earnings).',
    });
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col justify-center items-center font-sans antialiased">
      {/* Mobile-Only Device Frame with increased width */}
      <div className="w-full max-w-xl sm:max-w-2xl min-h-screen bg-slate-50 flex flex-col relative pb-16 shadow-md border-x border-slate-300">
        {/* Auto-Prompt Phone Installation on Link Open */}
        <AutoInstallPrompt />

        {/* Simple Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm">
            <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-md text-center">
              {toastMessage}
            </div>
          </div>
        )}

        {/* Mobile Header & Bottom Navigation Bar */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          bookingCount={bookings.length}
          clientCount={clients.length}
          currency={currency}
          onChangeCurrency={handleCurrencyChange}
        />

        {/* Mobile Main Content Screen */}
        <main className="flex-1 p-3.5 overflow-y-auto">
          {activePage === 'dashboard' && (
            <Dashboard
              clients={clients}
              bookings={bookings}
              setActivePage={setActivePage}
              onOpenNewBooking={handleOpenNewBooking}
              onOpenNewClient={handleOpenNewClient}
              onViewBooking={handleViewBooking}
              currency={currency}
            />
          )}

          {activePage === 'bookings' && (
            <BookingsPage
              bookings={bookings}
              clients={clients}
              onOpenNewBooking={handleOpenNewBooking}
              onViewBooking={handleViewBooking}
              onEditBooking={handleOpenEditBooking}
              onDeleteBooking={handlePromptDeleteBooking}
              onChangeStatus={handleChangeStatus}
              currency={currency}
            />
          )}

          {activePage === 'clients' && (
            <ClientsPage
              clients={clients}
              bookings={bookings}
              onOpenNewClient={handleOpenNewClient}
              onEditClient={handleOpenEditClient}
              onDeleteClient={handlePromptDeleteClient}
              onScheduleForClient={handleScheduleForClient}
              currency={currency}
            />
          )}

          {activePage === 'earnings' && (
            <EarningsPage
              bookings={bookings}
              currency={currency}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingToEdit(null);
          setPrefilledBooking(null);
        }}
        onSave={handleSaveBooking}
        clients={clients}
        bookingToEdit={
          bookingToEdit ||
          (prefilledBooking
            ? ({
                id: '',
                clientId: prefilledBooking.clientId || (clients[0]?.id ?? ''),
                serviceType: prefilledBooking.serviceType || 'Standard Residential Clean',
                serviceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                serviceTime: '09:00 AM',
                charge: prefilledBooking.charge ?? 50000,
                status: 'Pending',
                notes: prefilledBooking.notes || '',
                createdAt: '',
              } as Booking)
            : null)
        }
        onOpenNewClient={() => {
          setIsBookingModalOpen(false);
          setIsClientModalOpen(true);
        }}
        currency={currency}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        client={clients.find((c) => c.id === selectedBooking?.clientId)}
        onEdit={(b) => handleOpenEditBooking(b)}
        onDelete={(b) => handlePromptDeleteBooking(b)}
        onChangeStatus={handleChangeStatus}
        currency={currency}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setConfirmModal({
            isOpen: false,
            type: 'booking',
            item: null,
            title: '',
            message: '',
          })
        }
      />
    </div>
  );
}
