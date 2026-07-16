"use client";

import { useEffect, useState, useTransition, type ChangeEvent } from "react";
import AppShell from "../component/AppShell";
import { getProducts, addTransaction, uploadToDrive } from "../action";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  X,
  ShoppingCart
} from "lucide-react";

const categoryOptions = ["All", "Meals", "Drinks", "Snacks"];

function detectCategory(name: string) {
  const lower = name.toLowerCase();

  if (/(coffee|tea|juice|milk|latte|espresso|coke|soda|drink)/.test(lower)) {
    return "Minuman";
  }

  if (
    /(burger|rice|soup|salad|sandwich|noodle|pasta|meal|chicken|beef|fish|dish)/.test(
      lower,
    )
  ) {
    return "Makanan Berat";
  }

  if (/(snack|chips|cookie|cake|brownie|dessert|pastry|toast)/.test(lower)) {
    return "Cemilan";
  }

  return "Makanan Berat";
}

export default function TransactionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [isPending, startTransition] = useTransition();
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(
        data.map((product: any) => ({
          ...product,
          category: product.category || detectCategory(product.name),
        })),
      );
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    const existingIndex = cart.findIndex(
      (item) => item.productName === product.name,
    );

    if (existingIndex !== -1) {
      setCart((current) =>
        current.map((item, idx) =>
          idx === existingIndex ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
      return;
    }

    setCart((current) => [
      ...current,
      {
        productName: product.name,
        price: product.price,
        qty: 1,
      },
    ]);
  };

  const updateQty = (index: number, type: "plus" | "minus") => {
    setCart((current) =>
      current.map((item, idx) =>
        idx === index
          ? {
              ...item,
              qty: type === "plus" ? item.qty + 1 : Math.max(1, item.qty - 1),
            }
          : item,
      ),
    );
  };

  const removeItem = (index: number) => {
    setCart((current) => current.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setCart([]);
    setReceiptUrl("");
    setStatusMessage(null);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadToDrive(formData);
    if (result.status === "success") {
      setReceiptUrl(result.url ?? "");
      setStatusType("success");
      setStatusMessage("Bukti QRIS berhasil diunggah.");
    } else {
      setStatusType("error");
      setStatusMessage(result.message ?? "Gagal mengunggah bukti QRIS.");
    }
  };

  const handleSubmit = () => {
    if (cart.length === 0) {
      setStatusType("error");
      setStatusMessage("Keranjang masih kosong.");
      return;
    }

    if (paymentMethod === "QRIS" && !receiptUrl) {
      setStatusType("error");
      setStatusMessage("Unggah bukti pembayaran QRIS terlebih dahulu.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("cart", JSON.stringify(cart));
      formData.append("paymentMethod", paymentMethod);
      formData.append("receiptUrl", receiptUrl);

      const result = await addTransaction(null, formData);

      if (result.status === "success") {
        clearCart();
        setPaymentMethod("Cash");
        setStatusType("success");
        setStatusMessage(result.message ?? "Transaksi berhasil disimpan.");
        setIsMobileCartOpen(false);
      } else {
        setStatusType("error");
        setStatusMessage(result.message ?? "Gagal menyimpan transaksi.");
      }
    });
  };

  const FloatingBottomCart = () => {
    if (cart.length === 0) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 lg:hidden pointer-events-none">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-3xl bg-slate-900/95 backdrop-blur-md p-4 px-6 text-white shadow-2xl shadow-slate-900/50 pointer-events-auto transition-all">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-300">
              Total ({cart.length} item)
            </p>
            <p className="text-xl font-bold">{formatRp(total)}</p>
          </div>
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-md transition hover:bg-slate-100 hover:cursor-pointer"
          >
            <ShoppingCart size={18} />
            Selesaikan
          </button>
        </div>
      </div>
    );
  };

  const OrderPanel = () => (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-4 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Keranjang
        </p>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-red-600 hover:cursor-pointer"
        >
          <Trash2 size={14} />
          Bersihkan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="space-y-3">
          {cart.length === 0 ? (
            <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Keranjang kosong.
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.productName}-${index}`}
                className="relative flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 pr-10 shadow-sm transition hover:border-slate-300"
              >
                <div className="flex flex-1 flex-col items-center text-center">
                  <p className="text-sm font-bold leading-tight text-slate-900">
                    {item.productName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-3 rounded-full border border-slate-100 bg-slate-50 px-3 py-1">
                    <button
                      type="button"
                      onClick={() => updateQty(index, "minus")}
                      className="p-1 text-slate-500 hover:cursor-pointer hover:text-slate-900"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-xs font-bold text-slate-900">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(index, "plus")}
                      className="p-1 text-slate-500 hover:cursor-pointer hover:text-slate-900"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:cursor-pointer hover:bg-red-50 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-slate-50 p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span>{formatRp(total)}</span>
        </div>
        <div className="mb-4 flex items-center justify-between text-lg font-bold text-slate-900">
          <span>Total</span>
          <span>{formatRp(total)}</span>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Cash", icon: <DollarSign size={14} /> },
              { label: "QRIS", icon: <CreditCard size={14} /> },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setPaymentMethod(option.label)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition hover:cursor-pointer ${
                  paymentMethod === option.label
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === "QRIS" && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-2 text-xs font-semibold text-slate-900">
              Upload Bukti QRIS
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500"
            />
            {receiptUrl && (
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                Bukti berhasil diunggah.
              </div>
            )}
          </div>
        )}

        {statusMessage && (
          <div
            className={`mb-4 rounded-xl px-3 py-2 text-xs font-medium ${
              statusType === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:cursor-pointer hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Processing..." : "Selesaikan Transaksi"}
        </button>
      </div>
    </div>
  );

  return (
    <AppShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-24 lg:pb-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <section className="min-w-0 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Menu Items
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Pilih menu untuk ditambahkan ke keranjang.
                </p>
              </div>
            </div>

            <div className="relative w-full md:w-[360px]">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Quick Search Menu..."
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition hover:cursor-pointer ${
                    selectedCategory === category
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid min-w-0 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => addToCart(product)}
                      className="group flex min-h-[140px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md hover:cursor-pointer"
                      aria-label={`Tambah ${product.name} ke keranjang`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                            {product.category}
                          </p>
                          <h3 className="mt-3 text-lg font-semibold text-slate-900">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                          <Plus size={18} />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between text-slate-500">
                        <span>
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                          add
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    Tidak ada menu yang cocok.
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="hidden w-full lg:sticky lg:top-6 lg:block lg:self-start lg:h-[calc(100vh-3rem)] z-10">
            <OrderPanel />
          </aside>
        </div>
      </div>

      <FloatingBottomCart />

      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 pt-10 sm:items-center sm:p-6 lg:hidden">
          <div className="flex h-[85vh] w-full max-w-md flex-col">
            <div className="mb-3 flex shrink-0 justify-end">
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="rounded-full bg-white p-2 text-slate-600 shadow-sm hover:cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <OrderPanel />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
