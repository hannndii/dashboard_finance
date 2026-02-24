'use client'

import { useState } from 'react';
import { addTransaction } from '../action';
import { useFormStatus } from 'react-dom';
import { Save, RefreshCw, ShoppingBag } from 'lucide-react';

// Preset Menu Mochisan (Bisa ditambah nanti)
const PRESETS = [
  { name: 'Mochi Strawberry', price: 10000 },
  { name: 'Mochi Coklat', price: 10000 },
  { name: 'Mochi Matcha', price: 12000 },
  { name: 'Air Mineral', price: 3000 },
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
      {pending ? 'Menyimpan...' : 'Simpan Transaksi'}
    </button>
  );
}

export default function InputPage() {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');

  // Handle preset click
  const selectPreset = (p: typeof PRESETS[0]) => {
    setProduct(p.name);
    setPrice(p.price.toString());
  };

  const formAction = async (formData: FormData) => {
    const res = await addTransaction(null, formData);
    if (res.status === 'success') {
      // Reset form
      setProduct('');
      setPrice('');
      setQty(1);
      setMessage('✅ Berhasil!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 max-w-md mx-auto">
      <header className="mb-6 flex items-center gap-2 text-emerald-800">
        <ShoppingBag className="w-6 h-6" />
        <h1 className="text-xl font-bold">Kasir Mochisan</h1>
      </header>

      {/* Preset Buttons - Agar input secepat kilat */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => selectPreset(p)}
            className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm hover:border-emerald-500 hover:bg-emerald-50 text-left transition-colors"
          >
            <div className="text-slate-800">{p.name}</div>
            <div className="text-emerald-600 text-xs">Rp {p.price.toLocaleString()}</div>
          </button>
        ))}
      </div>

      <form action={formAction} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nama Produk</label>
          <input 
            name="productName"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ketik manual jika tidak ada di preset..."
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Harga (Rp)</label>
            <input 
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Jumlah</label>
            <div className="flex items-center">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 bg-slate-100 rounded-l-lg border border-slate-200">-</button>
              <input 
                name="qty"
                type="number"
                value={qty}
                readOnly
                className="w-full h-10 text-center border-y border-slate-200 focus:outline-none"
              />
              <button type="button" onClick={() => setQty(qty + 1)} className="w-10 h-10 bg-slate-100 rounded-r-lg border border-slate-200">+</button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <SubmitButton />
          {message && <p className="text-center text-emerald-600 mt-2 text-sm font-medium animate-pulse">{message}</p>}
        </div>
      </form>
    </div>
  );
}