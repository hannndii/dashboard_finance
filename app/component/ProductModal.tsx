"use client";

import { addProduct } from "../action";

export default function ProductModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px]">
        <h2 className="text-2xl font-bold mb-6 text-black">Tambah Produk</h2>

        <form
          action={async (formData) => {
            await addProduct(formData);
            onClose();
          }}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Nama Produk"
            className="w-full p-4 border rounded-lg text-black"
          />

          <input
            name="price"
            type="number"
            placeholder="Harga"
            className="w-full p-4 border rounded-lg text-black"
          />

          <input
            name="stock"
            type="number"
            placeholder="Stok"
            className="w-full p-4 border rounded-lg text-black"
          />

          <input
            name="minStock"
            type="number"
            placeholder="Minimal Stok"
            className="w-full p-4 border rounded-lg text-black"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-lg"
            >
              Simpan
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 px-4 py-3 rounded-lg"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
