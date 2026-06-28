import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import { getDashboardData } from "../action";

export default async function TransactionPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <h1 className="text-3xl mb-6 font-light">Semua Transaksi</h1>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Pembayaran</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {data.recent.map((trx: any) => (
                  <tr key={trx._id}>
                    <td>{trx.productName}</td>
                    <td>{trx.paymentMethod}</td>
                    <td>Rp {trx.total}</td>
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