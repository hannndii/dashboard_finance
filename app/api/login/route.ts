import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (username !== envUsername || password !== envPassword) {
      return NextResponse.json(
        { status: "error", message: "Username atau Password salah" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      status: "success",
    });

    response.cookies.set("admin_session", "superadmin_active_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Login gagal",
      },
      { status: 500 }
    );
  }
}