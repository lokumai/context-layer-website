import { NextResponse } from "next/server";
import { auth } from "./auth";

// Public routes (and their prefixes). Everything else requires an authenticated
// session; unauthenticated requests redirect to /login with a callbackUrl.
const PUBLIC_PATHS = new Set<string>(["/", "/login"]);
const PUBLIC_PREFIXES = ["/product/", "/api/auth/", "/_next/", "/assets/", "/favicon"];
const PUBLIC_FILES = new Set<string>(["/logo-landscape.svg"]);

export const proxy = auth((req) => {
  const { pathname, search } = req.nextUrl;

  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_FILES.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  // Bounce authenticated users away from /login into the playground.
  // Honor the callbackUrl param if it points inside the playground; otherwise /workspaces.
  if (pathname === "/login" && req.auth) {
    const dest = req.nextUrl.clone();
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    dest.pathname = callbackUrl?.startsWith("/") ? callbackUrl : "/workspaces";
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  if (isPublic) return NextResponse.next();

  if (!req.auth) {
    const login = req.nextUrl.clone();
    login.pathname = "/login";
    login.search = `?callbackUrl=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
