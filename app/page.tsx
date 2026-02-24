import { getDashboardData } from '../app/action';
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { RevenueChart } from '../app/component/RevenueCart'; // Kita buat component ini terpisah

export const dynamic = 'force-dynamic'; // Agar data selalu fresh saat dibuka

export default async function Dashboard() {
  const data = await getDashboardData();
  const formatRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-bold text-slate-800 text-lg">Mochisan Dashboard</span>
        </div>
        <Link href="/input" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
          + Input Transaksi
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            title="Omset Hari Ini" 
            value={formatRp(data.today.totalRevenue)} 
            icon={<DollarSign className="text-emerald-600" />} 
            desc={`${data.today.count} transaksi hari ini`}
          />
          <Card 
            title="Total Transaksi" 
            value={data.today.count.toString()} 
            icon={<ShoppingCart className="text-blue-600" />} 
            desc="Terhitung sejak 00:00 WIB"
          />
          <Card 
            title="Status Kantin" 
            value="Open" 
            icon={<Calendar className="text-orange-600" />} 
            desc="Siap menerima pesanan"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold text-slate-800">Tren Pendapatan (7 Hari)</h2>
          </div>
          <div className="h-[300px] w-full">
            {/* Chart dipisah ke client component karena Recharts butuh window object */}
            <RevenueChart data={data.chart} />
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Transaksi Terakhir</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Waktu</th>
                  <th className="px-6 py-3">Produk</th>
                  <th className="px-6 py-3 text-right">Harga Satuan</th>
                  <th className="px-6 py-3 text-center">Qty</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recent.map((trx: any) => (
                  <tr key={trx._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">{trx.productName}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{formatRp(trx.price)}</td>
                    <td className="px-6 py-3 text-center text-slate-600">{trx.qty}</td>
                    <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatRp(trx.total)}</td>
                  </tr>
                ))}
                {data.recent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada transaksi hari ini</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Component untuk Card
function Card({ title, value, icon, desc }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
      </div>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
  );
}