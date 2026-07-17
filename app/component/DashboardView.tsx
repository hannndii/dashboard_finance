"use client";

import { useState } from "react";
import Link from "next/link";
import {
  WalletMinimal,
  Calendar,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="PENJUALAN HARI INI"
          value={formatRp(data.today.totalRevenue)}
          icon={<DollarSign size={20} className="text-slate-700" />}
          trend="up"
          trendValue="12%"
          subtitle="v.s. kemarin"
        />

        <StatCard
          title="TOTAL TRANSAKSI"
          value={data.today.count}
          icon={<ShoppingCart size={20} className="text-slate-700" />}
          trend="up"
          trendValue="5%"
          subtitle="Seluruh penjualan"
        />

        <StatCard
          title="STOK MENIPIS"
          value="08"
          icon={<AlertTriangle size={20} className="text-slate-700" />}
          trend="down"
          trendValue="3 item"
          subtitle="Perlu diisi ulang"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[1.5rem] border border-slate-200 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-slate-900 text-lg font-bold">
              Performa Penjualan (Mingguan)
            </h3>
          </div>
          <div className="h-[320px] md:h-[380px]">
            <SalesPerformanceChart data={data.chart} />
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-200 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-slate-900 text-lg font-bold">
              Kategori Terlaris
            </h3>
          </div>
          <div className="h-[320px] md:h-[380px]">
            <TopSellingProductDonutChart data={topSellingProducts} />
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-slate-900 text-lg font-bold">Transaksi Terbaru</h3>
          </div>

          <Link
            href="/transaction"
            className="inline-flex items-center justify-center gap-1 text-sm font-bold text-slate-900 transition hover:text-slate-600"
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">ID Pesanan</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">Ringkasan Item</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">Waktu</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">Status</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((trx: any) => {
                  const statusLabel = getStatusLabel(trx);
                  const isCompleted = statusLabel === "Berhasil";
                  return (
                    <tr
                      key={trx._id}
                      className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                    >
                      <td className="py-4 font-bold text-slate-900">
                        #{trx._id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="py-4 font-medium text-slate-500">
                        {trx.productName}
                      </td>
                      <td className="py-4 font-medium text-slate-500">
                        {new Date(trx.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                            isCompleted
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-900 border-slate-300"
                          }`}
                        >
                          {isCompleted ? "SELESAI" : "TERTUNDA"}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-slate-900 text-right">
                        {formatRp(trx.total)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-sm font-medium text-slate-400"
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

function StatCard({ title, value, icon, trend, trendValue, subtitle }: any) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200 p-6 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
          {icon}
        </div>
      </div>
      
      <div className="flex items-end gap-3 mb-2">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">
          {value}
        </h3>
        {trend && (
          <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <p className="text-xs font-medium text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}
