import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ScheduleRow } from '@/lib/types'; // Adjust path

type ScheduleWhereClause = {
  district?: {
    contains: string;
  };
  status?: string;
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

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty schedule data' }, { status: 400 });
    }

    // Filter and prepare valid rows
    const validData = data.filter((row) => {
      if (row.orderNumber == null || row.startTime == null) {
        console.warn("Skipping invalid row:", row);
        return false;
      }
      return true;
    });

    const incomingOrderNumbers = validData.map((row) => row.orderNumber);

    // 1. Mark all schedules not in the incoming order numbers as DONE
    const markDonePromise = prisma.schedule.updateMany({
      where: {
        orderNumber: {
          notIn: incomingOrderNumbers,
        },
      },
      data: {
        status: "DONE",
        updatedAt: new Date(),
      },
    });

    // 2. Upsert all valid rows
    const upsertPromises = validData.map((row) =>
      prisma.schedule.upsert({
        where: {
          orderNumber: row.orderNumber,
        },
        update: {
          startTime: row.startTime,
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
      })
    );

    // Run the status="DONE" update first
    const markDoneResult = await markDonePromise;

    // Then upsert the incoming records
    const upsertResults = await Promise.all(upsertPromises);

    return NextResponse.json({
      message: "Schedule processed successfully",
      upserted: upsertResults.length,
      markedDone: markDoneResult.count,
    });
  } catch (error) {
    console.error("Error processing schedule:", error);
    return NextResponse.json(
      {
        error: "Failed to process schedule",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


// GET route remains unchanged
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtFilter = searchParams.get("district");
    const statusParam = searchParams.get("status")?.toUpperCase() || "OPEN";

    const whereClause: ScheduleWhereClause = {};

    // Primary: district filter
    if (districtFilter) {
      whereClause.district = {
        contains: districtFilter,
      };
    }

    // Secondary: status filter (unless explicitly set to "ALL")
    if (statusParam !== "ALL") {
      whereClause.status = statusParam;
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      orderBy: {
        startTime: "asc",
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
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch schedules",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
