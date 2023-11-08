import { NextResponse } from 'next/server';
import prisma from '@prisma-client/client';
import { CreateSchedule } from '@/types/schedule';

export async function POST(req: Request) {
  const schedule: CreateSchedule = await req.json();
  try {
    await prisma.schedule.create({
      data: {
        title: schedule.title,
        description: schedule.description,
        type: schedule.type,
        from: schedule.from,
        until: schedule.until,
        allDay: schedule.allDay,
        deleted: false,
      },
    });
    return NextResponse.json({ message: 'New schedule created' }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'Error creating a new schedule' }, { status: 500 });
  }
}
