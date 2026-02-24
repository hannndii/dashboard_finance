'use server'

import dbConnect from "@/lib/db";
import Transaction from '@/models/Transaction';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Action untuk Input Data
export async function addTransaction(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    
    const productName = formData.get('productName');
    const price = Number(formData.get('price'));
    const qty = Number(formData.get('qty')) || 1;

    // Validasi sederhana
    if (!productName || !price) return { message: 'Data tidak lengkap', status: 'error' };

    await Transaction.create({
      productName,
      price,
      qty,
      total: price * qty,
      createdAt: new Date(),
    });

    revalidatePath('/'); // Refresh dashboard
    redirect('/');

    return { message: 'Transaksi berhasil disimpan!', status: 'success' };
  } catch (e) {
    return { message: 'Gagal menyimpan data', status: 'error' };
  }
}

// Action untuk Ambil Data Dashboard
export async function getDashboardData() {
  await dbConnect();

  // 1. Ambil 20 transaksi terakhir
  const recentTransactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean(); 

  // 2. Hitung Total Omset Hari Ini
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const todayStats = await Transaction.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" }, count: { $sum: 1 } } }
  ]);

  // 3. Data Grafik 7 Hari Terakhir
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