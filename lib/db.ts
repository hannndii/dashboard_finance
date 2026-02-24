import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Variabel MONGODB_URI belum ada di file .env.local");
}

// Caching connection agar Next.js tidak membuat koneksi baru setiap kali direfresh
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("⏳ Menyambungkan ke database...");
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log("✅ BERHASIL KONEK KE DATABASE FINANCE!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;