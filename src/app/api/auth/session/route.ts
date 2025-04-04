// app/api/auth/session/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    // console.log("Session route - Cookie header:", cookieHeader);

    if (!cookieHeader) {
      // console.log("No cookies found in session check");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const sessionCookie = cookieHeader.split('; ').find((cookie) => cookie.startsWith('session='));
    if (!sessionCookie) {
      // console.log("Session cookie not found");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const sessionToken = sessionCookie.split('=')[1];
    // console.log("Session route - Extracted token:", sessionToken);

    if (!sessionToken) {
      // console.log("Malformed session token");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let decoded;
    try {
      decoded = Buffer.from(sessionToken, 'base64').toString();
      // console.log("Session route - Decoded token:", decoded);
    } catch {
      // console.log("Failed to decode token:", error);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!decoded.includes(':')) {
      // console.log("Invalid token format - no colon found");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const [userId, timestamp] = decoded.split(':');
    // console.log("Session route - User ID:", userId, "Timestamp:", timestamp);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // console.log("User not found for ID:", userId);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const tokenAge = (Date.now() - parseInt(timestamp)) / 1000;
    if (tokenAge > 60 * 60 * 24) {
      // console.log("Token expired, age (seconds):", tokenAge);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // console.log("Session validated, returning user:", user);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Session route error:", error);
    return NextResponse.json({ user: null, error: 'Failed to check session' }, { status: 500 });
  }
}