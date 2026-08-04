// ============================================================================
// 📦 MODULE: STOCK MANAGEMENT
// Halaman untuk mengelola inventaris produk (Tambah, Edit, Hapus, dan Filter).
// Menampilkan metrik nilai stok, barang hampir habis, dan kosong.
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import AppShell from "../component/AppShell";
import ProductModal from "../component/ProductModal";
import EditProductModal from "../component/EditProductModal";
import { useLanguage } from "../component/LanguageProvider";

import {
  getProducts,
  deleteProduct,
} from "../action";

import {
  PlusCircle,
  Trash2,
  Pencil,
  Search,
  Package,
} from "lucide-react";

export default function StockPage() {
  const { dict, lang } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const formatRp = (n: number) =>
    new Intl.NumberFormat(lang === "en" ? "en-US" : "id-ID", {
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

  const categoryCount = new Set(products.map((product) => product.category || "Makanan Berat")).size;

  async function handleDelete(id: string) {
    await deleteProduct(id);
    await loadProducts();
  }

  return (
    <AppShell
      title={dict.stock.title}
      subtitle={
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 border border-slate-200">
          {products.length} {dict.stock.itemsTotal}
        </span>
      }
      rightElement={
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={dict.stock.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:cursor-pointer shadow-sm"
          >
            <PlusCircle size={16} />
            {dict.stock.addNewItem}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{dict.stock.totalValue}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900 tracking-tight">{formatRp(totalValue)}</p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{dict.stock.lowStock}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-red-600">
              {lowStockItems.toString().padStart(2, '0')} <span className="text-xl font-bold">{dict.stock.units}</span>
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{dict.stock.outOfStock}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {outOfStockItems.toString().padStart(2, '0')} <span className="text-xl font-bold">{dict.stock.units}</span>
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{dict.stock.categories}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {categoryCount.toString().padStart(2, '0')} <span className="text-xl font-bold">{dict.stock.groups}</span>
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[1.5rem] bg-white border border-slate-200">
          <div className="overflow-x-auto p-4 md:p-8">
            <table className="w-full min-w-[900px] table-auto text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  <th className="pb-4">{dict.stock.itemName}</th>
                  <th className="pb-4">{dict.stock.category}</th>
                  <th className="pb-4">{dict.stock.currentStock}</th>
                  <th className="pb-4">{dict.stock.price}</th>
                  <th className="pb-4">{dict.stock.status}</th>
                  <th className="pb-4 text-right">{dict.stock.actions}</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isLowStock = product.stock > 0 && product.stock <= product.minStock;
                    const isOutOfStock = product.stock === 0;

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                              <Package size={16} className="text-slate-700" />
                            </div>
                            <span className="font-bold text-slate-900">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 font-medium text-slate-500">
                          {product.category || "Makanan Berat"}
                        </td>

                        <td className="py-4">
                          <span className={`font-bold ${isLowStock || isOutOfStock ? "text-red-500" : "text-slate-900"}`}>
                            {product.stock.toString().padStart(2, '0')} <span className="font-medium text-sm text-slate-400">{dict.stock.units}</span>
                          </span>
                        </td>

                        <td className="py-4 font-bold text-slate-900">
                          {formatRp(product.price)}
                        </td>

                        <td className="py-4">
                          {isOutOfStock ? (
                            <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-slate-900 text-white">
                              {dict.stock.statusOut}
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-red-200 text-red-600">
                              {dict.stock.statusLow}
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-emerald-200 text-emerald-600">
                              {dict.stock.statusIn}
                            </span>
                          )}
                        </td>

                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowEditModal(true);
                              }}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 hover:cursor-pointer"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 hover:cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-sm font-medium text-slate-400">
                      {dict.stock.noItems}
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
      {/* MOBILE FLOATING SEARCH & ADD BAR */}
      <div className={`fixed right-0 z-40 p-4 sm:hidden pointer-events-none transition-all duration-300 bottom-0 ${isMobileSearchOpen ? "left-0" : "left-auto"}`}>
        <div className={`flex items-center justify-end gap-3 pointer-events-auto transition-all duration-300 ${isMobileSearchOpen ? "w-full bg-white rounded-2xl p-2 shadow-[0_-10px_40px_rgb(0,0,0,0.1)] border border-slate-200" : "flex-col"}`}>
          
          <div className={`relative transition-all duration-300 overflow-hidden ${isMobileSearchOpen ? "w-[85%] opacity-100" : "w-0 opacity-0"}`}>
            <input
              type="text"
              placeholder={dict.stock.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 py-3.5 px-4 text-sm font-bold text-slate-900 outline-none focus:bg-slate-100 transition-all placeholder:text-slate-400 placeholder:font-medium"
            />
          </div>

          {!isMobileSearchOpen && (
            <button
              onClick={() => setShowModal(true)}
              className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white transition hover:bg-emerald-700 shadow-xl"
            >
              <PlusCircle size={24} />
            </button>
          )}

          <button 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className={`bg-slate-900 flex items-center justify-center text-white shadow-xl transition-all ${isMobileSearchOpen ? "w-[15%] h-[48px] rounded-xl" : "w-14 h-14 rounded-full"}`}
          >
            {isMobileSearchOpen ? <X size={20} /> : <Search size={24} />}
          </button>
        </div>
      </div>

    </AppShell>
  );
}