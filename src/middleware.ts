import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL = "https://localhost:7287/api";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    console.log("Middleware called for:", url.pathname);

    const cookieHeader = req.headers.get("cookie") || "";
    const isLoginPage = url.pathname === "/login";
   //console.log("Cookies sent from browser:", cookieHeader);

    // Only disable TLS verification in development
    if (process.env.NODE_ENV === "development") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cookie": cookieHeader,
            },
        });

        const data = await res.json();
        // console.log("Response from backend:", data);
        // console.log("Backend response status:", res.status);
       
        if (isLoginPage && res.status === 200) {
            return NextResponse.redirect(new URL("/", req.url));
        }
      
        if ((!isLoginPage) && (res.status === 401 || res.status === 403 || res.status === 400)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    } catch (err) {
        console.error("Middleware backend call failed:", err);
        if (!isLoginPage) return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!login|_next|api|static|favicon.ico).*)"],
    runtime: "nodejs",
};
