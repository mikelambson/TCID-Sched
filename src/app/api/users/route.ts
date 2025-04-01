// app/api/users/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Define the expected request body type for POST
interface UserRequestBody {
  name: string;
  email: string;
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = (await request.json()) as UserRequestBody;
    const user = await prisma.user.create({
      data: { name, email },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }
}