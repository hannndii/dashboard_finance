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
export async function addTransaction(
  prevState: any,
  formData: FormData
) {
  try {
    await dbConnect();

    // Ambil cart dari hidden input
    const cartRaw = String(formData.get("cart") ?? "[]");
    const cart = JSON.parse(cartRaw);

    const paymentMethod = String(
      formData.get("paymentMethod") ?? "Cash"
    );

    const receiptUrl = String(
      formData.get("receiptUrl") ?? ""
    );

    // Validasi cart kosong
    if (!cart || cart.length === 0) {
      return {
        message: "Keranjang masih kosong.",
        status: "error",
      };
    }

    // Validasi QRIS
    if (paymentMethod === "QRIS" && !receiptUrl) {
      return {
        message: "Bukti transaksi QRIS wajib diunggah.",
        status: "error",
      };
    }

    const createdAt = new Date();

    // Simpan semua item ke MongoDB
    for (const item of cart) {
      const total = item.price * item.qty;

      await Transaction.create({
        productName: item.productName,
        price: item.price,
        qty: item.qty,
        total,
        paymentMethod,
        receiptImage:
          paymentMethod === "QRIS" ? receiptUrl : null,
        createdAt,
      });

      // Append ke Google Sheets per item
      try {
        await appendRowToGoogleSheet({
          createdAt: createdAt.toISOString(),
          productName: item.productName,
          paymentMethod,
          price: item.price,
          qty: item.qty,
          total,
          receiptImage:
            paymentMethod === "QRIS" ? receiptUrl : null,
        });
      } catch (e) {
        console.error(
          "Google Sheets append gagal:",
          e
        );
      }
    }

    revalidatePath("/");
    revalidatePath("/transaction");

    return {
      message: "Transaksi berhasil disimpan!",
      status: "success",
    };
  } catch (e: any) {
    console.error("Add Transaction Error:", e);

    return {
      message: "Gagal menyimpan transaksi ke database.",
      status: "error",
    };
  }
}

export async function getAllTransactions() {
  try {
    await dbConnect();

    const transactions = await Transaction.find().sort({
      createdAt: -1,
    });

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return [];
  }
}

export async function deleteTransaction(id: string) {
  try {
    await dbConnect();

    await Transaction.findByIdAndDelete(id);

    revalidatePath("/transaction");

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Delete Transaction Error:", error);

    return {
      status: "error",
    };
  }
}

export async function updateTransaction(
  id: string,
  formData: FormData
) {
  try {
    await dbConnect();

    const price = Number(formData.get("price"));
    const qty = Number(formData.get("qty"));

    await Transaction.findByIdAndUpdate(id, {
      productName: formData.get("productName"),
      paymentMethod: formData.get("paymentMethod"),
      price,
      qty,
      total: price * qty,
    });

    revalidatePath("/transaction");

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Update Transaction Error:", error);

    return {
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
