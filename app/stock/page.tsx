"use client";

import { useEffect, useState } from "react";
import AppShell from "../component/AppShell";
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

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

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

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );

  const lowStockItems = products.filter(
    (product) => product.stock > 0 && product.stock <= product.minStock,
  ).length;

  const outOfStockItems = products.filter(
    (product) => product.stock === 0,
  ).length;

  const categoryCount = new Set(products.map((product) => product.category)).size;

  async function handleDelete(id: string) {
    await deleteProduct(id);
    await loadProducts();
  }

  async function handleAddStock(id: string) {
    await addStock(id, 1);
    await loadProducts();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">
                Stok Barang
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 hover:cursor-pointer"
              >
                <PlusCircle size={18} />
                Add New Item
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Total Transaksi
              </p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {formatRp(totalValue)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Stok Hampir Habis
              </p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {lowStockItems} Items
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Stok Habis
              </p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {outOfStockItems} Items
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Total Kategori
              </p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {categoryCount} Groups
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Produk
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  {filteredProducts.length} Produk Ditemukan
                </h2>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full min-w-[900px] table-auto text-left">
              <thead>
                <tr className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  <th className="pb-4 font-medium text-slate-900">Produk</th>
                  <th className="pb-4 font-medium text-slate-900">Kategori</th>
                  <th className="pb-4 font-medium text-slate-900">Stok Saat Ini</th>
                  <th className="pb-4 font-medium text-slate-900">Harga</th>
                  <th className="pb-4 font-medium text-slate-900">Status</th>
                  <th className="pb-4 font-medium text-slate-900">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b transition hover:bg-slate-50"
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
                        {product.category}
                      </td>

                      <td>
                        <span className="font-bold text-slate-700">
                          {product.stock}
                        </span>
                      </td>

                      <td className="text-slate-700 font-medium">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>

                      <td>
                        {product.stock === 0 ? (
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                            Out of Stock
                          </span>
                        ) : product.stock <= product.minStock ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddStock(product._id)}
                            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 hover:cursor-pointer"
                          >
                            +1
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowEditModal(true);
                            }}
                            className="rounded-full border border-yellow-100 bg-yellow-50 p-2 text-yellow-600 transition hover:bg-yellow-100 hover:cursor-pointer"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="rounded-full border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Tidak ada produk ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
    </AppShell>
  );
}