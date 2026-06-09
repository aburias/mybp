import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { systolic, diastolic, pulse } = body;

    if (!systolic || !diastolic) {
      return NextResponse.json({ error: 'Systolic and Diastolic values are required.' }, { status: 400 });
    }

    const reading = await prisma.reading.create({
      data: {
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        pulse: pulse ? parseInt(pulse) : null,
      },
    });

    return NextResponse.json(reading, { status: 201 });
  } catch (error) {
    console.error('Error saving reading:', error);
    return NextResponse.json({ error: 'Failed to save reading.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let dateFilter = {};
    if (from && to) {
      dateFilter = {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      };
    }

    const readings = await prisma.reading.findMany({
      where: dateFilter,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(readings);
  } catch (error) {
    console.error('Error fetching readings:', error);
    return NextResponse.json({ error: 'Failed to fetch readings.' }, { status: 500 });
  }
}
