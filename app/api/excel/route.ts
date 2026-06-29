import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  await dbConnect();

  const transactions = await Transaction.find().sort({
    createdAt: -1,
  });

  const rows = transactions.map((trx) => ({
    Produk: trx.productName,
    Qty: trx.qty,
    Metode: trx.paymentMethod,
    Harga: trx.price,
    Total: trx.total,
    Tanggal: new Date(trx.createdAt).toLocaleString("id-ID"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Laporan"
  );

  const excelBuffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new Response(excelBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        "attachment; filename=laporan-penjualan.xlsx",
    },
  });
}