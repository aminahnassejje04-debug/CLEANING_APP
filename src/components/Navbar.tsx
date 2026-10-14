import React from 'react';
import { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  bookingCount: number;
  clientCount: number;
  currency: string;
  onChangeCurrency: (c: string) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  bookingCount,
  clientCount,
  currency,
  onChangeCurrency,
  onResetData,
}) => {
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard';
      case 'bookings':
        return 'Bookings';
      case 'clients':
        return 'Clients';
      case 'earnings':
        return 'Earnings Summary';
    }
  };

  return (
    <>
      {/* Mobile Top App Bar - Solid Color, Clean Header */}
      <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-xs">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider">
              Cleaning Service App
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <select
              aria-label="Currency"
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="bg-emerald-900 text-white text-xs font-semibold px-2 py-1.5 rounded border border-emerald-700 focus:outline-hidden cursor-pointer"
            >
              <option value="UGX">UGX</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="KES">KES</option>
            </select>

            {/* Reset sample data */}
            <button
              onClick={onResetData}
              title="Reset data"
              className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1.5 rounded font-medium transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar - Plain 4 Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 max-w-md mx-auto">
        <div className="grid grid-cols-4 text-center py-1.5">
          {/* Tab 1: Dashboard */}
          <button
            onClick={() => setActivePage('dashboard')}
            className={`py-2 px-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activePage === 'dashboard'
                ? 'text-emerald-800 font-bold border-t-2 border-emerald-800 -mt-1.5'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-xs">Dashboard</span>
          </button>

          {/* Tab 2: Bookings */}
          <button
            onClick={() => setActivePage('bookings')}
            className={`py-2 px-1 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
              activePage === 'bookings'
                ? 'text-emerald-800 font-bold border-t-2 border-emerald-800 -mt-1.5'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-xs">
              Bookings ({bookingCount})
            </span>
          </button>

          {/* Tab 3: Clients */}
          <button
            onClick={() => setActivePage('clients')}
            className={`py-2 px-1 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
              activePage === 'clients'
                ? 'text-emerald-800 font-bold border-t-2 border-emerald-800 -mt-1.5'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-xs">
              Clients ({clientCount})
            </span>
          </button>

          {/* Tab 4: Earnings */}
          <button
            onClick={() => setActivePage('earnings')}
            className={`py-2 px-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activePage === 'earnings'
                ? 'text-emerald-800 font-bold border-t-2 border-emerald-800 -mt-1.5'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="text-xs">Earnings</span>
          </button>
        </div>
      </nav>
    </>
  );
};
