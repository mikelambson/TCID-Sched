// app/api/auth/login/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { serialize } from 'cookie';

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginRequestBody;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password || !(await argon2.verify(user.password, password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a session token (simple base64 for now)
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // Set session cookie
    const cookie = serialize('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    );
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}