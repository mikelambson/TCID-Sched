// @/app/api/users/[id]/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { requireAdmin } from '@/lib/auth';

type UserUpdateData = {
  name?: string;
  email?: string;
  isAdmin?: boolean;
  password?: string;
};

export async function DELETE(request: Request) {
  const adminUser = await requireAdmin(request);
  if (adminUser instanceof NextResponse) return adminUser;

  const url = new URL(request.url);
  const userId = url.pathname.split('/').pop(); // gets the `[id]` param

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  // Prevent deleting yourself
  if (adminUser.id === userId) {
    return NextResponse.json(
      { error: 'You cannot delete your own account.' },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete user:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const adminUser = await requireAdmin(request);
  if (adminUser instanceof NextResponse) return adminUser;

  const url = new URL(request.url);
  const userId = url.pathname.split('/').pop();

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const { name, email, password, isAdmin } = await request.json();

    const updateData: UserUpdateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (password && password.trim().length > 0) {
      updateData.password = await argon2.hash(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'User updated successfully.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (err) {
    console.error('Failed to update user:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
