import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return NextResponse.json({
        message: "ENV admin belum diset",
      });
    }

    const existing = await Admin.findOne({ username });

    if (existing) {
      return NextResponse.json({
        message: "Admin sudah ada",
      });
    }

    const hashedPassword = await hashPassword(password);

    await Admin.create({
      username,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "Admin berhasil dibuat",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: "Gagal membuat admin",
    });
  }
}