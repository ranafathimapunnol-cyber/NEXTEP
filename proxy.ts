import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Protected dashboard routes
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Logged-in users should not access auth pages
  if (
    token &&
    (pathname === "/login" ||
      pathname === "/register")
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};