// ============================================================================
// ⚡ MODULE: SERVER ACTIONS
// Kumpulan fungsi aksi server Next.js terpusat untuk interaksi database 
// (MongoDB), login auth, manajamen produk, dan transaksi.
// ============================================================================

"use server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";
import { appendRowToGoogleSheet } from "@/lib/googleSheets";
import { revalidatePath } from "next/cache";
import Admin from "@/models/Admin";
import { comparePassword } from "@/lib/auth";
import { cookies } from "next/headers";

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
    console.error("Upload Error:", e.message);

    return {
      status: "error",
      message: "Gagal memproses gambar.",
    };
  }
}


// =========================================================
// ACTION 2: Add Transaction (POS Multi Item)
// =========================================================
export async function addTransaction(
  prevState: any,
  formData: FormData
) {
  try {
    await dbConnect();

    const cartRaw = String(formData.get("cart") ?? "[]");
    const cart = JSON.parse(cartRaw);

    const paymentMethod = String(
      formData.get("paymentMethod") ?? "Cash"
    );

    const receiptUrl = String(
      formData.get("receiptUrl") ?? ""
    );

    if (!cart || cart.length === 0) {
      return {
        status: "error",
        message: "Keranjang masih kosong.",
      };
    }

    if (paymentMethod === "QRIS" && !receiptUrl) {
      return {
        status: "error",
        message: "Bukti transaksi QRIS wajib diunggah.",
      };
    }

    const createdAt = new Date();

    for (const item of cart) {
      const total = item.price * item.qty;

      // Save transaction
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

      // Reduce stock if product exists
      const product = await Product.findOne({
        name: item.productName,
      });

      if (product) {
        await Product.findByIdAndUpdate(product._id, {
          $inc: {
            stock: -item.qty,
          },
        });
      }

      // Append Google Sheets
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
        console.error("Google Sheets Error:", e);
      }
    }

    revalidatePath("/");
    revalidatePath("/transaction");
    revalidatePath("/stock");

    return {
      status: "success",
      message: "Transaksi berhasil disimpan!",
    };
  } catch (e: any) {
    console.error("Add Transaction Error:", e);

    return {
      status: "error",
      message: "Gagal menyimpan transaksi.",
    };
  }
}


// =========================================================
// ACTION 3: Get All Transactions
// =========================================================
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


// =========================================================
// ACTION 4: Delete Transaction
// =========================================================
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


// =========================================================
// ACTION 5: Update Transaction
// =========================================================
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
// ACTION 6: Dashboard Data
// =========================================================
export async function getDashboardData() {
  await dbConnect();

  const recentTransactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const products = await Product.find()
    .sort({ createdAt: -1 })
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
    products: JSON.parse(JSON.stringify(products)),
    today: todayStats[0] || {
      totalRevenue: 0,
      count: 0,
    },
    chart: chartData,
  };
}


// =========================================================
// ACTION 7: Get Products
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
// ACTION 8: Add Product
// =========================================================
export async function addProduct(formData: FormData) {
  try {
    await dbConnect();

    const name = formData.get("name")?.toString().trim();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const minStock = Number(formData.get("minStock"));
    const category = formData.get("category")?.toString().trim() || "Makanan Berat";
    const description = formData.get("description")?.toString().trim() || "";

    if (!name || !price || !stock || !minStock || !category) {
      return {
        status: "error",
      };
    }

    await Product.create({
      name,
      price,
      stock,
      minStock,
      category,
      description,
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
// ACTION 9: Delete Product
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
// ACTION 10: Update Product
// =========================================================
export async function updateProduct(id: string, formData: FormData) {
  try {
    await dbConnect();

    await Product.findByIdAndUpdate(id, {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      minStock: Number(formData.get("minStock")),
      category: formData.get("category")?.toString().trim() || "Makanan Berat",
      description: formData.get("description")?.toString().trim() || "",
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
// ACTION 11: Add Stock
// =========================================================
export async function addStock(id: string, qty: number) {
  try {
    await dbConnect();

    await Product.findByIdAndUpdate(id, {
      $inc: {
        stock: qty,
      },
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

// =========================================================
// ACTION 12: Admin Login
// =========================================================
export async function loginAdmin(formData: FormData) {
  try {
    const username = String(formData.get("username"));
    const password = String(formData.get("password"));

    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (username !== envUsername || password !== envPassword) {
      return {
        status: "error",
        message: "Username atau Password salah",
      };
    }

    (await cookies()).set("admin_session", "superadmin_active_session", {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Login Error:", error);

    return {
      status: "error",
      message: "Login gagal",
    };
  }
}