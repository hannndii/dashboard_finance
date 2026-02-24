'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addTransaction, uploadToDrive } from '../action'; // 👈 Import fungsi upload baru
import { useFormStatus } from 'react-dom';
import { Save, RefreshCw, ShoppingBag, CheckCircle2, Image as ImageIcon } from 'lucide-react';

const PRESETS = [
  { name: 'Dimsum Goreng', price: 18000 },
  { name: 'Dimsum Kukus', price: 18000 },
  { name: 'Pisang Coklat', price: 1500 },
  { name: 'Air Mineral', price: 3000 },
];

// 👈 Kita tambah parameter isUploading agar tombol mati saat gambar sedang diproses
function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isUploading;
  
  return (
    <button 
      type="submit" 
      disabled={isDisabled}
      className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
        isUploading ? 'bg-slate-400 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
      }`}
    >
      {isDisabled ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
      {isUploading ? 'Menunggu Upload Gambar...' : pending ? 'Menyimpan Transaksi...' : 'Simpan Transaksi'}
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
  
  // State baru untuk alur upload
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Untuk tampilan
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null); // Link GDrive Asli

  const selectPreset = (p: typeof PRESETS[0]) => {
    setProduct(p.name);
    setPrice(p.price.toString());
  };

  // FUNGSI INI SEKARANG LANGSUNG MENGIRIM KE GOOGLE DRIVE
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2097152) {
      alert("Ukuran gambar melebihi 2 MB!");
      e.target.value = '';
      return;
    }

    setIsUploading(true); // Nyalakan animasi loading upload
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Tembak langsung ke Google Drive
      const res = await uploadToDrive(formData);
      
      if (res.status === 'success' && res.url) {
        // 2. Jika sukses, simpan Link URL dan tampilkan Preview
        setReceiptUrl(res.url); 
        setPreviewUrl(URL.createObjectURL(file)); 
      } else {
        alert(res.message);
        e.target.value = '';
      }
    } catch (error) {
      alert("Sistem sibuk, gagal menghubungi Google Drive.");
      e.target.value = '';
    } finally {
      setIsUploading(false); // Matikan animasi loading
    }
  };

  const formAction = async (formData: FormData) => {
    try {
      // Fungsi ini sekarang hanya mengirim teks dan Link GDrive ke MongoDB
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
    <div className="min-h-screen bg-slate-50 p-4 max-w-md mx-auto relative">
      <header className="mb-6 flex items-center gap-2 text-emerald-800">
        <ShoppingBag className="w-6 h-6" />
        <h1 className="text-xl font-bold">Input Pembelian</h1>
      </header>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
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
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
            placeholder="Ketik manual..."
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
              className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="0"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Jumlah</label>
            <div className="flex items-center">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 bg-slate-100 rounded-l-lg border border-slate-200 text-slate-600 hover:bg-slate-200">-</button>
              <input 
                name="qty"
                type="number"
                value={qty}
                readOnly
                className="w-full h-10 text-center border-y border-slate-200 focus:outline-none text-black bg-white"
              />
              <button type="button" onClick={() => setQty(qty + 1)} className="w-10 h-10 bg-slate-100 rounded-r-lg border border-slate-200 text-slate-600 hover:bg-slate-200">+</button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('Cash')}
              className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                paymentMethod === 'Cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              💵 Tunai
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('QRIS')}
              className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                paymentMethod === 'QRIS' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              📱 QRIS
            </button>
          </div>
          <input type="hidden" name="paymentMethod" value={paymentMethod} />
        </div>

        {paymentMethod === 'QRIS' && (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-semibold text-blue-800 uppercase mb-2">
              Upload Bukti Transfer QRIS (Maks 2 MB)
            </label>
            <div className="flex flex-col items-center justify-center w-full">
              
              {/* TAMPILAN LOADING UPLOAD */}
              {isUploading ? (
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg bg-white/50 animate-pulse">
                  <RefreshCw className="animate-spin text-blue-500 mb-2" size={24} />
                  <p className="text-sm font-medium text-blue-600">Menerbangkan ke Google Drive...</p>
                </div>
              ) : previewUrl ? (
                /* TAMPILAN PREVIEW (MUNCUL SETELAH SUKSES DI DRIVE) */
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-blue-300 shadow-sm group mb-2">
                  <img src={previewUrl} alt="Preview Bukti" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => {
                      setPreviewUrl(null);
                      setReceiptUrl(null); // Hapus juga link GDrive-nya
                      const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }} 
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg transition-transform active:scale-90"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* KOTAK UPLOAD AWAL */
                <label 
                  htmlFor="dropzone-file" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-blue-500">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <p className="mb-1 text-sm font-medium">Klik untuk upload gambar</p>
                    <p className="text-xs text-blue-400">PNG, JPG, JPEG</p>
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

              {/* INPUT TERSEMBUNYI: Membawa Link Asli GDrive ke Database */}
              <input type="hidden" name="receiptUrl" value={receiptUrl || ''} />

            </div>
          </div>
        )}

        {message && <p className="text-center text-red-500 mb-4 text-sm font-medium">{message}</p>}

        <div className="pt-2">
          {/* Oper state isUploading ke tombol agar tombol terkunci saat upload berlangsung */}
          <SubmitButton isUploading={isUploading} />
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-[300px] w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sukses!</h3>
            <p className="text-slate-500 text-sm">Data transaksi berhasil disimpan. Mengalihkan...</p>
          </div>
        </div>
      )}
    </div>
  );
}