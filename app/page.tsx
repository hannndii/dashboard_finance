import { getDashboardData } from './action';
import Link from 'next/link';
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
  Users
} from 'lucide-react';
import { RevenueChart } from './component/RevenueCart';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const data = await getDashboardData();

  const formatRp = (n: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(n);

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
        <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center px-6">
          <h1 className="text-white font-bold text-xl">KantinAdmin</h1>
        </div>

        <div className="p-5 space-y-2">

          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarItem icon={<ShoppingCart size={18} />} label="Transaksi" />
          <SidebarItem icon={<Package size={18} />} label="Stok Barang" />
          <SidebarItem icon={<BarChart3 size={18} />} label="Laporan" />

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
              <span className="font-medium">Maman Ketoprak</span>
            </div>
          </div>

        </header>

        {/* MAIN */}
        <main className="p-8">

          {/* PAGE TITLE */}
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-4xl font-light text-slate-700">
                Dashboard
              </h2>
            </div>

            <Link
              href="/input"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
            >
              + Input Transaksi
            </Link>
          </div>

          {/* SUMMARY CARDS */}
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

          {/* CHART + STOCK */}
          <div className="grid grid-cols-3 gap-6 mb-8">

            {/* CHART */}
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-blue-600 font-semibold mb-6">
                Monthly Recap Report
              </h3>

              <div className="h-[380px]">
                <RevenueChart data={data.chart} />
              </div>
            </div>

            {/* STOCK LIST */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-blue-600 font-semibold mb-6">
                Products Sold
              </h3>

              <StockProgress name="Dimsum Goreng" percent={75} />
              <StockProgress name="Dimsum Kukus" percent={62} />
              <StockProgress name="Pisang Coklat" percent={54} />
              <StockProgress name="Air Mineral" percent={40} />
            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between mb-5">
              <h3 className="text-blue-600 font-semibold text-lg">
                Recent Transactions
              </h3>

              <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                View More
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 border-b">
                  <th className="py-3">Produk</th>
                  <th>Metode</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {data.recent.map((trx: any) => (
                  <tr key={trx._id} className="border-b">
                    <td className="py-4">{trx.productName}</td>
                    <td>{trx.paymentMethod}</td>
                    <td>{formatRp(trx.total)}</td>
                    <td>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        Success
                      </span>
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

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
        active
          ? 'bg-blue-50 text-blue-600 font-semibold'
          : 'text-slate-500 hover:bg-slate-50'
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
            className={`text-sm mt-2 ${
              danger ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {growth}
          </p>
        </div>

        <div>{icon}</div>
      </div>
    </div>
  );
}

function StockProgress({ name, percent }: any) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-2">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full">
        <div
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}