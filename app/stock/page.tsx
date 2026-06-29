import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import { getProducts, deleteProduct } from "../action";
import { Package, PlusCircle, Trash2, Pencil } from "lucide-react";

export default async function StockPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-light text-slate-700">
                Stok Barang
              </h1>
              <p className="text-slate-500 mt-2">
                Kelola semua produk dan stok warung
              </p>
            </div>

            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg flex gap-2 items-center">
              <PlusCircle size={18} />
              Tambah Produk
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">

            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-slate-400">
                  <th className="py-4 text-black">Produk</th>
                  <th className="py-4 text-black">Harga</th>
                  <th className="py-4 text-black">Stok</th>
                  <th className="py-4 text-black">Status</th>
                  <th className="py-4 text-black">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product: any) => (
                  <tr key={product._id} className="border-b">

                    <td className="py-4 font-medium text-slate-700">
                      {product.name}
                    </td>

                    <td>
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>

                    <td>{product.stock}</td>

                    <td>
                      {product.stock <= product.minStock ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                          Hampir Habis
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          Aman
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="flex gap-2">

                        <button className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                          <Pencil size={16} />
                        </button>

                        <form
                          action={async () => {
                            "use server";
                            await deleteProduct(product._id);
                          }}
                        >
                          <button className="bg-red-100 text-red-600 p-2 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </form>

                      </div>
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