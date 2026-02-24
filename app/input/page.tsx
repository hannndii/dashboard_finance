"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTransaction } from "../action";
import { useFormStatus } from "react-dom";
import { Save, RefreshCw, ShoppingBag, CheckCircle2 } from "lucide-react";

// Preset Menu Mochisan
const PRESETS = [
  { name: "Dimsum Goreng", price: 18000 },
  { name: "Dimsum Kukus", price: 18000 },
  { name: "Pisang Coklat", price: 1500 },
  { name: "Air Mineral", price: 3000 },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
    >
      {pending ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
      {pending ? "Menyimpan..." : "Simpan Transaksi"}
    </button>
  );
}

export default function InputPage() {
  const router = useRouter();
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // State baru untuk mengontrol pop-up
  const [showPopup, setShowPopup] = useState(false);

  // Handle preset click
  const selectPreset = (p: (typeof PRESETS)[0]) => {
    setProduct(p.name);
    setPrice(p.price.toString());
  };

  const formAction = async (formData: FormData) => {
    const res = await addTransaction(null, formData);

    // Jika berhasil tersimpan di database
    if (res?.status === "success") {
      setShowPopup(true); // 1. Munculkan Pop-up

      // 2. Tunggu 2 detik agar pop-up terbaca, lalu pindah ke Home
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 max-w-md mx-auto relative">
      <header className="mb-6 flex items-center gap-2 text-emerald-800">
        <ShoppingBag className="w-6 h-6" />
        <h1 className="text-xl font-bold">Input Pembelian</h1>
      </header>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => selectPreset(p)}
            className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm hover:border-emerald-500 hover:bg-emerald-50 text-left transition-colors"
          >
            <div className="text-slate-800">{p.name}</div>
            <div className="text-emerald-600 text-xs">
              Rp {p.price.toLocaleString()}
            </div>
          </button>
        ))}
      </div>

      <form
        action={formAction}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            Nama Produk
          </label>
          <input
            name="productName"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            placeholder="Ketik manual jika tidak ada di preset..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Harga (Rp)
            </label>
            <input
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Jumlah
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 bg-slate-100 rounded-l-lg border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                -
              </button>
              <input
                name="qty"
                type="number"
                value={qty}
                readOnly
                className="w-full h-10 text-center border-y border-slate-200 focus:outline-none text-black bg-white"
              />
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 bg-slate-100 rounded-r-lg border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash")}
              className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                paymentMethod === "Cash"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              💵 Tunai
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("QRIS")}
              className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                paymentMethod === "QRIS"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              📱 QRIS
            </button>
          </div>
          {/* Input tersembunyi untuk mengirim data ke action.ts */}
          <input type="hidden" name="paymentMethod" value={paymentMethod} />
        </div>

        {paymentMethod === "QRIS" && (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-semibold text-blue-800 uppercase mb-2">
              Upload Bukti Transfer QRIS
            </label>

            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-blue-500">
                  <svg
                    className="w-8 h-8 mb-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-1 text-sm font-medium">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-xs text-blue-400">
                    PNG, JPG, JPEG (Maks. 5 MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  name="receiptImage"
                  type="file"
                  accept="image/*" // Hanya menerima file gambar
                  className="hidden"
                  required={paymentMethod === "QRIS"} // Wajib diisi jika milih QRIS
                />
              </label>
            </div>
          </div>
        )}

        <div className="pt-2">
          <SubmitButton />
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>

      {/* POP-UP OVERLAY MUNCUL JIKA BERHASIL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-[300px] w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sukses!</h3>
            <p className="text-slate-500 text-sm">
              Data transaksi berhasil disimpan. Mengalihkan ke Home...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
