"use client";

import { useState, useTransition } from "react";
import { updateTransaction } from "../action";
import { Save, Loader2, X } from "lucide-react";

export default function EditTransactionModal({
  transaction,
  onClose,
}: any) {
  const [isPending, startTransition] = useTransition();

  const [productName, setProductName] = useState(
    transaction.productName
  );
  const [price, setPrice] = useState(transaction.price);
  const [qty, setQty] = useState(transaction.qty);
  const [paymentMethod, setPaymentMethod] = useState(
    transaction.paymentMethod
  );

  const [error, setError] = useState("");

  const total = price * qty;

  async function handleSubmit(formData: FormData) {
    setError("");

    if (!productName.trim() || price <= 0 || qty <= 0) {
      setError("Data transaksi tidak valid.");
      return;
    }

    startTransition(async () => {
      const result = await updateTransaction(
        transaction._id,
        formData
      );

      if (result?.status === "success") {
        onClose();
      } else {
        setError("Gagal memperbarui transaksi.");
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-black">
            Edit Transaksi
          </h2>

          <button
            onClick={onClose}
            disabled={isPending}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-5">

          {/* Produk */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Nama Produk
            </label>

            <input
              name="productName"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-4 border-2 border-slate-300 rounded-xl text-black"
            />
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Harga
            </label>

            <input
              name="price"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-4 border-2 border-slate-300 rounded-xl text-black"
            />
          </div>

          {/* Qty */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Jumlah
            </label>

            <input
              name="qty"
              type="number"
              required
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full p-4 border-2 border-slate-300 rounded-xl text-black"
            />
          </div>

          {/* Payment */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Metode Pembayaran
            </label>

            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-4 border-2 border-slate-300 rounded-xl text-black"
            >
              <option>Cash</option>
              <option>QRIS</option>
            </select>
          </div>

          {/* Total Preview */}
          <div className="bg-slate-100 rounded-xl p-4">
            <p className="text-slate-500 text-sm">Total Transaksi</p>

            <h3 className="text-2xl font-bold text-black">
              Rp {total.toLocaleString("id-ID")}
            </h3>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-semibold">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3">

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
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

            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 py-3 rounded-xl text-black"
            >
              Batal
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}