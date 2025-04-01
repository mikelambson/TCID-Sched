// lib/auth.ts
import prisma from './prisma';
import { NextResponse } from 'next/server';

export async function getSessionUser(request: Request) {
  const sessionToken = request.headers
    .get('cookie')
    ?.split('; ')
    .find((row) => row.startsWith('session='))
    ?.split('=')[1];

  if (!sessionToken) {
    return null;
  }

  const [userId] = Buffer.from(sessionToken, 'base64').toString().split(':');
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function requireAdmin(request: Request) {
  const user = await getSessionUser(request);
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }
  return user;
}