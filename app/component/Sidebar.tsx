"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  LogOut,
  Utensils,
  X
} from "lucide-react";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

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

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/login-page");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <aside className="flex h-screen w-64 flex-col overflow-hidden bg-white border-r border-slate-200">
      {/* Logo Section */}
      <div className="flex h-20 shrink-0 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.8rem] bg-slate-900 shadow-sm">
            <Utensils size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">CanteenSys</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 md:hidden hover:cursor-pointer">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu Section */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden px-4 py-6">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <Link key={menu.href} href={menu.href} onClick={onClose}>
              <div
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 transition-all hover:cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* Icon wrapper to maintain alignment */}
                <div className={`${isActive ? "text-white" : "text-slate-400"}`}>
                  {menu.icon}
                </div>
                <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                  {menu.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="shrink-0 p-4">
        <div className="flex items-center gap-3 rounded-2xl p-3 border border-transparent transition-colors hover:border-slate-100 hover:bg-slate-50">
          <div className="relative">
            {/* Menggunakan gradient karena tidak ada foto profil */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-indigo-500 shadow-sm">
              <span className="text-xs font-bold text-white">AR</span>
            </div>
            {/* Status indicator pip */}
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">Alex Richards</p>
            <p className="truncate text-[10px] font-medium text-slate-500 uppercase tracking-widest">Lead Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 transition-colors hover:text-red-500 hover:bg-red-50 rounded-full hover:cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}