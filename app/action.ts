'use server'

import dbConnect from "@/lib/db";
import Transaction from '@/models/Transaction';
import { appendRowToGoogleSheet } from '@/lib/googleSheets';
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

// =========================================================
// ACTION 1: PROSES GAMBAR MENJADI TEKS (BASE64)
// =========================================================
// Kita tetap pakai nama fungsi "uploadToDrive" agar file tampilan (page.tsx) tidak error, 
// tapi isinya kita ganti jadi pemroses Base64 MongoDB.
export async function uploadToDrive(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return { status: 'error', message: 'File kosong atau tidak terbaca.' };
    }
    if (file.size > 2097152) {
      return { status: 'error', message: 'Maksimal ukuran gambar adalah 2 MB!' };
    }

    // 1. Ubah file gambar fisik menjadi kode Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 2. Rangkai menjadi format Base64 (Teks panjang pengantin gambar)
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 3. Kembalikan teks panjang ini ke halaman depan untuk dipreview dan disimpan
    return { status: 'success', url: base64Image };

  } catch (e: any) {
    console.error("Error konversi gambar:", e.message);
    return { status: 'error', message: 'Gagal memproses gambar untuk database.' };
  }
}

// =========================================================
// ACTION 2: KHUSUS SIMPAN TRANSAKSI KE MONGODB
// =========================================================
export async function addTransaction(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    
    const productName = String(formData.get('productName') ?? '');
    const price = Number(formData.get('price'));
    const qty = Number(formData.get('qty')) ?? 1;
    const paymentMethod = String(formData.get('paymentMethod') ?? 'Cash');
    
    // Tangkap kode Base64 gambar dari input tersembunyi
    const receiptUrl = String(formData.get('receiptUrl') ?? '');

    if (!productName || !price) {
        return { message: 'Data tidak lengkap', status: 'error' };
    }

    if (paymentMethod === 'QRIS' && !receiptUrl) {
      return { message: 'Bukti transaksi QRIS wajib diunggah sampai selesai!', status: 'error' };
    }

    // Simpan semua data langsung ke dalam MongoDB Anda
    const createdAt = new Date();
    const trx = await Transaction.create({
      productName,
      price,
      qty,
      total: price * qty,
      paymentMethod,
      receiptImage: paymentMethod === 'QRIS' ? receiptUrl : null,
      createdAt,
    });

    // Real-time append ke Google Spreadsheet (jika konfigurasi env tersedia)
    try {
      await appendRowToGoogleSheet({
        createdAt: createdAt.toISOString(),
        productName,
        paymentMethod,
        price,
        qty,
        total: price * qty,
        receiptImage: paymentMethod === 'QRIS' ? receiptUrl : null,
      });
    } catch (e) {
      console.error('Google Sheets append gagal:', e);
      // transaksi tetap dianggap sukses (kegagalan export tidak menggagalkan input kasir)
    }



  } catch (e) {
    return { message: 'Gagal menyimpan data ke Database', status: 'error' };
  }

  revalidatePath('/'); 
  return { message: 'Transaksi berhasil disimpan!', status: 'success' };
}

// =========================================================
// ACTION 3: AMBIL DATA DASHBOARD
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

export async function getProducts() {
  const products = await Product.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(products));
}

export async function addProduct(formData: FormData) {
  const name = formData.get("name");
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const minStock = Number(formData.get("minStock"));

  await Product.create({
    name,
    price,
    stock,
    minStock,
  });

  revalidatePath("/stock");

  return {
    status: "success",
  };
}

export async function deleteProduct(id: string) {
  await Product.findByIdAndDelete(id);

  revalidatePath("/stock");
}

export async function updateProduct(
  id: string,
  formData: FormData
) {
  await Product.findByIdAndUpdate(id, {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    minStock: Number(formData.get("minStock")),
  });

  revalidatePath("/stock");
}

export async function addStock(id: string, qty: number) {
  try {
    await Product.findByIdAndUpdate(id, {
      $inc: { stock: qty },
    });

    revalidatePath("/stock");

    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}

