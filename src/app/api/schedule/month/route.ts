/* eslint-disable testing-library/render-result-naming-convention */
import { NextResponse } from 'next/server';
import prisma from '@prisma-client/client';
import url from 'node:url';
import {
  countDaysInMonthCalendar,
  getDateExcludingTime,
  getDateRange,
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
        AND: {
          deleted: false,
        },
      },
    });

    targetSchedules.forEach((targetSchedule) => {
      selectedMonthArray.forEach(({ date, schedules }) => {
        const type = targetSchedule.type === 'event' || targetSchedule.type === 'todo' ? targetSchedule.type : 'event';
        const targetScheduleStartDate = getDateExcludingTime(targetSchedule.from);

        // edge case
        // until은 까지이므로 00시 0분인 경우 전날을 일컫는다.
        const targetScheduleEndDate =
          targetSchedule.until.getHours() === 0 && targetSchedule.until.getMinutes() === 0
            ? getDateExcludingTime(new Date(targetSchedule.until.getTime() - 1))
            : getDateExcludingTime(targetSchedule.until);

        // 현재 날짜가 스케줄 시작 날짜와 끝 날짜 사이에 존재
        // 디폴트 renderType은 'continue', render 값은 0이다.
        // 오직 start 혹은 startend 만이 render 1이상 7이하의 값을 가질 수 있다.
        if (targetScheduleStartDate <= date && date <= targetScheduleEndDate) {
          let renderType: RenderType = 'continue';
          let render = 0;

          // 스케줄의 시작과 끝 날짜가 현재 날짜와 같은 경우
          if (isSameDate(targetScheduleStartDate, date) && isSameDate(targetScheduleEndDate, date)) {
            renderType = 'startEnd';
            render = 1;

            // 스케줄 시작 날짜와 현재 날짜와 같은 경우 혹은 일요일인 경우 renderType은 'start'다.
          } else if (isSameDate(targetScheduleStartDate, date) || date.getDay() === 0) {
            renderType = 'start';
            render = Math.min(
              getDateRange(targetScheduleStartDate, targetScheduleEndDate) + 1, // 2일 ~ 3일의 경우
              getDateRange(date, targetScheduleEndDate) + 1, // 만약 date가 일요일이고 스케줄 마지막 요일이 월요일인 경우
              7 - date.getDay(), // 시작 날짜와 끝 날짜간의 차이가 일주일을 넘어가기에 현재날짜와 일주일의 끝의 차
              7, // 기본적으로 일주일 단위이기에 최대값은 7
            );

            // 스케줄 끝 날짜와 같은 경우 혹은 토요일인 경우
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

    // 스케줄의 상태와 이름에 따라 정렬
    selectedMonthArray.forEach(({ schedules }) =>
      schedules.sort((a, b) => {
        if (a.type !== b.type) {
          if (a.type === 'event') return -1;
          return 1;
        }
        return a.title.localeCompare(b.title);
      }),
    );

    // renderOrder 값을 구한다.
    selectedMonthArray.forEach(({ date, renderOrder, schedules }, index) => {
      if (date.getDay() === 0) {
        schedules.forEach(({ id }) => renderOrder.push(id));
      } else {
        const newOrder: number[] = [];
        const idArr = schedules.map((schedule) => schedule.id);
        const deque: number[] = [];
        const prevRenderOrder = selectedMonthArray[index - 1].renderOrder;

        // 전 날짜의 renderOrder을 돌며 현재 날짜 스케줄에도 포함하는 스케줄 id를 newOrder에 push 한다.
        // 만약 전 날 존재했지만 현재 날짜 스케줄 상 없으면 -1를 push한다.
        // deque에 newOrder 내에 -1값의 index를 저장한다.
        prevRenderOrder.forEach((id, prevRenderOrderIndex) => {
          if (idArr.includes(id)) newOrder.push(id);
          else {
            newOrder.push(-1);
            const nullIndex = prevRenderOrderIndex;
            deque.push(nullIndex);
          }
        });

        // 전 날에 없고 현재 날짜에 생긴 새로운 스케줄들을 newOrder에 저장한다.
        // newOrder에 값이 -1인 칸부터 채워 넣는다. (deque를 활용하여 확인 가능)
        // 만약에 newOrder에 남는 -1 칸이 없다면 push로 추가한다.
        idArr.forEach((id) => {
          if (!prevRenderOrder.includes(id)) {
            if (deque.length) {
              const nullIndex = deque.shift()!;
              newOrder[nullIndex] = id;
            } else {
              newOrder.push(id);
            }
          }
        });

        // newOrder 배열의 가장 오른쪽에 -1값을 지니면 무의미하기에 유의미한 id값을 마지막 index에 지닐 수 있도록 pop한다.
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
