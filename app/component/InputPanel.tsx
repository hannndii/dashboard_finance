"use client";

import { useState } from "react";
import { addTransaction, uploadToDrive } from "../action";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Save,
  X,
  ShoppingCart,
  Package,
} from "lucide-react";

export default function InputPanel({
  products,
  onClose,
}: {
  products: any[];
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  const [manualName, setManualName] = useState("");
  const [manualPrice, setManualPrice] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [receiptUrl, setReceiptUrl] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existing = cart.find(
      (item) => item.productName === product.name
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.productName === product.name
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productName: product.name,
          price: product.price,
          qty: 1,
        },
      ]);
    }
  };

  const addManualProduct = () => {
    if (!manualName || !manualPrice) return;

    setCart([
      ...cart,
      {
        productName: manualName,
        price: Number(manualPrice),
        qty: 1,
      },
    ]);

    setManualName("");
    setManualPrice("");
  };

  const updateQty = (index: number, type: string) => {
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

  const removeItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  async function handleSubmit(formData: FormData) {
    formData.append("cart", JSON.stringify(cart));
    formData.append("paymentMethod", paymentMethod);
    formData.append("receiptUrl", receiptUrl);

    await addTransaction(null, formData);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="w-[1300px] h-[90vh] bg-white rounded-2xl overflow-hidden flex shadow-2xl">

        {/* LEFT SIDE */}
        <div className="w-1/2 border-r border-slate-200 p-6 overflow-y-auto">

          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">
              Pilih Produk
            </h2>

            <button onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 border rounded-xl p-4 mb-6">
            <Search size={18} />
            <input
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-black"
            />
          </div>

          {/* Product list */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => addToCart(product)}
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-blue-50 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-black">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Manual input */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-black">
              Input Manual
            </h3>

            <div className="space-y-3">
              <input
                placeholder="Nama barang"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full p-4 border rounded-xl text-black"
              />

              <input
                type="number"
                placeholder="Harga"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                className="w-full p-4 border rounded-xl text-black"
              />

              <button
                onClick={addManualProduct}
                className="w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                Tambah Manual
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 p-6 flex flex-col">

          <h2 className="text-2xl font-bold text-black mb-6">
            Keranjang
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3">

            {cart.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 flex justify-between items-center"
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
                    onClick={() => updateQty(index, "minus")}
                    className="w-8 h-8 bg-slate-200 rounded-lg"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-bold text-black">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => updateQty(index, "plus")}
                    className="w-8 h-8 bg-slate-200 rounded-lg"
                  >
                    <Plus size={16} />
                  </button>

                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-100 p-2 rounded-lg text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </div>
            ))}

          </div>

          {/* Footer */}
          <form action={handleSubmit} className="border-t pt-6 mt-6">

            <div className="mb-4">
              <p className="text-slate-500">Total</p>
              <h3 className="text-3xl font-bold text-black">
                Rp {total.toLocaleString("id-ID")}
              </h3>
            </div>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-4 border rounded-xl text-black mb-4"
            >
              <option>Cash</option>
              <option>QRIS</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Simpan Transaksi
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}