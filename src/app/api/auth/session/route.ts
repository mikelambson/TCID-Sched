// app/api/auth/session/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Extract the "session" cookie
    const sessionCookie = cookieHeader
      .split('; ')
      .find((cookie) => cookie.startsWith('session='));

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const sessionToken = sessionCookie.split('=')[1];
    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Decode and validate token
    let decoded: string;
    try {
      decoded = Buffer.from(sessionToken, 'base64').toString();
      if (!decoded.includes(':')) {
        return NextResponse.json({ user: null }, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const [userId, timestamp] = decoded.split(':');
    if (!userId || !timestamp) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Optional: Add timestamp validation (e.g., 24-hour expiration)
    const tokenAge = (Date.now() - parseInt(timestamp)) / 1000; // in seconds
    if (tokenAge > 60 * 60 * 24) { // 24 hours
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

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
    return NextResponse.json(
      { user: null, error: 'Failed to check session' },
      { status: 500 }
    );
  }
}