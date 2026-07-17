"use client";

import { useState, useTransition } from "react";
import { addProduct } from "../action";
import { Loader2, X, Save } from "lucide-react";

export default function ProductModal({ onClose }: any) {
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");

    if (!name || !price || !stock || !minStock) {
      setError("Semua field wajib diisi.");
      return;
    }

    startTransition(async () => {
      const result = await addProduct(formData);

      if (result?.status === "success") {
        onClose();
      } else {
        setError("Gagal menyimpan produk.");
      }
    });
  }

  function handleCancel() {
    setName("");
    setPrice("");
    setStock("");
    setMinStock("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            Tambah Produk
          </h2>

          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">

          {/* Nama */}
          <input
            name="name"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

          {/* Harga */}
          <input
            name="price"
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

          {/* Stok */}
          <input
            name="stock"
            type="number"
            placeholder="Jumlah Stok"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

          {/* Minimum Stock */}
          <input
            name="minStock"
            type="number"
            placeholder="Minimal Stok Alert"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

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
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Simpan
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
              Batal
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}