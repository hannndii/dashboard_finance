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
    <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50/50">
      <div className="flex shrink-0 items-center justify-between p-6 pb-2">
        <h3 className="text-lg font-bold text-slate-900">
          Current Order
        </h3>
        <button
          type="button"
          onClick={clearCart}
          className="text-[10px] font-medium text-slate-500 underline hover:text-red-500 hover:cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-4">
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-[1rem] border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              Cart is empty.
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.productName}-${index}`}
                className="flex items-center justify-between gap-3 bg-transparent group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                   <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex shrink-0 items-center justify-center">
                     <ShoppingCart size={16} className="text-slate-400" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-slate-900 truncate">
                       {item.productName}
                     </p>
                     <p className="text-[10px] text-slate-500">
                       Rp {item.price.toLocaleString("id-ID")}
                     </p>
                   </div>
                </div>

                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => updateQty(index, "minus")}
                    className="p-1 text-slate-400 hover:cursor-pointer hover:text-slate-900"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-4 text-center text-[10px] font-bold text-slate-900">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(index, "plus")}
                    className="p-1 text-slate-400 hover:cursor-pointer hover:text-slate-900"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                
                <div className="w-20 flex justify-end items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                     Rp {(item.price * item.qty).toLocaleString("id-ID")}
                  </span>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
          {cart.length > 0 && (
             <div className="text-center text-[10px] italic text-slate-400 mt-4">
                Scan QR or search to add more items
             </div>
          )}
        </div>
      </div>

      <div className="shrink-0 bg-white p-6 rounded-t-[1.5rem] shadow-[0_-4px_20px_rgb(0,0,0,0.03)] border-t border-slate-100">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">Subtotal</span>
          <span className="font-medium">{formatRp(total)}</span>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Total Amount</span>
          <span className="text-xl font-bold text-slate-900">{formatRp(total)}</span>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            {[
              { label: "Cash", icon: <DollarSign size={16} /> },
              { label: "Card / QR", icon: <CreditCard size={16} /> },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setPaymentMethod(option.label === "Card / QR" ? "QRIS" : option.label)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition hover:cursor-pointer ${
                  (paymentMethod === option.label || (paymentMethod === "QRIS" && option.label === "Card / QR"))
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
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-[10px] font-bold text-slate-900 uppercase">
              Upload Receipt
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500"
            />
            {receiptUrl && (
              <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-[10px] font-medium text-slate-700">
                Bukti berhasil diunggah.
              </div>
            )}
          </div>
        )}

        {statusMessage && (
          <div
            className={`mb-4 rounded-xl px-3 py-2 text-xs font-medium text-center ${
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
          className="w-full rounded-xl bg-slate-900 px-4 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:cursor-pointer hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Processing..." : "Complete Transaction"}
        </button>
      </div>
    </div>
  );

  return (
    <AppShell
      title="New Transaction"
      subtitle={
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
          Counter 02 • Register #4421
        </span>
      }
      rightElement={
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Quick Search Menu..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </div>
          <div className="hidden text-right sm:block pl-6 border-l border-slate-200">
            <p className="text-sm font-bold text-slate-900">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Shift: Lunch
            </p>
          </div>
        </div>
      }
    >
      <div className="mx-auto flex w-full flex-col gap-6 pb-24 lg:pb-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="min-w-0 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Menu Items
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold transition hover:cursor-pointer ${
                      selectedCategory === category
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => addToCart(product)}
                    className="group flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:cursor-pointer"
                  >
                    {/* Placeholder for Image */}
                    <div className="w-full h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                       <ShoppingCart className="text-slate-300" size={40} />
                    </div>

                    <div className="p-5">
                      <h3 className="text-sm font-bold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-[10px] text-slate-500 line-clamp-2">
                        Delicious {product.category.toLowerCase()} prepared fresh for you.
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-900 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                          <Plus size={16} />
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  Tidak ada menu yang cocok.
                </div>
              )}
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
