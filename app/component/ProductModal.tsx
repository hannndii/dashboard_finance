"use client";

import { useState, useTransition } from "react";
import { addProduct } from "../action";
import { Loader2, X, Save } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function ProductModal({ onClose }: any) {
  const { dict } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [category, setCategory] = useState("Makanan Berat");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");

    if (!name || !price || !stock || !minStock || !category) {
      setError(dict.productModal.errorEmpty);
      return;
    }

    startTransition(async () => {
      const result = await addProduct(formData);

      if (result?.status === "success") {
        onClose();
      } else {
        setError(dict.productModal.errorAdd);
      }
    });
  }

  function handleCancel() {
    setName("");
    setPrice("");
    setStock("");
    setMinStock("");
    setCategory("Makanan Berat");
    setDescription("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[500px] shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            {dict.productModal.titleAdd}
          </h2>

          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-3 md:space-y-4">
          
          {/* Baris 1: Nama Produk */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
              {dict.productModal.name}
            </label>
            <input
              name="name"
              required
              placeholder={dict.productModal.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black focus:border-slate-500 focus:ring-0 outline-none transition-all"
            />
          </div>

          {/* Baris 2: Harga & Kategori */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
                {dict.productModal.price}
              </label>
              <input
                name="price"
                type="number"
                required
                placeholder={dict.productModal.price}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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

          {/* Baris 3: Stok & Min Stok */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
                {dict.productModal.stock}
              </label>
              <input
                name="stock"
                type="number"
                required
                placeholder={dict.productModal.stock}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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
                placeholder={dict.productModal.minStock}
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl text-black focus:border-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Baris 4: Deskripsi */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              name="description"
              placeholder="Deskripsi opsional..."
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
          <div className="flex gap-3 pt-2">

            {/* Simpan */}
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {dict.productModal.saving}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {dict.productModal.save}
                </>
              )}
            </button>

            {/* Batal */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-black px-4 py-3 rounded-lg"
            >
              {dict.productModal.cancel}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}