import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Verify JWT token
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
      },
    });
  } catch (error) {
    console.error("Session verification failed:", error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
