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
import useSelectedScheduleModal from './hooks/useSelectedScheduleModal';
import useCreateFormModal from './hooks/useCreateFormModal';

export default function MonthCalendar() {
  const { selectedDate, actions: mainCalendarActions } = useMainCalendarStore();
  const { calendar, actions: monthCalendarActions } = useMonthCalendarStore();
  const { actions: createFormActions } = useCreateFormStore();

  const dateContainerRef = useRef<HTMLDivElement>(null);

  const { data, isSuccess } = useMonthData({ selectedDate });
  const { CreateFormModal, openCreateFormModal } = useCreateFormModal({ selectedDate, dateContainerRef });
  const { SelectedScheduleModal, openSelectedScheduleModal } = useSelectedScheduleModal({ selectedDate });

  // selectedDate의 월 달력 내의 날짜 생성
  const selectedMonthDateArray = Array.from({ length: countDaysInMonthCalendar(selectedDate) }, (_, count) => {
    const targetDate = new Date(selectedDate);
    targetDate.setDate(1);
    const days = targetDate.getDay();
    targetDate.setDate(targetDate.getDate() - days + count);
    return { year: targetDate.getFullYear(), month: targetDate.getMonth() + 1, date: targetDate.getDate() };
  });

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

  // dragDate의 변화 및 mouseDown에 맞춰 drag한 날짜들 배경색상 변화
  useEffect(() => {
    if (!dateContainerRef.current) return;
    if (!calendar.mouseDown) return;
    if (!calendar.dragDate) return;

    const dragStartIndex = getTargetDateIndex(calendar.dragDate.start);
    const dragEndIndex = getTargetDateIndex(calendar.dragDate.end);

    const dragStartElement = Array.from(dateContainerRef.current.children)[dragStartIndex] as HTMLDivElement;
    const dragEndElement = Array.from(dateContainerRef.current.children)[dragEndIndex] as HTMLDivElement;

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

    let [smallIndex, largeIndex] = [dragStartIndex, dragEndIndex];
    if (smallIndex > largeIndex) {
      [smallIndex, largeIndex] = [largeIndex, smallIndex];
    }

    Array.from(dateContainerRef.current.children).forEach((target, index) => {
      if (smallIndex <= index && index <= largeIndex) target.classList.add('bg-blue-50');
      else target.classList.remove('bg-blue-50');
    });
  }, [calendar.dragDate, calendar.mouseDown]);

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
            className="border-l border-b grid grid-rows-auto-start gap-0 auto-rows-min"
            key={`${year}-${month}-${date}`}
            aria-label={`${year}-${month}-${date}-cell`}
            onMouseDown={() => {
              monthCalendarActions.setDragDate({
                start: new Date(year, month - 1, date),
                end: new Date(year, month - 1, date),
              });
              monthCalendarActions.setMouseDown(true);
            }}
            onMouseEnter={() => {
              if (calendar.mouseDown) monthCalendarActions.setDragDate({ end: new Date(year, month - 1, date) });
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
      {CreateFormModal}
      {SelectedScheduleModal}
    </>
  );
}
