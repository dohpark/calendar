'use client';

import { useEffect, useRef } from 'react';
import { useMainCalendarStore } from '@/store/mainCalendar';
import DateButton from '@/components/shared/DateButton';
import { countDaysInMonthCalendar } from '@/utils/calendar';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';
import { useMonthCalendarStore } from '@/store/monthCalendar';
import { useCreateFormStore } from '@/store/createForm';
import ScheduleItems from './ScheduleItems';
import useMonthData from './hooks/useMonthData';

export default function MonthCalendar({
  openCreateFormModal,
  createFormModalOpen,
  openSelectedScheduleModal,
}: {
  openCreateFormModal: () => void;
  createFormModalOpen: boolean;
  openSelectedScheduleModal: () => void;
}) {
  const { selectedDate, actions: mainCalendarActions } = useMainCalendarStore();
  const { calendar, actions: monthCalendarActions } = useMonthCalendarStore();
  const { createForm, actions: createFormActions } = useCreateFormStore();

  const dateContainerRef = useRef<HTMLDivElement>(null);

  const { data, isSuccess } = useMonthData({ selectedDate });

  // selectedDate의 월 달력 내의 날짜 생성
  const selectedMonthDateArray = Array.from({ length: countDaysInMonthCalendar(selectedDate) }, (_, count) => {
    const targetDate = new Date(selectedDate);
    targetDate.setDate(1);
    const days = targetDate.getDay();
    targetDate.setDate(targetDate.getDate() - days + count);
    return { year: targetDate.getFullYear(), month: targetDate.getMonth() + 1, date: targetDate.getDate() };
  });

  // ResizeObserver를 활용하여 window 크기 변동시 자동으로 dateBoxSize 크기를 저장
  useEffect(() => {
    if (!dateContainerRef.current) return;

    const element = Array.from(dateContainerRef.current.children)[0] as HTMLDivElement;

    const observer = new ResizeObserver(() => {
      monthCalendarActions.setDateBoxSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    });

    observer.observe(element);
    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  // 찾고 있는 날짜가 selectedMonthDateArray의 몇번째 index인지 확인 만약에 없으면 가장 마지막 index 반환
  const filterDate = (date: { year: number; month: number; date: number }, targetDate: Date) =>
    date.year === targetDate.getFullYear() &&
    date.month === targetDate.getMonth() + 1 &&
    date.date === targetDate.getDate();
  const getTargetDateIndex = (targetType: Date) => {
    const index = selectedMonthDateArray.findIndex((date) => filterDate(date, targetType));
    if (index === -1) return selectedMonthDateArray.length - 1;
    return index;
  };

  // createForm의 시작일, 종료일에 맞춰 dragIndex 변경
  useEffect(() => {
    if (!calendar.mouseDown) return;
    monthCalendarActions.setDragIndex({
      start: getTargetDateIndex(createForm.form.from),
      end: getTargetDateIndex(createForm.form.until),
    });
  }, [createForm.form.from, createForm.form.until]);

  // dragIndex의 변화에 맞춰 createFormModal의 위치값 변경
  useEffect(() => {
    if (!dateContainerRef.current) return;
    if (!calendar.mouseDown) return;
    if (!calendar.dragIndex) return;

    const dragStartElement = Array.from(dateContainerRef.current.children)[calendar.dragIndex.start] as HTMLDivElement;
    const dragEndElement = Array.from(dateContainerRef.current.children)[calendar.dragIndex.end] as HTMLDivElement;

    createFormActions.setPosition({
      top:
        (dragStartElement.getBoundingClientRect().top +
          dragEndElement.getBoundingClientRect().top +
          dragStartElement.offsetHeight) /
        2,
      left:
        (dragStartElement.getBoundingClientRect().left +
          dragEndElement.getBoundingClientRect().left +
          dragStartElement.offsetWidth) /
        2,
    });
  }, [calendar.dragIndex, calendar.mouseDown]);

  // createFormModal이 열릴시 시작일, 종료일 데이터 전달
  useEffect(() => {
    if (!createFormModalOpen) {
      monthCalendarActions.setMouseDown(false);
      return;
    }

    let [smallIndex, largeIndex] = [calendar.dragIndex.start, calendar.dragIndex.end];
    if (smallIndex > largeIndex) {
      [smallIndex, largeIndex] = [largeIndex, smallIndex];
    }

    createFormActions.setForm({
      type: 'event',
      title: '',
      description: '',
      allDay: true,
      from: new Date(
        selectedMonthDateArray[smallIndex].year,
        selectedMonthDateArray[smallIndex].month - 1,
        selectedMonthDateArray[smallIndex].date,
      ),
      until: new Date(
        selectedMonthDateArray[largeIndex].year,
        selectedMonthDateArray[largeIndex].month - 1,
        selectedMonthDateArray[largeIndex].date,
      ),
    });
  }, [createFormModalOpen]);

  // 날짜 버튼 css 다이나믹하게 주기
  const getDateButtonCss = (year: number, month: number, date: number) => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    if (todayYear === year && todayMonth === month && todayDate === date)
      return 'bg-blue-500 text-white hover:!bg-blue-600';
    if (month !== selectedDate.getMonth() + 1) return 'text-gray-400';

    return 'text-gray-800';
  };

  // 날짜 드래그 css 주기
  const getDateBoxBackgroundCss = (index: number) => {
    let [smallIndex, largeIndex] = [calendar.dragIndex.start, calendar.dragIndex.end];
    if (smallIndex > largeIndex) {
      [smallIndex, largeIndex] = [largeIndex, smallIndex];
    }

    return calendar.mouseDown && smallIndex <= index && index <= largeIndex ? 'bg-blue-50' : '';
  };

  return (
    <>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500 select-none">
        {DAYS_OF_THE_WEEK.map((value) => (
          <div key={value} className="border-l pt-2">
            {value}
          </div>
        ))}
      </div>
      <div
        ref={dateContainerRef}
        className="grid auto-rows-fr grid-cols-7 text-xs text-center overflow-hidden select-none"
      >
        {selectedMonthDateArray.map(({ year, month, date }, index) => (
          <div
            role="gridcell"
            tabIndex={0}
            className={`border-l border-b grid grid-rows-auto-start gap-0 auto-rows-min ${getDateBoxBackgroundCss(
              index,
            )}`}
            key={`${year}-${month}-${date}`}
            aria-label={`${year}-${month}-${date}-cell`}
            onMouseDown={() => {
              monthCalendarActions.setDragIndex({
                start: index,
                end: index,
              });
              monthCalendarActions.setMouseDown(true);
            }}
            onMouseEnter={() => {
              if (calendar.mouseDown) monthCalendarActions.setDragIndex({ end: index });
            }}
            onMouseUp={() => {
              if (calendar.mouseDown) openCreateFormModal();
            }}
            onKeyDown={(e) => {
              if (e.code === 'Space') openCreateFormModal();
            }}
          >
            <div className="pt-1">
              <DateButton
                year={year}
                month={month}
                date={date}
                classExtend={[date !== 1 ? 'w-6' : '!w-auto', getDateButtonCss(year, month, date)]}
                onClick={(e) => {
                  e.stopPropagation();
                  mainCalendarActions.setCalendarUnit('D');
                  mainCalendarActions.setSelectedDate(new Date(year, month - 1, date));
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {date === 1 ? `${month}월 ${date}일` : date}
              </DateButton>
            </div>
            {isSuccess ? <ScheduleItems data={data[index]} openModal={openSelectedScheduleModal} /> : <div />}
          </div>
        ))}
      </div>
    </>
  );
}
