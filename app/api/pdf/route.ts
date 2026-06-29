import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import PDFDocument from "pdfkit";

export async function GET() {
  await dbConnect();

  const transactions = await Transaction.find().sort({
    createdAt: -1,
  });

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  const buffers: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => {
    buffers.push(chunk);
  });

  // Header
  doc.fontSize(20).text("Laporan Penjualan", {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(12);

  let totalRevenue = 0;

  transactions.forEach((trx, index) => {
    totalRevenue += trx.total;

    doc.text(`${index + 1}. ${trx.productName}`);
    doc.text(
      `Qty: ${trx.qty} | Metode: ${trx.paymentMethod} | Total: Rp ${trx.total.toLocaleString(
        "id-ID",
      )}`,
    );
    doc.text(`Tanggal: ${new Date(trx.createdAt).toLocaleDateString("id-ID")}`);

    doc.moveDown();
  });

  doc.moveDown();

  doc
    .fontSize(14)
    .text(`Total Pendapatan: Rp ${totalRevenue.toLocaleString("id-ID")}`, {
      align: "right",
    });

  doc.end();

  const pdfBuffer: Buffer = await new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });

  const arrayBuffer = new ArrayBuffer(pdfBuffer.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < pdfBuffer.length; i++) {
    uint8Array[i] = pdfBuffer[i];
  }

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="laporan-penjualan.pdf"',
    },
  });
}
