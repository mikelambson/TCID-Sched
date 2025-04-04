// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  try {
    const cookie = serialize('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Match login route
      maxAge: 0, // Expire immediately
      path: '/',
    });

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
    response.headers.set('Set-Cookie', cookie);
    console.log("Logout - Cookie cleared:", cookie);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: 'Error during logout' },
      { status: 500 }
    );
  }
}