// ============================================================================
// 📈 MODULE: FINANCIAL REPORTS
// Menyediakan analisis keuangan, tren pendapatan, dan riwayat transaksi lengkap.
// ============================================================================

import AppShell from "../component/AppShell";
import { getAllTransactions } from "../action";
import { FileSpreadsheet, ArrowUpRight, ArrowDownRight, Calendar as CalendarIcon, Filter, Search } from "lucide-react";
import { cookies } from "next/headers";
import { getDictionary } from "../../lib/dictionaries";

export default async function ReportPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "id";
  const dict = getDictionary(lang);

  const transactions = await getAllTransactions();

  const totalRevenue = transactions.reduce(
    (sum: number, trx: any) => sum + trx.total,
    0
  );

  const totalTransactions = transactions.length;

  return (
    <AppShell
      title={dict.report.title}
      subtitle={
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
          {dict.report.subtitle}
        </span>
      }
      rightElement={
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:cursor-pointer">
            <CalendarIcon size={16} className="text-slate-400" />
            May 01, 2024 - May 31, 2024
          </div>
          <a
            href="/api/excel"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800"
          >
            <FileSpreadsheet size={16} />
            {dict.report.export}
          </a>
        </div>
      }
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
                 <ArrowUpRight size={16} />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{dict.report.totalRevenue}</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                 <ArrowDownRight size={16} />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{dict.report.totalExpenses}</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Rp 12.450.000
            </h3>
          </div>

          <div className="rounded-[1.5rem] bg-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                 <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">{dict.report.netProfit}</p>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              Rp {(totalRevenue - 12450000).toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        {/* CHART MOCKUP (Pure HTML/CSS matching the image) */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-slate-900 text-lg font-bold">{dict.report.trendTitle}</h3>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">{dict.report.trendSub}</p>
             </div>
             <div className="flex items-center gap-4 text-xs font-bold text-slate-900">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-900"></span> {dict.report.revenue}</div>
                <div className="flex items-center gap-2 text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-200"></span> {dict.report.expenses}</div>
             </div>
          </div>
          <div className="h-[250px] w-full flex items-end justify-between gap-2 border-b border-slate-200 pb-2 relative">
             <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-400">
                <span>8k</span>
                <span>6k</span>
                <span>4k</span>
                <span>2k</span>
                <span>0</span>
             </div>
             
             {/* Mock Bars */}
             <div className="flex-1 h-full ml-10 flex items-end justify-around">
                {/* W1 */}
                <div className="flex items-end gap-1 w-20 h-full justify-center">
                   <div className="w-10 bg-slate-900 h-[75%] rounded-t-sm"></div>
                   <div className="w-10 bg-slate-200 h-[30%] rounded-t-sm"></div>
                </div>
                {/* W2 */}
                <div className="flex items-end gap-1 w-20 h-full justify-center">
                   <div className="w-10 bg-slate-900 h-[90%] rounded-t-sm"></div>
                   <div className="w-10 bg-slate-200 h-[35%] rounded-t-sm"></div>
                </div>
                {/* W3 */}
                <div className="flex items-end gap-1 w-20 h-full justify-center">
                   <div className="w-10 bg-slate-900 h-[80%] rounded-t-sm"></div>
                   <div className="w-10 bg-slate-200 h-[35%] rounded-t-sm"></div>
                </div>
                {/* W4 */}
                <div className="flex items-end gap-1 w-20 h-full justify-center">
                   <div className="w-10 bg-slate-900 h-[95%] rounded-t-sm"></div>
                   <div className="w-10 bg-slate-200 h-[40%] rounded-t-sm"></div>
                </div>
             </div>
          </div>
          <div className="ml-10 flex items-center justify-around text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-4">
             <span className="w-20 text-center">W1</span>
             <span className="w-20 text-center">W2</span>
             <span className="w-20 text-center">W3</span>
             <span className="w-20 text-center">W4</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white">
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
                  transactions.map((trx: any) => (
                    <tr
                      key={trx._id}
                      className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                    >
                      <td className="py-4 text-sm font-medium text-slate-900">
                        {new Date(trx.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-900">
                        TRX-{trx._id.substring(0,4).toUpperCase()}-A
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
          </div>
        </div>
      </div>
    </AppShell>
  );
}