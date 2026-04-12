import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const secret = process.env.AUTH_SECRET

  // Admin routes — check the dedicated admin cookie
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/giris") && !pathname.startsWith("/admin/auth")) {
    const token = await getToken({
      req,
      secret,
      cookieName: "market-admin-session",
    })
    if (!token || token.type !== "admin") {
      return NextResponse.redirect(new URL("/admin/giris", req.url))
    }
    return NextResponse.next()
  }

  // Protected user routes
  const protectedPaths = ["/hesabim", "/sepet", "/siparislerim", "/favorilerim"]
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected) {
    const token = await getToken({ req, secret })
    if (!token) {
      return NextResponse.redirect(new URL("/giris", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/hesabim/:path*",
    "/sepet/:path*",
    "/siparislerim/:path*",
    "/favorilerim/:path*",
  ],
}
