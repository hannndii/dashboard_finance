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
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
          <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center px-6">
            <h1 className="text-white font-bold text-xl">Kantin PB AU</h1>
          </div>

          <div className="p-5 space-y-2">
            <Link href="/">
              <SidebarItem
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                active
              />
            </Link>

            <Link href="/transaction">
              <SidebarItem
                icon={<ShoppingCart size={18} />}
                label="Transaksi"
              />
            </Link>

            <Link href="/stock">
              <SidebarItem icon={<Package size={18} />} label="Stok Barang" />
            </Link>

            <Link href="/report">
              <SidebarItem icon={<BarChart3 size={18} />} label="Laporan" />
            </Link>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1">
          {/* TOPBAR */}
          <header className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-between px-8">
            <div className="flex items-center gap-4 text-white">
              <Search size={18} />
            </div>

            <div className="flex items-center gap-6 text-white">
              <Bell size={18} />
              <Mail size={18} />

              <div className="flex items-center gap-3 border-l border-white/30 pl-5">
                <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                  M
                </div>
                <span className="font-medium">Administrator</span>
              </div>
            </div>
          </header>

          {/* MAIN */}
          <main className="p-8">
            {/* PAGE TITLE */}
            <div className="flex justify-between mb-8">
              <h2 className="text-4xl font-light text-slate-700">Dashboard</h2>

              <button
                onClick={() => setShowInput(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
              >
                + Input Transaksi
              </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <StatCard
                title="OMSET HARI INI"
                value={formatRp(data.today.totalRevenue)}
                icon={<DollarSign className="text-blue-500" />}
                growth="+3.4%"
              />

              <StatCard
                title="TRANSAKSI"
                value={data.today.count}
                icon={<ShoppingCart className="text-green-500" />}
                growth="+12%"
              />

              <StatCard
                title="PRODUK TERJUAL"
                value={data.recent.length}
                icon={<Users className="text-sky-500" />}
                growth="+20%"
              />

              <StatCard
                title="STOK MENIPIS"
                value="4"
                icon={<Calendar className="text-orange-500" />}
                growth="-1.1%"
                danger
              />
            </div>

            {/* CHART */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-blue-600 font-semibold mb-6">
                  Monthly Recap Report
                </h3>

                <div className="h-[380px]">
                  <RevenueChart data={data.chart} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* INPUT PANEL */}
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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
        active
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

function StatCard({ title, value, icon, growth, danger = false }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-slate-400 font-semibold">{title}</p>
          <h3 className="text-3xl font-bold text-slate-700 mt-2">{value}</h3>
          <p
            className={`text-sm mt-2 ${danger ? "text-red-500" : "text-green-500"}`}
          >
            {growth}
          </p>
        </div>

        <div>{icon}</div>
      </div>
    </div>
  );
}
