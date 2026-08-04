"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";

export function ReportTable({ transactions, dict, lang }: { transactions: any[], dict: any, lang: string }) {
  const [visibleCount, setVisibleCount] = useState(5);

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white relative">
      <div className="flex items-center justify-between p-6 md:p-8 pb-4">
        <h3 className="text-slate-900 text-lg font-bold">{dict.report.history}</h3>
      </div>
      <div className="overflow-x-auto p-6 md:p-8 pt-0">
        <table className="w-full min-w-[900px] table-auto text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-500">
              <th className="pb-4">{dict.report.date}</th>
              <th className="pb-4">{dict.report.reference}</th>
              <th className="pb-4">{dict.report.category}</th>
              <th className="pb-4">{dict.report.type}</th>
              <th className="pb-4">{dict.report.payment}</th>
              <th className="pb-4 text-right">{dict.report.amount}</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 ? (
              transactions.slice(0, visibleCount).map((trx: any) => (
                <tr
                  key={trx._id}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                >
                  <td className="py-4 text-sm font-medium text-slate-900">
                    {new Date(trx.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-4 text-sm font-bold text-slate-900">
                    TRX-{trx._id.substring(0, 4).toUpperCase()}-A
                  </td>
                  <td className="py-4 text-sm font-medium text-slate-500">
                    {dict.report.salesCat}
                  </td>
                  <td className="py-4">
                    <span
                      className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-emerald-200 text-emerald-600"
                    >
                      {dict.report.income}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-medium text-slate-500">
                    {trx.paymentMethod === "QRIS" ? dict.report.ewallet : dict.report.cash}
                  </td>
                  <td className="py-4 text-sm font-bold text-slate-900 text-right">
                    + Rp {trx.total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm font-medium text-slate-400"
                >
                  {dict.report.noTransactions}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {visibleCount < transactions.length && (
          <button
            onClick={() => setVisibleCount(transactions.length)}
            className="w-full mt-6 rounded-2xl bg-slate-50 py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 transition shadow-sm border border-slate-200"
          >
            Load More ({transactions.length - visibleCount} lagi)
          </button>
        )}
      </div>
    </div>
  );
}
