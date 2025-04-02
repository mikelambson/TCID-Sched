// app/api/users/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { requireAdmin } from '@/lib/auth';

interface CreateUserRequestBody {
  name?: string;
  email: string;
  password: string;
  isAdmin?: boolean; // Allow admin to set this
}

export async function POST(request: Request) {
  const adminUser = await requireAdmin(request);
  if (adminUser instanceof NextResponse) return adminUser; // Return error if not admin

  try {
    const { name, email, password, isAdmin = false } = (await request.json()) as CreateUserRequestBody;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await argon2.hash(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const adminUser = await requireAdmin(request);
  if (adminUser instanceof NextResponse) return adminUser;

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, isAdmin: true }, // Exclude password
    });
    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}