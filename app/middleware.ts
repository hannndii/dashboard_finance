// ============================================================================
// 🛡️ MODULE: AUTHENTICATION MIDDLEWARE
// Memblokir akses tamu ke rute terproteksi (/dashboard, /stock, /transaction, dll)
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_session");

  const isLoginPage = req.nextUrl.pathname === "/";

  // Jika tidak punya sesi dan mencoba akses halaman selain halaman utama (login)
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika sudah punya sesi dan mencoba akses halaman utama (login)
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/stock",
    "/transaction",
    "/report",
  ],
};