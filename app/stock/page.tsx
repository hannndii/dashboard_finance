import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";

export default function StockPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <h1 className="text-3xl mb-6 font-light">Kelola Stok</h1>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            Form tambah stok di sini.
          </div>
        </main>
      </div>
    </div>
  );
}