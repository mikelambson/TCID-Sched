// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0), // expire immediately
    path: '/',
  });

  const res = NextResponse.json({ message: 'Logged out' });
  res.headers.set('Set-Cookie', cookie);
  return res;
}
