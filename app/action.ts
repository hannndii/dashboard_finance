"use server";

import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";
import { appendRowToGoogleSheet } from "@/lib/googleSheets";
import { revalidatePath } from "next/cache";

// =========================================================
// ACTION 1: Upload Receipt (Base64)
// =========================================================
export async function uploadToDrive(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return {
        status: "error",
        message: "File kosong atau tidak terbaca.",
      };
    }

    if (file.size > 2097152) {
      return {
        status: "error",
        message: "Maksimal ukuran gambar adalah 2 MB!",
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    return {
      status: "success",
      url: base64Image,
    };
  } catch (e: any) {
    console.error("Error konversi gambar:", e.message);

    return {
      status: "error",
      message: "Gagal memproses gambar.",
    };
  }
}

// =========================================================
// ACTION 2: Add Transaction
// =========================================================
export async function addTransaction(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    const productName = String(formData.get("productName") ?? "");
    const price = Number(formData.get("price"));
    const qty = Number(formData.get("qty")) || 1;
    const paymentMethod = String(formData.get("paymentMethod") ?? "Cash");

    const receiptUrl = String(formData.get("receiptUrl") ?? "");

    if (!productName || !price) {
      return {
        message: "Data tidak lengkap",
        status: "error",
      };
    }

    if (paymentMethod === "QRIS" && !receiptUrl) {
      return {
        message: "Bukti transaksi QRIS wajib diunggah!",
        status: "error",
      };
    }

    const createdAt = new Date();

    await Transaction.create({
      productName,
      price,
      qty,
      total: price * qty,
      paymentMethod,
      receiptImage: paymentMethod === "QRIS" ? receiptUrl : null,
      createdAt,
    });

    try {
      await appendRowToGoogleSheet({
        createdAt: createdAt.toISOString(),
        productName,
        paymentMethod,
        price,
        qty,
        total: price * qty,
        receiptImage: paymentMethod === "QRIS" ? receiptUrl : null,
      });
    } catch (e) {
      console.error("Google Sheets append gagal:", e);
    }

    revalidatePath("/");

    return {
      message: "Transaksi berhasil disimpan!",
      status: "success",
    };
  } catch (e) {
    console.error("Add Transaction Error:", e);

    return {
      message: "Gagal menyimpan transaksi",
      status: "error",
    };
  }
}

// =========================================================
// ACTION 3: Dashboard Data
// =========================================================
export async function getDashboardData() {
  await dbConnect();

  const recentTransactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStats = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: today },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const chartData = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    recent: JSON.parse(JSON.stringify(recentTransactions)),
    today: todayStats[0] || {
      totalRevenue: 0,
      count: 0,
    },
    chart: chartData,
  };
}

// =========================================================
// ACTION 4: Get Products
// =========================================================
export async function getProducts() {
  try {
    await dbConnect();

    const products = await Product.find().sort({
      createdAt: -1,
    });

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Get Products Error:", error);
    return [];
  }
}

// =========================================================
// ACTION 5: Add Product
// =========================================================
export async function addProduct(formData: FormData) {
  try {
    await dbConnect();

    const name = formData.get("name")?.toString().trim();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const minStock = Number(formData.get("minStock"));

    if (!name || !price || !stock || !minStock) {
      return {
        status: "error",
      };
    }

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
  } catch (error) {
    console.error("Add Product Error:", error);

    return {
      status: "error",
    };
  }
}

// =========================================================
// ACTION 6: Delete Product
// =========================================================
export async function deleteProduct(id: string) {
  try {
    await dbConnect();

    await Product.findByIdAndDelete(id);

    revalidatePath("/stock");

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Delete Product Error:", error);

    return {
      status: "error",
    };
  }
}

// =========================================================
// ACTION 7: Update Product
// =========================================================
export async function updateProduct(id: string, formData: FormData) {
  try {
    await dbConnect();

    await Product.findByIdAndUpdate(id, {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      minStock: Number(formData.get("minStock")),
    });

    revalidatePath("/stock");

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Update Product Error:", error);

    return {
      status: "error",
    };
  }
}

// =========================================================
// ACTION 8: Add Stock
// =========================================================
export async function addStock(id: string, qty: number) {
  try {
    await dbConnect();

    await Product.findByIdAndUpdate(id, {
      $inc: { stock: qty },
    });

    revalidatePath("/stock");

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Add Stock Error:", error);

    return {
      status: "error",
    };
  }
}
