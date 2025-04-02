// @/app/api/profile/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';

type UserUpdateData = {
  name?: string;
  email?: string;
  password?: string;
}

// Helper to extract session from cookies
const getUserFromSession = async (request: Request) => {
  const cookieHeader = request.headers.get('cookie');
  const sessionCookie = cookieHeader
    ?.split('; ')
    .find((row) => row.startsWith('session='))
    ?.split('=')[1];

  if (!sessionCookie) return null;

  const [userId] = Buffer.from(sessionCookie, 'base64').toString().split(':');
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
};

export async function GET(request: Request) {
  const user = await getUserFromSession(request);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
}

export async function PATCH(request: Request) {
    const user = await getUserFromSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
  
    try {
      const { name, email, password, currentPassword } = await request.json();
  
      const updateData: UserUpdateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
  
      // If user wants to update their password, require currentPassword and verify it
      if (password !== undefined) {
        if (!currentPassword) {
          return NextResponse.json(
            { error: "Current password is required to change password" },
            { status: 400 }
          );
        }
  
        const isMatch = await argon2.verify(user.password ?? "", currentPassword);
        if (!isMatch) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
          );
        }
  
        updateData.password = await argon2.hash(password);
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
  
      return NextResponse.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
  }
  
