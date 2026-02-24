'use server'

import dbConnect from "@/lib/db";
import Transaction from '@/models/Transaction';
import { revalidatePath } from 'next/cache';
import { google } from 'googleapis';
import { Readable } from 'stream';

// =========================================================
// ACTION 1: KHUSUS UPLOAD GAMBAR KE GOOGLE DRIVE
// =========================================================
export async function uploadToDrive(formData: FormData) {
  try {
    // 🚨 SISTEM DETEKTOR: Cek apakah Vercel benar-benar memberikan kuncinya ke kodingan
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Jika Vercel menyembunyikan variabelnya, website akan langsung protes!
    if (!clientEmail) return { status: 'error', message: '❌ ERROR VERCEL: GOOGLE_CLIENT_EMAIL kosong/tidak terbaca!' };
    if (!privateKey) return { status: 'error', message: '❌ ERROR VERCEL: GOOGLE_PRIVATE_KEY kosong/tidak terbaca!' };
    if (!folderId) return { status: 'error', message: '❌ ERROR VERCEL: GOOGLE_DRIVE_FOLDER_ID kosong/tidak terbaca!' };

    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return { status: 'error', message: 'File kosong atau tidak terbaca.' };
    }
    if (file.size > 2097152) {
      return { status: 'error', message: 'Maksimal ukuran gambar adalah 2 MB!' };
    }

    // Hubungkan ke Google Drive
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'), 
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    const drive = google.drive({ version: 'v3', auth });

    // Ubah jadi stream dan kirim ke Drive
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const driveRes = await drive.files.create({
      requestBody: {
        name: `QRIS_${Date.now()}_${file.name}`, 
        parents: [folderId], 
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id, webViewLink', 
    });

    return { status: 'success', url: driveRes.data.webViewLink };

  } catch (e: any) {
    console.error("Error Drive Asli:", e.message);
    return { status: 'error', message: `Gagal ke Google Drive: ${e.message}` };
  }
}

// =========================================================
// ACTION 2: KHUSUS SIMPAN TRANSAKSI KE MONGODB
// =========================================================
export async function addTransaction(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    
    const productName = formData.get('productName');
    const price = Number(formData.get('price'));
    const qty = Number(formData.get('qty')) || 1;
    const paymentMethod = formData.get('paymentMethod') || 'Cash';
    const receiptUrl = formData.get('receiptUrl') as string;

    if (!productName || !price) {
        return { message: 'Data tidak lengkap', status: 'error' };
    }

    if (paymentMethod === 'QRIS' && !receiptUrl) {
      return { message: 'Bukti transaksi QRIS wajib diunggah sampai selesai!', status: 'error' };
    }

    await Transaction.create({
      productName,
      price,
      qty,
      total: price * qty,
      paymentMethod,
      receiptImage: paymentMethod === 'QRIS' ? receiptUrl : null,
      createdAt: new Date(),
    });

  } catch (e) {
    return { message: 'Gagal menyimpan data ke Database', status: 'error' };
  }

  revalidatePath('/'); 
  return { message: 'Transaksi berhasil disimpan!', status: 'success' };
}

// =========================================================
// ACTION 3: AMBIL DATA DASHBOARD (TETAP SAMA)
// =========================================================
export async function getDashboardData() {
  await dbConnect();
  const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(10).lean(); 
  const today = new Date(); today.setHours(0,0,0,0);
  const todayStats = await Transaction.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" }, count: { $sum: 1 } } }
  ]);
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const chartData = await Transaction.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$total" } } },
    { $sort: { _id: 1 } }
  ]);
  return {
    recent: JSON.parse(JSON.stringify(recentTransactions)),
    today: todayStats[0] || { totalRevenue: 0, count: 0 },
    chart: chartData
  };
}