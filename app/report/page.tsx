import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import { getAllTransactions } from "../action";

import { FileSpreadsheet, FileText } from "lucide-react";

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
              Export laporan transaksi ke PDF dan Excel
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

          {/* EXPORT ACTIONS */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row gap-4">

              {/* Export Excel */}
              <a
                href="/api/excel"
                className="
                  flex items-center justify-center gap-2
                  px-5 py-3
                  rounded-xl
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  font-semibold
                  transition-all
                  shadow-sm
                  w-full sm:w-auto
                "
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </a>

              {/* Export PDF */}
              <a
                href="/api/pdf"
                className="
                  flex items-center justify-center gap-2
                  px-5 py-3
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  font-semibold
                  transition-all
                  shadow-sm
                  w-full sm:w-auto
                "
              >
                <FileText size={18} />
                Export PDF
              </a>

            </div>
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
                {transactions.length > 0 ? (
                  transactions.map((trx: any) => (
                    <tr
                      key={trx._id}
                      className="border-b hover:bg-slate-50 transition"
                    >
                      <td className="py-4 text-black font-medium">
                        {trx.productName}
                      </td>

                      <td className="text-black">{trx.qty}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            trx.paymentMethod === "QRIS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {trx.paymentMethod}
                        </span>
                      </td>

                      <td className="text-black font-semibold">
                        Rp {trx.total.toLocaleString("id-ID")}
                      </td>

                      <td className="text-black">
                        {new Date(trx.createdAt).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-400"
                    >
                      Belum ada transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}