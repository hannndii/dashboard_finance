"use client";

import { useState, useTransition } from "react";
import { updateProduct } from "../action";
import { Loader2, X, Save } from "lucide-react";

export default function EditProductModal({
  product,
  onClose,
}: any) {
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [minStock, setMinStock] = useState(product.minStock);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");

    if (!name || !price || !stock || !minStock) {
      setError("Semua field wajib diisi.");
      return;
    }

    startTransition(async () => {
      const result = await updateProduct(product._id, formData);

      if (result?.status === "success") {
        onClose();
      } else {
        setError("Gagal memperbarui produk.");
      }
    });
  }

  function handleCancel() {
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            Edit Produk
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

          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

          <input
            name="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

          <input
            name="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

          <input
            name="minStock"
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="w-full p-4 border-2 border-slate-300 rounded-lg text-black"
          />

          {error && (
            <p className="text-red-500 text-sm font-semibold">
              {error}
            </p>
          )}

          <div className="flex gap-3">

            {/* Save */}
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Simpan Perubahan
                </>
              )}
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={handleCancel}
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