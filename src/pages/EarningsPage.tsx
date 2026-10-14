import React from 'react';
import { Booking } from '../types';
import { calculateEarningsSummary, formatCurrency } from '../utils/storage';

interface EarningsPageProps {
  bookings: Booking[];
  currency: string;
}

export const EarningsPage: React.FC<EarningsPageProps> = ({
  bookings,
  currency,
}) => {
  const summary = calculateEarningsSummary(bookings);

  return (
    <div className="space-y-4">
      {/* Total Expected Earnings Card */}
      <div className="bg-emerald-800 text-white p-4 rounded-xl shadow-xs">
        <div className="text-xs font-semibold text-emerald-200 uppercase">
          Total Expected Earnings
        </div>
        <div className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
          {formatCurrency(summary.expectedEarnings, currency)}
        </div>
        <div className="text-xs text-emerald-100 mt-2">
          Calculation Rule: Sum of charges for all non-cancelled bookings (Pending + Confirmed + Completed).
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <div className="text-slate-500 font-medium">Completed Earnings</div>
          <div className="text-base font-bold text-emerald-800 mt-1">
            {formatCurrency(summary.completedEarnings, currency)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary.completedCount} finished jobs
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <div className="text-slate-500 font-medium">Pending Earnings</div>
          <div className="text-base font-bold text-amber-700 mt-1">
            {formatCurrency(summary.pendingEarnings, currency)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary.pendingCount} awaiting confirmation
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <div className="text-slate-500 font-medium">Confirmed Value</div>
          <div className="text-base font-bold text-blue-800 mt-1">
            {formatCurrency(summary.confirmedEarnings, currency)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary.confirmedCount} scheduled jobs
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <div className="text-slate-500 font-medium">Cancelled (Excluded)</div>
          <div className="text-base font-bold text-rose-700 mt-1 line-through">
            {formatCurrency(summary.cancelledCharges, currency)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summary.cancelledCount} excluded from total
          </div>
        </div>
      </div>

      {/* Section 9 Audit Table from App Documentation */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Documentation Earnings Calculation Rule
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Breakdown showing each status and whether it contributes to expected earnings.
          </p>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Charge Sum</th>
                <th className="py-2.5 px-3 text-center">Included?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Pending</td>
                <td className="py-2.5 px-3 font-medium text-slate-900">
                  {formatCurrency(summary.pendingEarnings, currency)}
                </td>
                <td className="py-2.5 px-3 text-center text-emerald-800 font-bold">Yes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Confirmed</td>
                <td className="py-2.5 px-3 font-medium text-slate-900">
                  {formatCurrency(summary.confirmedEarnings, currency)}
                </td>
                <td className="py-2.5 px-3 text-center text-emerald-800 font-bold">Yes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Completed</td>
                <td className="py-2.5 px-3 font-medium text-slate-900">
                  {formatCurrency(summary.completedEarnings, currency)}
                </td>
                <td className="py-2.5 px-3 text-center text-emerald-800 font-bold">Yes</td>
              </tr>
              <tr className="bg-rose-50/40">
                <td className="py-2.5 px-3 font-semibold text-slate-800">Cancelled</td>
                <td className="py-2.5 px-3 font-medium text-rose-800 line-through">
                  {formatCurrency(summary.cancelledCharges, currency)}
                </td>
                <td className="py-2.5 px-3 text-center text-rose-700 font-bold">No</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900">
                <td className="py-3 px-3">Expected Earnings</td>
                <td className="py-3 px-3 text-emerald-800 font-extrabold text-sm">
                  {formatCurrency(summary.expectedEarnings, currency)}
                </td>
                <td className="py-3 px-3 text-center text-emerald-800">Verified</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Explanation note */}
      <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="font-bold text-slate-800">Note on Expected Earnings:</div>
        <p>
          This represents a summary of recorded agreed charges for valid scheduled work. It is not a record of actual cash received or profit.
        </p>
      </div>
    </div>
  );
};
