import { getDashboardData } from './action';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { RevenueChart } from './component/RevenueCart';
import { ReceiptViewer } from './component/ReceiptViewer';
import GoogleSheetSyncButton from './component/GoogleSheetSyncButton';

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
    <div className="flex min-h-screen bg-sky-50">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-blue-100 shadow-sm flex flex-col">
        <div className="p-6 border-b border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700">
            Warung Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sistem Kasir & Monitoring
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-3">

          <Link
            href="/"
            className="flex items-center gap-3 p-4 rounded-xl bg-blue-100 text-blue-700 font-semibold"
          >
            <LayoutDashboard size={22} />
            Dashboard
          </Link>

          <Link
            href="/input"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-50 text-slate-700 font-medium transition"
          >
            <PlusCircle size={22} />
            Input Transaksi
          </Link>

          <Link
            href="/stok"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-50 text-slate-700 font-medium transition"
          >
            <Package size={22} />
            Kelola Stok
          </Link>

          <div className="pt-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
              <FileSpreadsheet size={18} />
              Sinkron Spreadsheet
            </div>
            <GoogleSheetSyncButton />
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 space-y-8">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Dashboard Penjualan
          </h2>
          <p className="text-slate-500 mt-2">
            Pantau transaksi, omset, dan performa warung.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          <Card
            title="Omset Hari Ini"
            value={formatRp(data.today.totalRevenue)}
            icon={<DollarSign className="text-blue-600" />}
            desc={`${data.today.count} transaksi`}
          />

          <Card
            title="Total Transaksi"
            value={data.today.count.toString()}
            icon={<ShoppingCart className="text-blue-600" />}
            desc="Hari ini"
          />

          <Card
            title="Status Warung"
            value="Buka"
            icon={<Calendar className="text-blue-600" />}
            desc="Melayani pelanggan"
          />
        </div>

        {/* CHART */}
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" />
            <h3 className="text-xl font-bold text-slate-800">
              Tren Pendapatan
            </h3>
          </div>

          <div className="h-[320px]">
            <RevenueChart data={data.chart} />
          </div>
        </section>

        {/* TABLE */}
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="p-6 border-b border-blue-100">
            <h3 className="text-xl font-bold text-slate-800">
              Riwayat Transaksi
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left">Produk</th>
                  <th className="px-6 py-4 text-center">Metode</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Bukti</th>
                </tr>
              </thead>

              <tbody>
                {data.recent.map((trx: any) => (
                  <tr key={trx._id} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-medium">
                      {trx.productName}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          trx.paymentMethod === 'QRIS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {trx.paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-blue-700">
                      {formatRp(trx.total)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {trx.paymentMethod === 'QRIS' && trx.receiptImage ? (
                        <ReceiptViewer base64Image={trx.receiptImage} />
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ title, value, icon, desc }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-base text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>

        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}