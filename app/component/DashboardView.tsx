"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Search,
  Bell,
  Mail,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";

import { RevenueChart } from "./RevenueCart";
import InputPanel from "./InputPanel";

export default function DashboardView({ data }: any) {
  const [showInput, setShowInput] = useState(false);

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR */}
        <aside className="w-20 md:w-64 bg-white border-r border-slate-200 min-h-screen flex-shrink-0">
          <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center md:justify-start px-4 md:px-6">
            <h1 className="text-white font-bold text-lg md:text-xl">
              <span className="hidden md:block">Kantin PB AU</span>
              <span className="md:hidden">PB</span>
            </h1>
          </div>

          <div className="p-3 md:p-5 space-y-2">
            <Link href="/">
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                active
              />
            </Link>

            <Link href="/transaction">
              <SidebarItem
                icon={<ShoppingCart size={20} />}
                label="Transaksi"
              />
            </Link>

            <Link href="/stock">
              <SidebarItem icon={<Package size={20} />} label="Stok Barang" />
            </Link>

            <Link href="/report">
              <SidebarItem icon={<BarChart3 size={20} />} label="Laporan" />
            </Link>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* TOPBAR
          <header className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3 md:gap-6 text-white">
              <div className="flex items-center gap-3 border-l border-white/30 pl-3 md:pl-5">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                  M
                </div>
                <span className="hidden lg:block font-medium">
                  Administrator
                </span>
              </div>
            </div>
          </header> */}
          {/* MAIN */}
          <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-x-hidden">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center mb-8">

              <button
                onClick={() => setShowInput(true)}
                className="w-40 h-12 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg w-full md:w-auto"
              >
                + Input Transaksi
              </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="OMSET HARI INI"
                value={formatRp(data.today.totalRevenue)}
                icon={<DollarSign className="text-blue-500" />}
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

            {/* CHART */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h3 className="text-blue-600 font-semibold mb-4">
                Monthly Recap Report
              </h3>

              <div className="h-[280px] md:h-[400px]">
                <RevenueChart data={data.chart} />
              </div>
            </div>
          </main>
        </div>
      </div>

      {showInput && (
        <InputPanel
          products={data.products}
          onClose={() => setShowInput(false)}
        />
      )}
    </>
  );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <div
      className={`flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-lg transition ${
        active
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span className="hidden md:block">{label}</span>
    </div>
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