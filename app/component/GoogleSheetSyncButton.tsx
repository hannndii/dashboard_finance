'use client'

import { useState } from 'react';
import { CheckCircle2, Download, RefreshCw, AlertCircle } from 'lucide-react';

async function syncAllTransactionsToGoogleSheet() {
  const res = await fetch('/api/sync-google-sheet', { method: 'POST' });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json() as Promise<{ status: 'success' | 'error'; processed: number; inserted: number; message?: string }>;
}

export default function GoogleSheetSyncButton() {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const onClick = async () => {
    try {
      setStatus('syncing');
      setMessage('Syncing...');

      const result = await syncAllTransactionsToGoogleSheet();
      if (result.status === 'success') {
        setStatus('success');
        setMessage(`Berhasil: ${result.inserted}/${result.processed} transaksi ditambahkan.`);
      } else {
        setStatus('error');
        setMessage(result.message || 'Gagal sync ke Google Sheet.');
      }
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message || 'Gagal sync ke Google Sheet.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <button
        type="button"
        onClick={onClick}
        disabled={status === 'syncing'}
        className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border ${
          status === 'syncing'
            ? 'bg-slate-100 text-slate-500 border-slate-200'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
        }`}
      >
        {status === 'syncing' ? (
          <RefreshCw className="animate-spin" size={16} />
        ) : status === 'success' ? (
          <CheckCircle2 size={16} className="text-emerald-600" />
        ) : status === 'error' ? (
          <AlertCircle size={16} className="text-red-600" />
        ) : (
          <Download size={16} className="text-slate-600" />
        )}
        Sync ke Google Sheet
      </button>

      {message ? (
        <div className="text-xs text-slate-500 font-medium">{message}</div>
      ) : null}
    </div>
  );
}

