"use client";

import { useState } from "react";
import Link from "next/link";
import {
  WalletMinimal,
  Calendar,
  Users,
  ShoppingCart,
} from "lucide-react";

import { SalesPerformanceChart, TopSellingProductDonutChart } from "./RevenueCart";

export default function DashboardView({ data }: any) {
  const [showInput, setShowInput] = useState(false);

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const recentTransactions = data.recent.slice(0, 5);

  const getStatusLabel = (trx: any) => {
    if (trx.paymentMethod === "QRIS" && !trx.receiptImage) {
      return "Belum bayar";
    }
    return "Berhasil";
  };

  const topSellingProducts = Object.values(
    data.recent.reduce((acc: any, trx: any) => {
      const key = trx.productName;
      if (!acc[key]) {
        acc[key] = {
          name: trx.productName,
          value: trx.qty,
        };
      } else {
        acc[key].value += trx.qty;
      }
      return acc;
    }, {})
  )
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);

  return (
    <>
      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="PENJUALAN HARI INI"
          value={formatRp(data.today.totalRevenue)}
          icon={<WalletMinimal className="text-blue-500" />}
        />

        <StatCard
          title="TRANSAKSI"
          value={data.today.count}
          icon={<ShoppingCart className="text-green-500" />}
        />

        <StatCard
          title="PRODUK TERJUAL"
          value={data.recent.length}
          icon={<Users className="text-sky-500" />}
        />

        <StatCard
          title="STOK MENIPIS"
          value="4"
          icon={<Calendar className="text-orange-500" />}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 text-lg font-semibold">
              Sales Performance
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Grafik pendapatan penjualan dalam gaya garis.
            </p>
          </div>
          <div className="h-[320px] md:h-[380px]">
            <SalesPerformanceChart data={data.chart} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
          <div className="mb-4">
            <h3 className="text-slate-900 text-lg font-semibold">
              Top Selling Product
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Diagram donat monokrom berdasarkan produk terlaris.
            </p>
          </div>
          <div className="h-[320px] md:h-[380px]">
            <TopSellingProductDonutChart data={topSellingProducts} />
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Transaksi Terbaru
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Ringkasan transaksi terbaru dari database
            </p>
          </div>

          <Link
            href="/transaction"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-4 font-medium">Order ID</th>
                <th className="py-4 font-medium">Nama Barang</th>
                <th className="py-4 font-medium">Waktu Pembayaran</th>
                <th className="py-4 font-medium">Status</th>
                <th className="py-4 font-medium">Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((trx: any) => {
                  const statusLabel = getStatusLabel(trx);
                  return (
                    <tr
                      key={trx._id}
                      className="border-b hover:bg-slate-50 transition"
                    >
                      <td className="py-4 font-medium text-slate-700">
                        {trx._id}
                      </td>
                      <td className="py-4 text-slate-700">
                        {trx.productName}
                      </td>
                      <td className="py-4 text-slate-700">
                        {new Date(trx.createdAt).toLocaleString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusLabel === "Berhasil"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-slate-700">
                        {formatRp(trx.total)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-slate-400"
                  >
                    Belum ada transaksi terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-slate-400 font-semibold">{title}</p>
          <h3 className="text-xl md:text-3xl font-bold text-slate-700 mt-2 break-words">
            {value}
          </h3>
        </div>

        {icon}
      </div>
    </div>
  );
}
