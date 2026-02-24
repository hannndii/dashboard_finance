// File: app/component/ReceiptViewer.tsx
'use client'

import { useState } from 'react';
import { ExternalLink, X, Download } from 'lucide-react';

export function ReceiptViewer({ base64Image }: { base64Image: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Lihat di Tabel */}
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors font-semibold"
      >
        <ExternalLink size={14} />
        Lihat
      </button>

      {/* Pop-up Modal (Muncul saat tombol diklik) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
          onClick={() => setIsOpen(false)} // Tutup jika background diklik
        >
          <div 
            className="relative bg-white rounded-xl p-4 max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200" 
            onClick={e => e.stopPropagation()} // Cegah klik di dalam kotak agar tidak menutup pop-up
          >
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Bukti Transfer QRIS</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-500 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Area Gambar */}
            <div className="overflow-auto border rounded-lg bg-slate-50 flex-1 flex justify-center items-center p-2">
              <img src={base64Image} alt="Bukti QRIS" className="max-w-full h-auto rounded" />
            </div>

            {/* Tombol Download (Aman dari blokir browser) */}
            <a 
              href={base64Image} 
              download={`Bukti_QRIS_${Date.now()}.png`} 
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={18} />
              Download Gambar
            </a>
            
          </div>
        </div>
      )}
    </>
  );
}