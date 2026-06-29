"use client";

import { useState } from "react";
import { addTransaction, uploadToDrive } from "../action";
import { useFormStatus } from "react-dom";
import {
  Save,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Image as ImageIcon,
  X,
} from "lucide-react";

const PRESETS = [
  { name: "Dimsum Goreng", price: 18000 },
  { name: "Dimsum Kukus", price: 18000 },
  { name: "Pisang Coklat", price: 1500 },
  { name: "Air Mineral", price: 3000 },
];

function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isUploading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-4 ${
        isUploading
          ? "bg-slate-400 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
      }`}
    >
      {isDisabled ? <RefreshCw className="animate-spin" /> : <Save size={20} />}

      {isUploading
        ? "Memproses Gambar..."
        : pending
          ? "Menyimpan Transaksi..."
          : "Simpan Transaksi"}
    </button>
  );
}

export default function InputPanel({ onClose }: { onClose: () => void }) {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const selectPreset = (p: (typeof PRESETS)[0]) => {
    setProduct(p.name);
    setPrice(p.price.toString());
  };

  const total = Number(price || 0) * qty;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2097152) {
      alert("Ukuran gambar melebihi 2 MB!");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadToDrive(formData);

      if (res.status === "success" && res.url) {
        setReceiptUrl(res.url);
        setPreviewUrl(res.url);
      } else {
        alert(res.message);
        e.target.value = "";
      }
    } catch {
      alert("Gagal upload gambar.");
      e.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const formAction = async (formData: FormData) => {
    try {
      const res = await addTransaction(null, formData);

      if (res?.status === "success") {
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
          onClose();
        }, 1500);
      } else if (res?.status === "error") {
        setMessage(res.message);
      }
    } catch {
      setMessage("Koneksi gagal ke database.");
    }
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
        <div className="w-[760px] h-full bg-white shadow-2xl overflow-y-auto">
          {/* HEADER */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-500 p-6 flex justify-between items-center z-10">
            <div>
              <h2 className="text-white text-2xl font-bold">Input Transaksi</h2>
              <p className="text-blue-100 text-sm">Tambahkan transaksi baru</p>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X size={22} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-6">
            {/* PRESET */}
            <div>
              <h3 className="text-lg font-bold text-slate-700 mb-4">
                Menu Cepat
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectPreset(p)}
                    className="p-4 bg-white border border-blue-200 rounded-xl shadow-sm transition-all text-left hover:bg-blue-600 hover:border-blue-600 group"
                  >
                    <div className="font-bold text-slate-800 group-hover:text-white transition-colors">
                      {p.name}
                    </div>

                    <div className="text-sm mt-1 text-slate-500 group-hover:text-blue-100 transition-colors">
                      Rp {p.price.toLocaleString("id-ID")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* FORM */}
            <form action={formAction} className="space-y-5">
              {/* Product */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nama Produk
                </label>
                <input
                  name="productName"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full p-4 border rounded-xl"
                  required
                />
              </div>

              {/* Price + Qty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Harga
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-4 border rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Jumlah
                  </label>

                  <div className="flex items-center h-[56px]">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-14 h-full bg-slate-100 rounded-l-xl"
                    >
                      -
                    </button>

                    <input
                      name="qty"
                      value={qty}
                      readOnly
                      className="w-full text-center border-y h-full"
                    />

                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="w-14 h-full bg-slate-100 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Total</p>
                <h3 className="text-3xl font-bold text-blue-700">
                  {formatRp(total)}
                </h3>
              </div>

              {/* Payment */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Metode Pembayaran
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash")}
                    className={`p-4 rounded-xl border ${
                      paymentMethod === "Cash"
                        ? "bg-green-50 border-green-500"
                        : ""
                    }`}
                  >
                    Tunai
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("QRIS")}
                    className={`p-4 rounded-xl border ${
                      paymentMethod === "QRIS"
                        ? "bg-blue-50 border-blue-500"
                        : ""
                    }`}
                  >
                    QRIS
                  </button>
                </div>

                <input
                  type="hidden"
                  name="paymentMethod"
                  value={paymentMethod}
                />
              </div>

              {/* QRIS Upload */}
              {paymentMethod === "QRIS" && (
                <div className="border border-blue-200 rounded-xl p-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer"
                    >
                      <ImageIcon size={30} />
                      <p>Upload bukti QRIS</p>
                    </label>
                  )}

                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={receiptUrl || ""}
                  />
                </div>
              )}

              {/* ERROR */}
              {message && (
                <p className="text-red-500 text-sm font-bold">{message}</p>
              )}

              <SubmitButton isUploading={isUploading} />
            </form>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />

            <h3 className="text-2xl font-bold text-slate-700">
              Transaksi Berhasil
            </h3>
          </div>
        </div>
      )}
    </>
  );
}
