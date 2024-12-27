import { NextRequest, NextResponse } from "next/server";
import { decrypt, getSession } from "./lib/session";

const protectedRoutes = ["/^/users/w+$/,  /^/bookings/w+$/"];
const publicRoutes = ["/login", "/register"];
const adminRoutes = [
  "/users",
  "/bookings",
  "/customers",
  "/flights",
  "/^/users/w+$/,  /^/bookings/w+$/",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);

  const cookie = await getSession();
  const session = await decrypt(cookie);

  if (isAdminRoute && !(session?.role === "ADMIN")) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}
