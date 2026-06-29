"use client";

import { useState } from "react";
import { addTransaction, uploadToDrive } from "../action";
import { useFormStatus } from "react-dom";
import {
  Save,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon,
  X,
  Trash2,
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
      {isDisabled ? (
        <RefreshCw className="animate-spin" />
      ) : (
        <Save size={20} />
      )}

      {isUploading
        ? "Memproses Gambar..."
        : pending
        ? "Menyimpan Transaksi..."
        : "Simpan Transaksi"}
    </button>
  );
}

export default function InputPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const [cart, setCart] = useState<
    {
      productName: string;
      price: number;
      qty: number;
    }[]
  >([]);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const addToCart = (name: string, price: number) => {
    const existing = cart.find((item) => item.productName === name);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.productName === name
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productName: name,
          price,
          qty: 1,
        },
      ]);
    }
  };

  const removeItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQty = (index: number, type: "plus" | "minus") => {
    setCart(
      cart.map((item, i) =>
        i === index
          ? {
              ...item,
              qty:
                type === "plus"
                  ? item.qty + 1
                  : Math.max(1, item.qty - 1),
            }
          : item
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2097152) {
      alert("Ukuran gambar melebihi 2 MB!");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadToDrive(formData);

      if (res.status === "success" && res.url) {
        setReceiptUrl(res.url);
        setPreviewUrl(res.url);
      }
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
      } else {
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
        <div className="w-[760px] h-full bg-slate-50 shadow-2xl overflow-y-auto text-black">

          {/* HEADER */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-500 p-6 flex justify-between items-center z-10">
            <div>
              <h2 className="text-white text-2xl font-bold">
                Input Transaksi
              </h2>
              <p className="text-blue-100 text-sm">
                Tambahkan transaksi baru
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-6 space-y-6">

            {/* PRESETS */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">
                Menu Cepat
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addToCart(p.name, p.price)}
                    className="p-4 bg-white border-2 border-slate-300 rounded-xl shadow-sm text-left hover:bg-blue-600 hover:border-blue-600 group"
                  >
                    <div className="font-bold text-black group-hover:text-white">
                      {p.name}
                    </div>

                    <div className="text-sm mt-1 text-slate-700 group-hover:text-blue-100">
                      Rp {p.price.toLocaleString("id-ID")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CART */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">
                Daftar Pesanan
              </h3>

              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-black">
                        {item.productName}
                      </p>

                      <p className="text-slate-500">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() => updateQty(index, "minus")}
                        className="w-10 h-10 bg-slate-200 rounded-lg"
                      >
                        -
                      </button>

                      <span className="font-bold text-black">
                        {item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQty(index, "plus")}
                        className="w-10 h-10 bg-slate-200 rounded-lg"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <form action={formAction} className="space-y-5">

              <input
                type="hidden"
                name="cart"
                value={JSON.stringify(cart)}
              />

              {/* TOTAL */}
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-sm text-slate-700 font-semibold">
                  Total Pembayaran
                </p>

                <h3 className="text-3xl font-bold text-black">
                  {formatRp(total)}
                </h3>
              </div>

              {/* PAYMENT */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Metode Pembayaran
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash")}
                    className={`p-4 rounded-xl border-2 font-bold ${
                      paymentMethod === "Cash"
                        ? "bg-green-50 border-green-500"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    Tunai
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("QRIS")}
                    className={`p-4 rounded-xl border-2 font-bold ${
                      paymentMethod === "QRIS"
                        ? "bg-blue-50 border-blue-500"
                        : "bg-white border-slate-300"
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

              {/* QRIS */}
              {paymentMethod === "QRIS" && (
                <div className="border-2 border-slate-300 bg-white rounded-xl p-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-400 rounded-xl cursor-pointer"
                    >
                      <ImageIcon size={30} />
                      <p className="font-medium mt-2">
                        Upload bukti QRIS
                      </p>
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

              {message && (
                <p className="text-red-600 text-sm font-bold">
                  {message}
                </p>
              )}

              <SubmitButton isUploading={isUploading} />

            </form>
          </div>
        </div>
      </div>

      {/* SUCCESS */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <CheckCircle2
              size={60}
              className="text-green-500 mx-auto mb-4"
            />

            <h3 className="text-2xl font-bold text-black">
              Transaksi Berhasil
            </h3>
          </div>
        </div>
      )}
    </>
  );
}