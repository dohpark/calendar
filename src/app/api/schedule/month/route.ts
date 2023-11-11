import { NextResponse } from 'next/server';
import prisma from '@prisma-client/client';
import url from 'node:url';
import {
  countDaysInMonthCalendar,
  getDateExcludingTime,
  getFirstDayInFirstWeekOfMonth,
  getLastDayInLastWeekOfMonth,
} from '@/utils/calendar';
import { Schedule } from '@/types/schedule';

type ScheduleArray = { date: Date; schedules: Schedule[] }[];

export async function GET(req: Request) {
  const { query } = url.parse(req.url, true);
  const { year, month } = query;
  if (!year || !month || Array.isArray(year) || Array.isArray(month) || Number.isNaN(year) || Number.isNaN(month))
    return NextResponse.json({ message: 'Error wrong query' }, { status: 400 });

  const selectedDate = new Date(+year, +month - 1, 1);

  const firstDay = getFirstDayInFirstWeekOfMonth(selectedDate);
  const lastDay = getLastDayInLastWeekOfMonth(selectedDate);
  const selectedMonthArray: ScheduleArray = Array.from(
    { length: countDaysInMonthCalendar(selectedDate) },
    (_value, count) => {
      const target = new Date(selectedDate);

      target.setDate(target.getDate() + count - target.getDay());

      return { date: new Date(target), schedules: [] };
    },
  );

  try {
    const targetSchedules = await prisma.schedule.findMany({
      where: {
        OR: [
          {
            from: {
              gte: firstDay,
              lte: lastDay,
            },
          },
          {
            until: {
              gte: firstDay,
              lte: lastDay,
            },
          },
        ],
      },
    });

    targetSchedules.forEach((targetSchedule) => {
      selectedMonthArray.forEach(({ date, schedules }) => {
        if (getDateExcludingTime(targetSchedule.from) <= date && date <= getDateExcludingTime(targetSchedule.until)) {
          const type =
            targetSchedule.type === 'event' || targetSchedule.type === 'todo' ? targetSchedule.type : 'event';

          schedules.push({
            ...targetSchedule,
            type,
          });
        }
      });
    });

    return NextResponse.json({ selectedMonthArray }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'Error creating a new schedule' }, { status: 500 });
  }
}
