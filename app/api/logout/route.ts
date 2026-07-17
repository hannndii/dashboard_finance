import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    status: "success",
  });

  response.cookies.set("admin_session", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}