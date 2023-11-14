/* eslint-disable testing-library/render-result-naming-convention */
import { NextResponse } from 'next/server';
import prisma from '@prisma-client/client';
import url from 'node:url';
import {
  countDaysInMonthCalendar,
  getDateExcludingTime,
  getFirstDayInFirstWeekOfMonth,
  getLastDayInLastWeekOfMonth,
  isSameDate,
} from '@/utils/calendar';
import { ScheduleArray, RenderType } from '@/types/schedule';

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

      return { date: new Date(target), schedules: [], renderOrder: [] };
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
        const type = targetSchedule.type === 'event' || targetSchedule.type === 'todo' ? targetSchedule.type : 'event';
        const targetScheduleStartDate = getDateExcludingTime(targetSchedule.from);
        const targetScheduleEndDate = getDateExcludingTime(targetSchedule.until);

        if (targetScheduleStartDate <= date && date <= targetScheduleEndDate) {
          let renderType: RenderType = 'continue';
          let render = 0;

          if (isSameDate(targetScheduleStartDate, date) && isSameDate(targetScheduleEndDate, date)) {
            renderType = 'startEnd';
            render = 1;
          } else if (isSameDate(targetScheduleStartDate, date) || date.getDay() === 0) {
            renderType = 'start';
            render = Math.min(
              targetScheduleEndDate.getDate() - targetScheduleStartDate.getDate() + 1,
              targetScheduleEndDate.getDate() - date.getDate() + 1,
              7 - date.getDay(),
              7,
            );
          } else if (isSameDate(targetScheduleEndDate, date) || date.getDay() === 6) {
            renderType = 'end';
            render = 0;
          }

          schedules.push({
            ...targetSchedule,
            type,
            renderType,
            render,
          });
        }
      });
    });

    selectedMonthArray.forEach(({ schedules }) =>
      schedules.sort((a, b) => {
        if (a.type !== b.type) {
          if (a.type === 'event') return -1;
          return 1;
        }
        return a.title.localeCompare(b.title);
      }),
    );

    selectedMonthArray.forEach(({ date, renderOrder, schedules }, index) => {
      if (date.getDay() === 0) {
        schedules.forEach(({ id }) => renderOrder.push(id));
      } else {
        const newOrder: number[] = [];
        const idArr = schedules.map((schedule) => schedule.id);
        const deque: number[] = [];
        const prevRenderOrder = selectedMonthArray[index - 1].renderOrder;
        prevRenderOrder.forEach((id, index2) => {
          if (idArr.includes(id)) newOrder.push(id);
          else {
            newOrder.push(-1);
            deque.push(index2);
          }
        });

        idArr.forEach((id) => {
          if (!prevRenderOrder.includes(id)) {
            if (deque.length) {
              const index3 = deque.shift()!;
              newOrder[index3] = id;
            } else {
              newOrder.push(id);
            }
          }
        });

        while (newOrder.length) {
          const id = newOrder.pop()!;
          if (id !== -1) {
            newOrder.push(id);
            break;
          }
        }

        renderOrder.push(...newOrder);
      }
    });

    return NextResponse.json({ selectedMonthArray }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'Error creating a new schedule' }, { status: 500 });
  }
}
