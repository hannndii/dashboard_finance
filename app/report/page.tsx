import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";

export default function ReportPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-light text-slate-700">
              Laporan Penjualan
            </h1>

            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Grafik bulanan, export PDF, Excel
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="h-[300px] md:h-[500px] flex items-center justify-center text-slate-400">
              Grafik bulanan akan tampil di sini
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}