'use server'

import dbConnect from "@/lib/db";
import Transaction from '@/models/Transaction';
import { revalidatePath } from 'next/cache';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Fungsi untuk inisialisasi koneksi ke Google Drive
const getDriveService = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  return google.drive({ version: 'v3', auth });
};

export async function addTransaction(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    
    const productName = formData.get('productName');
    const price = Number(formData.get('price'));
    const qty = Number(formData.get('qty')) || 1;
    const paymentMethod = formData.get('paymentMethod') || 'Cash';

    if (!productName || !price) {
        return { message: 'Data tidak lengkap', status: 'error' };
    }

    let receiptUrl = null;
    
    if (paymentMethod === 'QRIS') {
      const file = formData.get('receiptImage') as File;
      
      if (file && file.size > 0) {
        if (file.size > 2097152) { 
          return { message: 'Gagal: Ukuran gambar maksimal 2 MB!', status: 'error' };
        }
        
        // 1. Ubah file gambar menjadi Stream agar bisa dikirim ke Google
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        // 2. Proses Upload ke Google Drive
        const drive = getDriveService();
        const driveRes = await drive.files.create({
          requestBody: {
            name: `QRIS_${Date.now()}_${file.name}`, 
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string], 
          },
          media: {
            mimeType: file.type,
            body: stream,
          },
          fields: 'id, webViewLink', 
        });

        // 3. Tangkap URL gambar dari Google Drive
        receiptUrl = driveRes.data.webViewLink;

      } else {
        return { message: 'Bukti transaksi QRIS wajib diunggah!', status: 'error' };
      }
    }

    // 4. Simpan URL Google Drive tersebut ke MongoDB Anda
    await Transaction.create({
      productName,
      price,
      qty,
      total: price * qty,
      paymentMethod,
      receiptImage: receiptUrl, // 👈 Sekarang isinya adalah Link Google Drive yang sangat ringan!
      createdAt: new Date(),
    });

  } catch (e: any) {
    console.error("Error upload:", e.message); // Membantu nge-cek error di terminal
    return { message: 'Gagal menyimpan data', status: 'error' };
  }

  revalidatePath('/'); 
  return { message: 'Transaksi berhasil disimpan!', status: 'success' };
}

// =========================================================
// Action untuk Ambil Data Dashboard (Tidak ada yang berubah)
// =========================================================
export async function getDashboardData() {
  await dbConnect();

  const recentTransactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean(); 

  const today = new Date();
  today.setHours(0,0,0,0);
  
  const todayStats = await Transaction.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" }, count: { $sum: 1 } } }
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const chartData = await Transaction.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    recent: JSON.parse(JSON.stringify(recentTransactions)),
    today: todayStats[0] || { totalRevenue: 0, count: 0 },
    chart: chartData
  };
}