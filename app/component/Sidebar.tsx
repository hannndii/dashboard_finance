"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Utensils,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    {
      href: "/",
      label: "Halaman Utama",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/transaction",
      label: "Transaksi",
      icon: <ShoppingCart size={20} />,
    },
    {
      href: "/stock",
      label: "Manajemen Stok",
      icon: <Package size={20} />,
    },
    {
      href: "/report",
      label: "Laporan Keuangan",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-black text-white min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="h-20 bg-black flex items-center px-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <span className="font-bold text-black text-lg">K</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-base">Kantin PB AU</h1>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {menus.map((menu) => (
          <Link key={menu.href} href={menu.href}>
            <div
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                pathname === menu.href
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              {menu.icon}
              <span className="text-sm">{menu.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 pb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AR</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Alex Richards</p>
            <p className="text-xs text-slate-400">Lead Admin</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all text-sm">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}