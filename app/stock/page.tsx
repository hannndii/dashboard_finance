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
  X,
  MoreVertical
} from "lucide-react";

export default function StockPage() {
  const { dict, lang } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-hidden rounded-[1.5rem] bg-white border border-slate-200">
          <div className="overflow-x-auto p-8">
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

        {/* MOBILE CARDS LIST */}
        <div className="grid grid-cols-1 gap-4 md:hidden pb-20">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= product.minStock;
              const isOutOfStock = product.stock === 0;

              return (
                <div key={product._id} className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                        <Package size={20} className="text-slate-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{product.name}</h3>
                        <p className="text-xs font-medium text-slate-500">{product.category || "Makanan Berat"}</p>
                      </div>
                    </div>
                    <div>
                      {isOutOfStock ? (
                        <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-slate-900 text-white shadow-sm">
                          {dict.stock.statusOut}
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-red-200 text-red-600 shadow-sm">
                          {dict.stock.statusLow}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-emerald-200 text-emerald-600 shadow-sm">
                          {dict.stock.statusIn}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{dict.stock.currentStock}</p>
                      <p className={`font-bold text-lg tracking-tight ${isLowStock || isOutOfStock ? "text-red-500" : "text-slate-900"}`}>
                        {product.stock.toString().padStart(2, '0')} <span className="text-xs font-medium text-slate-500">{dict.stock.units}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{dict.stock.price}</p>
                      <p className="font-bold text-slate-900 text-lg tracking-tight">
                        {formatRp(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowEditModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-slate-200 rounded-[1.5rem] p-8 text-center text-sm font-medium text-slate-400">
              {dict.stock.noItems}
            </div>
          )}
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
      {/* MOBILE FLOATING ACTION BUTTON (DROPUP) */}
      <div className="fixed bottom-0 right-0 z-40 p-4 sm:hidden pointer-events-none flex flex-col items-end gap-3">
        
        {/* DROPUP MENU ITEMS */}
        <div 
          className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom-right ${isMobileMenuOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'}`}
        >
          
          {/* Add Product Button */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setShowModal(true);
            }}
            className="flex items-center gap-3 bg-emerald-600 text-white rounded-full py-3 px-5 shadow-[0_4px_20px_rgb(52,211,153,0.4)] transition-all active:scale-95"
          >
            <span className="text-sm font-bold">{dict.stock.addNewItem}</span>
            <PlusCircle size={20} />
          </button>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-[0_4px_25px_rgb(0,0,0,0.15)] border border-slate-800">
            <input
              type="text"
              placeholder={dict.stock.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 sm:w-64 rounded-xl bg-slate-50 py-2.5 px-4 text-sm font-bold text-slate-900 outline-none focus:bg-slate-100 transition-all placeholder:text-slate-400 placeholder:font-medium"
            />
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Search size={18} />
            </div>
          </div>

        </div>

        {/* MAIN FAB BUTTON */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`pointer-events-auto flex items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 ${isMobileMenuOpen ? 'w-14 h-14 bg-slate-800 rotate-90' : 'w-14 h-14 bg-slate-900 rotate-0'}`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
        </button>
      </div>

    </AppShell>
  );
}