import { NextResponse } from 'next/server';
import url from 'node:url';
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

export async function DELETE(req: Request) {
  const { query } = url.parse(req.url, true);
  const { id } = query;
  if (!id || Array.isArray(id) || Number.isNaN(id))
    return NextResponse.json({ message: 'Error wrong query' }, { status: 400 });

  try {
    await prisma.schedule.update({
      where: {
        id: +id,
      },
      data: {
        deleted: true,
      },
    });
    return NextResponse.json({ message: 'schedule deleted' }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'Error deleting a schedule' }, { status: 500 });
  }
}
