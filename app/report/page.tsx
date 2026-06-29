import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import GoogleSheetSyncButton from "../component/GoogleSheetSyncButton";
import {
  getAllTransactions,
} from "../action";

import {
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default async function ReportPage() {
  const transactions = await getAllTransactions();

  const totalRevenue = transactions.reduce(
    (sum: number, trx: any) => sum + trx.total,
    0
  );

  const totalTransactions = transactions.length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-light text-slate-700">
              Laporan Penjualan
            </h1>

            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Export PDF, Excel, dan sinkronisasi Google Spreadsheet
            </p>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-slate-400 text-sm">Total Pendapatan</p>
              <h3 className="text-3xl font-bold text-black mt-2">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </h3>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-slate-400 text-sm">Total Transaksi</p>
              <h3 className="text-3xl font-bold text-black mt-2">
                {totalTransactions}
              </h3>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-4">

            <GoogleSheetSyncButton />

            <a
              href="./api/excel"
              className="px-4 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 font-semibold"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </a>

            <a
              href="./api/pdf"
              className="px-4 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 font-semibold"
            >
              <FileText size={18} />
              Export PDF
            </a>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-4 text-black">Produk</th>
                  <th className="py-4 text-black">Qty</th>
                  <th className="py-4 text-black">Metode</th>
                  <th className="py-4 text-black">Total</th>
                  <th className="py-4 text-black">Tanggal</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((trx: any) => (
                  <tr key={trx._id} className="border-b">
                    <td className="py-4 text-black">{trx.productName}</td>
                    <td className="text-black">{trx.qty}</td>
                    <td className="text-black">{trx.paymentMethod}</td>
                    <td className="text-black">
                      Rp {trx.total.toLocaleString("id-ID")}
                    </td>
                    <td className="text-black">
                      {new Date(trx.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}