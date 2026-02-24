'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addTransaction, uploadToDrive } from '../action';
import { useFormStatus } from 'react-dom';
import { Save, RefreshCw, ShoppingBag, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';

const PRESETS = [
  { name: 'Dimsum Goreng', price: 18000 },
  { name: 'Dimsum Kukus', price: 18000 },
  { name: 'Pisang Coklat', price: 1500 },
  { name: 'Air Mineral', price: 3000 },
];

function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isUploading;
  
  return (
    <button 
      type="submit" 
      disabled={isDisabled}
      className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-4 ${
        isUploading ? 'bg-slate-400 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
      }`}
    >
      {isDisabled ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
      {isUploading ? 'Memproses Gambar...' : pending ? 'Menyimpan Transaksi...' : 'Simpan Transaksi'}
    </button>
  );
}

export default function InputPage() {
  const router = useRouter();
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null); 

  const selectPreset = (p: typeof PRESETS[0]) => {
    setProduct(p.name);
    setPrice(p.price.toString());
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2097152) {
      alert("Ukuran gambar melebihi 2 MB!");
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadToDrive(formData);
      
      if (res.status === 'success' && res.url) {
        setReceiptUrl(res.url); 
        setPreviewUrl(res.url); 
      } else {
        alert(res.message);
        e.target.value = '';
      }
    } catch (error) {
      alert("Gagal memproses gambar.");
      e.target.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const formAction = async (formData: FormData) => {
    try {
      const res = await addTransaction(null, formData);
      
      if (res?.status === 'success') {
        setShowPopup(true);
        setPreviewUrl(null);
        setReceiptUrl(null);
        setTimeout(() => {
          router.push('/'); 
        }, 2000); 
      } else if (res?.status === 'error') {
        setMessage(res.message);
      }
    } catch (error) {
      setMessage("Koneksi gagal saat menyimpan ke database.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* BAGIAN KIRI: Header & Preset Menu */}
        <div className="w-full md:w-5/12 bg-emerald-50 p-6 md:p-10 border-b md:border-b-0 md:border-r border-emerald-100 flex flex-col justify-center">
          <header className="mb-8 flex flex-col items-center md:items-start gap-2 text-emerald-800">
            <div className="bg-emerald-100 p-3 rounded-full mb-2">
              <ShoppingBag className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-center md:text-left">Kasir Kantin</h1>
            <p className="text-sm text-emerald-600 text-center md:text-left font-medium">Pilih menu cepat atau ketik manual di samping.</p>
          </header>

          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectPreset(p)}
                className="p-4 bg-white border border-emerald-200 rounded-xl shadow-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-left transition-all group"
              >
                <div className="font-bold text-slate-800 group-hover:text-white transition-colors">{p.name}</div>
                <div className="text-emerald-600 text-sm font-semibold group-hover:text-emerald-100 transition-colors mt-1">
                  Rp {p.price.toLocaleString('id-ID')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* BAGIAN KANAN: Form Input */}
        <div className="w-full md:w-7/12 p-6 md:p-10 bg-white">
          <form action={formAction} className="flex flex-col h-full justify-center space-y-5">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Produk</label>
              <input 
                name="productName"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                placeholder="Ketik manual nama produk..."
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Harga (Rp)</label>
                <input 
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                  placeholder="0"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jumlah</label>
                <div className="flex items-center h-[58px]">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-full bg-slate-100 rounded-l-xl border border-slate-200 text-slate-600 hover:bg-slate-200 font-bold text-lg transition-colors">-</button>
                  <input 
                    name="qty"
                    type="number"
                    value={qty}
                    readOnly
                    className="w-full h-full text-center border-y border-slate-200 focus:outline-none text-slate-800 font-bold text-lg bg-white"
                  />
                  <button type="button" onClick={() => setQty(qty + 1)} className="w-14 h-full bg-slate-100 rounded-r-xl border border-slate-200 text-slate-600 hover:bg-slate-200 font-bold text-lg transition-colors">+</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash')}
                  className={`p-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'Cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  💵 Tunai
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`p-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'QRIS' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  📱 QRIS
                </button>
              </div>
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
            </div>

            {paymentMethod === 'QRIS' && (
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-blue-800 uppercase mb-3">
                  Upload Bukti Transfer QRIS
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-xl bg-white/50 animate-pulse">
                      <RefreshCw className="animate-spin text-blue-500 mb-3" size={28} />
                      <p className="text-sm font-bold text-blue-600">Memproses Gambar...</p>
                    </div>
                  ) : previewUrl ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-blue-300 shadow-sm group">
                      <img src={previewUrl} alt="Preview Bukti" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => {
                          setPreviewUrl(null);
                          setReceiptUrl(null);
                          const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }} 
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg transition-transform active:scale-90"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <label 
                      htmlFor="dropzone-file" 
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-blue-500">
                        <ImageIcon className="w-10 h-10 mb-3 opacity-70" />
                        <p className="mb-1 text-sm font-bold">Klik untuk memilih gambar</p>
                        <p className="text-xs text-blue-400 font-medium">Maksimal 2 MB (PNG, JPG, JPEG)</p>
                      </div>
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  )}

                  <input type="hidden" name="receiptUrl" value={receiptUrl || ''} />
                </div>
              </div>
            )}

            {message && <p className="text-center text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg">{message}</p>}

            <SubmitButton isUploading={isUploading} />
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-[320px] w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Sukses!</h3>
            <p className="text-slate-500 font-medium">Transaksi berhasil dicatat.<br/>Kembali ke beranda...</p>
          </div>
        </div>
      )}
    </div>
  );
}