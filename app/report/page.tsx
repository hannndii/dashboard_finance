import AppShell from "../component/AppShell";
import { getAllTransactions } from "../action";
import { FileSpreadsheet, ArrowUpRight, ArrowDownRight, Calendar as CalendarIcon, Filter, Search } from "lucide-react";

export default async function ReportPage() {
  const transactions = await getAllTransactions();

  const totalRevenue = transactions.reduce(
    (sum: number, trx: any) => sum + trx.total,
    0
  );

  const totalTransactions = transactions.length;

  return (
    <AppShell
      title="Financial Report"
      subtitle={
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
          Fiscal period analysis and history
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
            Export to Excel
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
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Total Revenue</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </h3>
            <div className="mt-3 flex items-center gap-1 text-emerald-500 text-xs font-bold">
              <ArrowUpRight size={14} /> 8.4% increase from last month
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                 <ArrowDownRight size={16} />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Total Expenses</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Rp 12.450.000
            </h3>
            <div className="mt-3 flex items-center gap-1 text-slate-500 text-xs font-medium">
              — 2.1% lower than budget
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                 <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">Net Profit</p>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              Rp {(totalRevenue - 12450000).toLocaleString("id-ID")}
            </h3>
            <div className="mt-3 flex items-center gap-1 text-white/70 text-xs font-medium">
              Profit Margin: 64.2%
            </div>
          </div>
        </div>

        {/* CHART MOCKUP (Pure HTML/CSS matching the image) */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-slate-900 text-lg font-bold">Revenue vs Expenses Trend</h3>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Visualizing financial performance for May 2024</p>
             </div>
             <div className="flex items-center gap-4 text-xs font-bold text-slate-900">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-900"></span> Revenue</div>
                <div className="flex items-center gap-2 text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Expenses</div>
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
             <h3 className="text-slate-900 text-lg font-bold">Transaction History</h3>
             <div className="flex items-center gap-3">
               <div className="relative hidden sm:block w-48">
                 <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" size={14} />
                 <input
                   type="text"
                   placeholder="Search entries..."
                   className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-slate-300"
                 />
               </div>
               <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 hover:bg-slate-50">
                  <Filter size={14} /> Filter
               </button>
             </div>
          </div>
          <div className="overflow-x-auto p-6 md:p-8 pt-0">
            <table className="w-full min-w-[900px] table-auto text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Reference</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Payment</th>
                  <th className="pb-4 text-right">Amount</th>
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
                        {new Date(trx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-900">
                        TRX-{trx._id.substring(0,4).toUpperCase()}-A
                      </td>
                      <td className="py-4 text-sm font-medium text-slate-500">
                        Cafeteria Sales
                      </td>
                      <td className="py-4">
                        <span
                          className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-emerald-200 text-emerald-600"
                        >
                          + INCOME
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium text-slate-500">
                        {trx.paymentMethod === "QRIS" ? "Digital Wallet" : "Cash"}
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
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-6 py-4 md:px-8 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Showing 1 to {totalTransactions} of {totalTransactions} transactions
            </span>
            <div className="flex items-center gap-1">
               <button className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Previous</button>
               <button className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 border border-slate-900 rounded-lg">1</button>
               <button className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}