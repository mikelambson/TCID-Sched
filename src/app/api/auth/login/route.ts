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

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password || !(await argon2.verify(user.password, password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    // console.log("Login - Generated session token:", sessionToken);

    const cookie = serialize('session', sessionToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    console.log("Login - Cookie set:", cookie);

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      },
      { status: 200 }
    );
    response.headers.set('Set-Cookie', cookie);
    response.headers.set('X-Test-Header', 'test-value'); // Test header to confirm delivery
    

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}