"use client";

import { useState, useTransition } from "react";
import { updateProduct } from "../action";
import { Loader2, X, Save } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function EditProductModal({
  product,
  onClose,
}: any) {
  const { dict } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [minStock, setMinStock] = useState(product.minStock);
  const [category, setCategory] = useState(product.category || "Makanan Berat");
  const [description, setDescription] = useState(product.description || "");

  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");

    if (
      !name.trim() ||
      price <= 0 ||
      stock < 0 ||
      minStock < 0 ||
      !category.trim()
    ) {
      setError(dict.productModal.errorValid);
      return;
    }

    startTransition(async () => {
      const result = await updateProduct(product._id, formData);

      if (result?.status === "success") {
        onClose();
      } else {
        setError(dict.productModal.errorEdit);
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">
            {dict.productModal.titleEdit}
          </h2>

          <button
            onClick={onClose}
            disabled={isPending}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-3 md:space-y-4">
          
          {/* Baris 1: Nama Produk (Full) */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
              {dict.productModal.name}
            </label>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black focus:border-slate-500 focus:ring-0 outline-none transition-all"
            />
          </div>

          {/* Baris 2: Harga & Kategori (2 Kolom) */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
                {dict.productModal.price}
              </label>
              <input
                name="price"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black focus:border-slate-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
                Kategori
              </label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black bg-white focus:border-slate-500 outline-none transition-all"
              >
                <option value="Makanan Berat">Makanan Berat</option>
                <option value="Minuman">Minuman</option>
                <option value="Cemilan">Cemilan</option>
              </select>
            </div>
          </div>

          {/* Baris 3: Stok & Min Stok (2 Kolom) */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
                {dict.productModal.stock}
              </label>
              <input
                name="stock"
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black focus:border-slate-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
                {dict.productModal.minStock}
              </label>
              <input
                name="minStock"
                type="number"
                required
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black focus:border-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Baris 4: Deskripsi (Full) */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black resize-none h-20 focus:border-slate-500 outline-none transition-all"
            ></textarea>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-semibold">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {dict.productModal.saving}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {dict.productModal.saveEdit}
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-black px-4 py-3 rounded-xl"
            >
              {dict.productModal.cancel}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}