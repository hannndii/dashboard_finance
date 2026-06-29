import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  await dbConnect();

  const transactions = await Transaction.find().sort({
    createdAt: -1,
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Penjualan");

  const totalRevenue = transactions.reduce(
    (sum, trx) => sum + trx.total,
    0
  );

  // =========================================================
  // TITLE
  // =========================================================
  worksheet.mergeCells("A1:E1");
  worksheet.getCell("A1").value = "LAPORAN PENJUALAN KANTIN";

  worksheet.getCell("A1").font = {
    bold: true,
    size: 18,
    color: { argb: "FFFFFF" },
  };

  worksheet.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "2563EB" },
  };

  worksheet.getRow(1).height = 28;

  // =========================================================
  // SUMMARY
  // =========================================================
  worksheet.getCell("A3").value = "Total Pendapatan";
  worksheet.getCell("B3").value = totalRevenue;

  worksheet.getCell("A4").value = "Total Transaksi";
  worksheet.getCell("B4").value = transactions.length;

  worksheet.getCell("A5").value = "Tanggal Export";
  worksheet.getCell("B5").value = new Date().toLocaleString("id-ID");

  ["A3", "A4", "A5"].forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true };
  });

  worksheet.getCell("B3").numFmt =
    '"Rp" #,##0';

  // =========================================================
  // TABLE HEADER
  // =========================================================
  const headerRow = worksheet.addRow([]);
  headerRow.commit();

  const tableHeader = worksheet.addRow([
    "Produk",
    "Qty",
    "Metode",
    "Total",
    "Tanggal",
  ]);

  tableHeader.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFF" },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E293B" },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // =========================================================
  // TABLE DATA
  // =========================================================
  transactions.forEach((trx, index) => {
    const row = worksheet.addRow([
      trx.productName,
      trx.qty,
      trx.paymentMethod,
      trx.total,
      new Date(trx.createdAt).toLocaleDateString("id-ID"),
    ]);

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "D1D5DB" } },
        bottom: { style: "thin", color: { argb: "D1D5DB" } },
        left: { style: "thin", color: { argb: "D1D5DB" } },
        right: { style: "thin", color: { argb: "D1D5DB" } },
      };

      cell.alignment = {
        vertical: "middle",
      };
    });

    // Zebra striping
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8FAFC" },
        };
      });
    }

    // Format rupiah di kolom Total
    row.getCell(4).numFmt = '"Rp" #,##0';
  });

  // =========================================================
  // AUTO WIDTH
  // =========================================================
  worksheet.columns = [
    { width: 30 },
    { width: 10 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  // =========================================================
  // GENERATE BUFFER
  // =========================================================
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="laporan-penjualan.xlsx"',
    },
  });
}