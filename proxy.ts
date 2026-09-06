import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith("/dashboard");

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register";

  // Not logged in → dashboard is blocked
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Already logged in → don't allow login/register again
  if (isAuthRoute && token) {
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