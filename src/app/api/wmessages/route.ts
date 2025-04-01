// @/api/wmessages/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.wmessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (messages.length === 0) {
      return NextResponse.json({
        messages: [],
        message: 'No messages found.',
      });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('GET /api/wmessages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const newMsg = await prisma.wmessage.create({
      data: { message },
    });
    return NextResponse.json(newMsg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
