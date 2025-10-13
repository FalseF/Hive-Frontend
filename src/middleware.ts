import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL = "https://localhost:7287/api";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  console.log("🔹 Middleware called for:", url.pathname);

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
  return NextResponse.redirect(new URL("/temp", req.url));
  // Skip auth check for login/register routes
  // if (url.pathname.startsWith("/login") || url.pathname.startsWith("/register")) {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
  //       method: "POST",
  //       credentials: "include",
  //     });

  //     if (res.ok) {
  //       return NextResponse.redirect(new URL("/", req.url));
  //     }
  //   } catch (err) {
  //     console.error("Refresh token check failed:", err);
  //   }

  //   return NextResponse.next();
  // }

  // // For all other routes, verify refresh token
  // try {
  //   const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
  //     method: "POST",
  //     credentials: "include",
  //   });

  //   if (!res.ok) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }

  //   return NextResponse.next();
  // } catch (err) {
  //   console.error("Error calling backend:", err);
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
}

export const config = {
  matcher: ["/login/:path*"],
}