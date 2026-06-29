"use client";

import { useState, useTransition } from "react";
import { updateTransaction } from "../action";
import { Save, Loader2, X } from "lucide-react";

export default function EditTransactionModal({
  transaction,
  onClose,
}: any) {
  const [isPending, startTransition] = useTransition();

  const [productName, setProductName] = useState(transaction.productName);
  const [price, setPrice] = useState(transaction.price);
  const [qty, setQty] = useState(transaction.qty);
  const [paymentMethod, setPaymentMethod] = useState(
    transaction.paymentMethod
  );

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateTransaction(transaction._id, formData);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px]">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            Edit Transaksi
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-semibold text-black">
              Nama Produk
            </label>
            <input
              name="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-4 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-black">
              Harga
            </label>
            <input
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-4 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-black">
              Jumlah
            </label>
            <input
              name="qty"
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full p-4 border rounded-lg text-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-black">
              Metode Pembayaran
            </label>
            <select
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-4 border rounded-lg text-black"
            >
              <option>Cash</option>
              <option>QRIS</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-yellow-500 text-white py-3 rounded-lg"
            >
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 py-3 rounded-lg"
            >
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}