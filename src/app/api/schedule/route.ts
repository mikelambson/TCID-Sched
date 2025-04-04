import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ScheduleRow } from '@/lib/types'; // Adjust path

type ScheduleWhereClause = {
  district?: {
    contains: string;
  };
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

export async function POST(request: Request) {
  const user = await getUserFromSession(request);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const data: ScheduleRow[] = await request.json();

    // Validate input
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty schedule data' }, { status: 400 });
    }

    // Filter out invalid rows and upsert valid ones
    const upsertPromises = data
      .filter((row) => {
        // Ensure required fields are present and valid
        if (row.orderNumber == null || row.startTime == null) {
          console.warn('Skipping invalid row:', row);
          return false;
        }
        return true;
      })
      .map(async (row) => {
        return prisma.schedule.upsert({
          where: {
            orderNumber: row.orderNumber, // Now using only orderNumber as the unique identifier
          },
          update: {
            startTime: row.startTime, // Allow startTime to be updated
            mainLateral: row.mainLateral,
            cfs: row.cfs,
            status: row.status,
            district: row.district,
            lineHead: row.lineHead,
            updatedAt: new Date(),
          },
          create: {
            startTime: row.startTime,
            mainLateral: row.mainLateral,
            cfs: row.cfs,
            orderNumber: row.orderNumber,
            status: row.status,
            district: row.district,
            lineHead: row.lineHead,
          },
        });
      });

    if (upsertPromises.length === 0) {
      return NextResponse.json({ error: 'No valid rows to process' }, { status: 400 });
    }

    // Execute all upserts in parallel
    const results = await Promise.all(upsertPromises);

    return NextResponse.json({
      message: 'Schedule processed successfully',
      count: results.length,
    });
  } catch (error) {
    console.error('Error processing schedule:', error);
    return NextResponse.json(
      { error: 'Failed to process schedule', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET route remains unchanged
export async function GET(request: Request) {
  try {
    // Extract district filter from query params
    const { searchParams } = new URL(request.url);
    const districtFilter = searchParams.get('district'); // e.g., "WEST" (uppercase from frontend)

    // Build Prisma query
    const whereClause: ScheduleWhereClause = {};
    if (districtFilter) {
      whereClause.district = {
        contains: districtFilter, // Case-sensitive match, expecting uppercase
      };
    }

    // Fetch schedules, sorted by startTime ascending
    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      orderBy: {
        startTime: 'asc',
      },
      select: {
        id: true,
        startTime: true,
        mainLateral: true,
        cfs: true,
        orderNumber: true,
        status: true,
        district: true,
        lineHead: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      schedules,
      count: schedules.length,
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}