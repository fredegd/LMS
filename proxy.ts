import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = new Set(["/", "/browse", "/sign-in", "/sign-up"]);

/** Browse uses GET /api/content; keep /api/content/[id] auth-only (Content API may include non-published). */
const isPublicContentApiRead = (pathname: string, method: string) => {
  if (method !== "GET") return false;
  return pathname === "/api/content" || pathname === "/api/content/";
};

const isPublicRoute = (pathname: string, req: NextRequest) => {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  if (pathname.startsWith("/item-display/")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (isPublicContentApiRead(pathname, req.method)) return true;
  return false;
};

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicRoute(pathname, req)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
