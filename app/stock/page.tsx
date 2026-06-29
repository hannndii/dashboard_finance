"use client";

import { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import ProductModal from "../component/ProductModal";
import EditProductModal from "../component/EditProductModal";

import {
  getProducts,
  deleteProduct,
  addStock,
} from "../action";

import {
  PlusCircle,
  Trash2,
  Pencil,
  Search,
  Package,
} from "lucide-react";

export default function StockPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [search, setSearch] = useState("");

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  async function handleDelete(id: string) {
    await deleteProduct(id);
    await loadProducts();
  }

  async function handleAddStock(id: string) {
    await addStock(id, 1);
    await loadProducts();
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-light text-slate-700">
                Stok Barang
              </h1>

              <p className="text-slate-500 mt-2 text-sm md:text-base">
                Kelola semua produk dan stok warung
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex gap-2 items-center justify-center"
            >
              <PlusCircle size={18} />
              Tambah Produk
            </button>
          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-3">
            <Search className="text-slate-400" size={18} />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-black"
            />
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-slate-50 transition"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package size={18} className="text-blue-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-700">
                              {product.name}
                            </p>

                            <p className="text-sm text-slate-400">
                              Min stok: {product.minStock}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="text-slate-700 font-medium">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>

                      <td>
                        <span className="font-bold text-slate-700">
                          {product.stock}
                        </span>
                      </td>

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
                          <button
                            onClick={() => handleAddStock(product._id)}
                            className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-bold"
                          >
                            +1
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowEditModal(true);
                            }}
                            className="bg-yellow-100 text-yellow-600 p-2 rounded-lg"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-100 text-red-600 p-2 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Tidak ada produk ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showModal && (
        <ProductModal
          onClose={() => {
            setShowModal(false);
            loadProducts();
          }}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}