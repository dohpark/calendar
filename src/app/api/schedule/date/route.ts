import { NextResponse } from 'next/server';
import prisma from '@prisma-client/client';
import url from 'node:url';
import { DateScheduleArray, Schedule } from '@/types/schedule';
import { isEventCollide } from '@/utils/calendar';

export async function GET(req: Request) {
  const { query } = url.parse(req.url, true);
  const { year, month, date } = query;
  if (
    !year ||
    !month ||
    !date ||
    Array.isArray(year) ||
    Array.isArray(month) ||
    Array.isArray(date) ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(date)
  )
    return NextResponse.json({ message: 'Error wrong query' }, { status: 400 });

  const today = new Date(+year, +month - 1, +date);
  const nextDay = new Date(+year, +month - 1, +date + 1);

  try {
    const targetSchedules = await prisma.schedule.findMany({
      where: {
        OR: [
          {
            from: {
              gte: today,
              lt: nextDay,
            },
          },
          {
            until: {
              gte: today,
              lte: nextDay,
            },
          },
        ],
        AND: {
          deleted: false,
        },
      },
    });

    const allDayScheduleArray: Schedule[] = [];
    const notAllDayScheduleArray: Schedule[] = [];

    targetSchedules.forEach((schedule) => {
      const type = schedule.type === 'event' || schedule.type === 'todo' ? schedule.type : 'event';

      if (schedule.allDay) allDayScheduleArray.push({ ...schedule, type });
      else if (schedule.from < today) allDayScheduleArray.push({ ...schedule, type });
      else if (schedule.until > nextDay) allDayScheduleArray.push({ ...schedule, type });
      else notAllDayScheduleArray.push({ ...schedule, type });
    });

    allDayScheduleArray.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    });

    notAllDayScheduleArray.sort((a, b) => {
      if (a.from < b.from) return -1;
      if (a.from > b.from) return 1;
      if (a.until < b.until) return 1;
      if (a.until > b.until) return -1;
      return 0;
    });

    // 1. 그룹 분리하기
    const groups: Schedule[][] = [];
    let lastEventEnding: Date | null = null;

    notAllDayScheduleArray.forEach((schedule) => {
      if (lastEventEnding === null) {
        groups.push([schedule]);
        lastEventEnding = schedule.until;
      } else if (schedule.until <= lastEventEnding) {
        groups[groups.length - 1].push(schedule);
      } else if (schedule.from <= lastEventEnding && schedule.until > lastEventEnding) {
        groups[groups.length - 1].push(schedule);
        lastEventEnding = schedule.until;
      } else {
        groups.push([schedule]);
        lastEventEnding = schedule.until;
      }
    });

    // 2. 그룹별 컬럼 나누기
    const todayScheduleGroupsWithColumns: Schedule[][][] = [];

    groups.forEach((group) => {
      const columns: Schedule[][] = [];

      group.forEach((schedule) => {
        let placed = false;

        for (let i = 0; i < columns.length; i += 1) {
          const column = columns[i];
          if (!isEventCollide(column[column.length - 1], schedule)) {
            column.push(schedule);
            placed = true;
            break;
          }
        }

        if (!placed) {
          columns.push([schedule]);
        }
      });

      todayScheduleGroupsWithColumns.push(columns);
    });

    // 3. 확장 가능 여부 계산 및 시간별 이벤트로 나뉘기
    const selectedDateArray: DateScheduleArray[] = Array.from({ length: 24 * 4 }, () => ({
      schedules: [],
    }));

    todayScheduleGroupsWithColumns.forEach((group) => {
      const column = group.length;
      group.forEach((columns, row) => {
        columns.forEach((schedule) => {
          const index = Math.floor((schedule.from.getHours() * 60 + schedule.from.getMinutes()) / 15);

          // 확장 가능 여부 계산
          let expand = 1;

          for (let i = row + 1; i < group.length; i += 1) {
            const differentColumn = group[i];
            let collided = false;

            for (let j = 0; j < differentColumn.length; j += 1) {
              const differentColumnSchedule = differentColumn[j];

              if (isEventCollide(schedule, differentColumnSchedule)) {
                collided = true;
                break;
              }
            }

            if (collided) break;
            else expand += 1;
          }

          selectedDateArray[index].schedules.push({ ...schedule, row, expand, column });
        });
      });
    });

    return NextResponse.json(
      { selectedDateArray, todayScheduleGroupsWithColumns, allDayScheduleArray },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ message: 'Error creating a new schedule' }, { status: 500 });
  }
}
