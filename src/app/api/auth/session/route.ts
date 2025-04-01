// app/api/auth/session/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'No cookies found' }, { status: 401 });
    }

    // Safely extract the "session" cookie
    const sessionCookie = cookieHeader
      .split('; ')
      .find((cookie) => cookie.startsWith('session='));

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Session cookie not found' }, { status: 401 });
    }

    const sessionToken = sessionCookie.split('=')[1];
    if (!sessionToken) {
      return NextResponse.json({ error: 'Malformed session token' }, { status: 401 });
    }

    const decoded = Buffer.from(sessionToken, 'base64').toString();
    if (!decoded.includes(':')) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    const [userId] = decoded.split(':');

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin, // 🔐 include this for admin-only pages
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session route error:", error);
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
}
