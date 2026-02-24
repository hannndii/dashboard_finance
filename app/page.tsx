import { getDashboardData } from './action';
import { DollarSign, ShoppingCart, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { RevenueChart } from './component/RevenueCart'; 

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const data = await getDashboardData();
  const formatRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const lastTransaction = data.recent.length > 0 ? new Date(data.recent[0].createdAt) : null;
  const lastTrxText = lastTransaction 
    ? `Terakhir: ${lastTransaction.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} ${lastTransaction.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` 
    : "Belum ada transaksi";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">PB</div>
          <span className="font-bold text-slate-800 text-lg">Kantin Dashboard</span>
        </div>
        <Link href="/input" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
          + Input Transaksi
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
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
            desc={lastTrxText}
          />
          <Card 
            title="Status Kantin" 
            value="Open" 
            icon={<Calendar className="text-orange-600" />} 
            desc="Siap menerima pesanan"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold text-slate-800">Tren Pendapatan (7 Hari)</h2>
          </div>
          <div className="h-[300px] w-full">
            <RevenueChart data={data.chart} />
          </div>
        </div>

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
                  <th className="px-6 py-3 text-center">Pembayaran</th>
                  <th className="px-6 py-3 text-center">Bukti QRIS</th>
                  <th className="px-6 py-3 text-right">Harga Satuan</th>
                  <th className="px-6 py-3 text-center">Qty</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recent.map((trx: any) => (
                  <tr key={trx._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                      <div className="font-medium text-slate-700">
                        {new Date(trx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs">
                        {new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">{trx.productName}</td>
                    
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-md font-medium ${trx.paymentMethod === 'QRIS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {trx.paymentMethod || 'Cash'}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-center">
                      {trx.paymentMethod === 'QRIS' && trx.receiptImage ? (
                        <a 
                          href={trx.receiptImage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors font-semibold"
                        >
                          <ExternalLink size={14} />
                          Lihat
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="px-6 py-3 text-right text-slate-600">{formatRp(trx.price)}</td>
                    <td className="px-6 py-3 text-center text-slate-600">{trx.qty}</td>
                    <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatRp(trx.total)}</td>
                  </tr>
                ))}
                {data.recent.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Belum ada transaksi hari ini</td>
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