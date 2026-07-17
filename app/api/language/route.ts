import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { lang } = await req.json();
    
    if (lang === "id" || lang === "en") {
      const cookieStore = await cookies();
      cookieStore.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return NextResponse.json({ status: "success" });
    }
    
    return NextResponse.json({ status: "error", message: "Invalid language" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Failed to set language" }, { status: 500 });
  }
}
