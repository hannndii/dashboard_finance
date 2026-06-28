import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { appendRowToGoogleSheet } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await dbConnect();

    const transactions = await Transaction.find().sort({ createdAt: 1 }).lean();

    let processed = 0;
    let inserted = 0;

    for (const trx of transactions) {
      processed += 1;

      try {
        await appendRowToGoogleSheet({
          createdAt: trx.createdAt ? new Date(trx.createdAt).toISOString() : new Date().toISOString(),
          productName: trx.productName ?? '',
          paymentMethod: trx.paymentMethod ?? 'Cash',
          price: trx.price ?? 0,
          qty: trx.qty ?? 1,
          total: trx.total ?? (trx.price ?? 0) * (trx.qty ?? 1),
          receiptImage: trx.paymentMethod === 'QRIS' ? (trx.receiptImage ?? null) : null,
        });
        inserted += 1;
      } catch (e) {
        console.error('Append row gagal:', e);
      }
    }

    return NextResponse.json({
      status: 'success',
      processed,
      inserted,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        status: 'error',
        processed: 0,
        inserted: 0,
        message: e?.message || 'Gagal sync',
      },
      { status: 500 }
    );
  }
}

