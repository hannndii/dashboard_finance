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
    <AppShell
      title="Stock Inventory"
      subtitle={
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 border border-slate-200">
          {products.length} Items Total
        </span>
      }
      rightElement={
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:cursor-pointer shadow-sm"
          >
            <PlusCircle size={16} />
            Add New Item
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Total Value</p>
            <p className="mt-3 text-3xl font-bold text-slate-900 tracking-tight">{formatRp(totalValue)}</p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Low Stock</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-red-600">
              {lowStockItems.toString().padStart(2, '0')} <span className="text-xl font-bold">Items</span>
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Out of Stock</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {outOfStockItems.toString().padStart(2, '0')} <span className="text-xl font-bold">Items</span>
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Categories</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {categoryCount.toString().padStart(2, '0')} <span className="text-xl font-bold">Groups</span>
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[1.5rem] bg-white border border-slate-200">
          <div className="overflow-x-auto p-4 md:p-8">
            <table className="w-full min-w-[900px] table-auto text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  <th className="pb-4">Item Name</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Current Stock</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
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
                          {product.category}
                        </td>

                        <td className="py-4">
                          <span className={`font-bold ${isLowStock || isOutOfStock ? "text-red-500" : "text-slate-900"}`}>
                            {product.stock.toString().padStart(2, '0')} <span className="font-medium text-sm text-slate-400">units</span>
                          </span>
                        </td>

                        <td className="py-4 font-bold text-slate-900">
                          Rp {product.price.toLocaleString("id-ID")}
                        </td>

                        <td className="py-4">
                          {isOutOfStock ? (
                            <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-slate-900 text-white">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-red-200 text-red-600">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-emerald-200 text-emerald-600">
                              In Stock
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
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-slate-100 px-4 py-4 md:px-8 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Showing 1 to {filteredProducts.length} of {products.length} items
            </span>
            <div className="flex items-center gap-1">
               <button className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Previous</button>
               <button className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 border border-slate-900 rounded-lg">1</button>
               <button className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
               <button className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">3</button>
               <button className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
            </div>
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