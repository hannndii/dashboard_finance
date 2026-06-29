import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import ExcelJS from "exceljs";

export async function GET() {
  await dbConnect();

  const transactions = await Transaction.find().sort({
    createdAt: -1,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Laporan");

  sheet.columns = [
    { header: "Produk", key: "productName", width: 30 },
    { header: "Qty", key: "qty", width: 10 },
    { header: "Metode", key: "paymentMethod", width: 15 },
    { header: "Total", key: "total", width: 20 },
    { header: "Tanggal", key: "createdAt", width: 20 },
  ];

  transactions.forEach((trx) => {
    sheet.addRow({
      productName: trx.productName,
      qty: trx.qty,
      paymentMethod: trx.paymentMethod,
      total: trx.total,
      createdAt: trx.createdAt.toLocaleDateString("id-ID"),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        "attachment; filename=laporan-penjualan.xlsx",
    },
  });
}