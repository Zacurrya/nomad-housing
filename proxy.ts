import { NextResponse } from "next/server";


export default function proxy(request: Request) {
  // No-op proxy for now — allow requests through. If you want auth redirects,
  // inspect `request.cookies` here (Edge-safe) and redirect as needed.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
