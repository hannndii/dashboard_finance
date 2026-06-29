"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/transaction",
      label: "Transaksi",
      icon: <ShoppingCart size={20} />,
    },
    {
      href: "/stock",
      label: "Stok Barang",
      icon: <Package size={20} />,
    },
    {
      href: "/report",
      label: "Laporan",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center md:justify-start px-4 md:px-6">
        <h1 className="text-white font-bold text-lg md:text-xl">
          <span className="hidden md:block">Kantin PB AU</span>
          <span className="md:hidden">PB</span>
        </h1>
      </div>

      <div className="p-3 md:p-5 space-y-2">
        {menus.map((menu) => (
          <Link key={menu.href} href={menu.href}>
            <div
              className={`flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === menu.href
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {menu.icon}
              <span className="hidden md:block">{menu.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}