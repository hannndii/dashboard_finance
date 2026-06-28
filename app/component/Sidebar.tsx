import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center px-6">
        <h1 className="text-white font-bold text-xl">KantinAdmin</h1>
      </div>

      <div className="p-5 space-y-2">

        <Link href="/" className="sidebar-item">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link href="/transaction" className="sidebar-item">
          <ShoppingCart size={18} />
          Transaksi
        </Link>

        <Link href="/stock" className="sidebar-item">
          <Package size={18} />
          Stok Barang
        </Link>

        <Link href="/report" className="sidebar-item">
          <BarChart3 size={18} />
          Laporan
        </Link>

      </div>
    </aside>
  );
}