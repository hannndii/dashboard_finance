import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { comparePassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, password } = await req.json();

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "Admin tidak ditemukan" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(
      password,
      admin.password
    );

    if (!valid) {
      return NextResponse.json(
        { status: "error", message: "Password salah" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      status: "success",
    });

    response.cookies.set("admin_session", admin._id.toString(), {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Login gagal",
      },
      { status: 500 }
    );
  }
}