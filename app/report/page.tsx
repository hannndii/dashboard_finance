import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";

export default function ReportPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <h1 className="text-3xl mb-6 font-light">Laporan Penjualan</h1>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            Grafik bulanan, export PDF, Excel.
          </div>
        </main>
      </div>
    </div>
  );
}