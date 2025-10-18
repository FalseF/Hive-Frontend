import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL = "https://localhost:7287/api";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    console.log("Middleware called for:", url.pathname);

    const cookieHeader = req.headers.get("cookie") || "";
    const isLoginPage = url.pathname === "/login";

     const getCookie = (cookieHeader: string, cookieName: string): string | null => {
        const match = cookieHeader
            .split(';')
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith(`${cookieName}=`));
        return match ? match.split('=')[1] : null;
    };

    const accessToken = getCookie(cookieHeader, "accessToken");
    const refreshToken = getCookie(cookieHeader, "refreshToken");
  
   
    if (process.env.NODE_ENV === "development") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    try {

        let isAuthenticated = true;
        if(accessToken == null){
                console.log("called from middle ware token checked!");
                const res = await fetch(`${API_BASE_URL}/auth/access-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "cookie": cookieHeader,
                },
            });
           if (res.status === 401 || res.status === 403 || res.status === 400) {
                isAuthenticated = false;
            }
            const data = await res.json();
            // console.log("Response from backend:", data);
            // console.log("Backend response status:", res.status);
        }
       
        if (isLoginPage && isAuthenticated) {
            return NextResponse.redirect(new URL("/", req.url));
        }
      
        if ((!isLoginPage) && !isAuthenticated) {
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
