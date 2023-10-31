'use client';

import { useEffect, useRef, useState } from 'react';
import { useMainCalendar } from '@/store/mainCalendar';
import DateButton from '@/components/common/DateButton';
import { countMonthDays } from '@/utils/calendar';
import useModal from '@/hooks/useModal';
import CreateForm from '@/components/modals/CreateForm';

interface SnapShot {
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const InitialSnapshot = {
  width: 0,
  height: 0,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

export default function MonthCalendar() {
  const { selectedDate, actions } = useMainCalendar();

  const dateContainerRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef<SnapShot>(InitialSnapshot);

  const [mouseDown, setMouseDown] = useState(false);
  const [dragStartDateIndex, setDragStartDateIndex] = useState(-1);
  const [dragEndDateIndex, setDragEndDateIndex] = useState(-1);

  const resetDrag = () => {
    if (!dateContainerRef.current) return;
    Array.from(dateContainerRef.current.children).forEach((target) => {
      target.classList.remove('bg-blue-50');
    });
  };

  const { openModal, ModalPortal } = useModal({ reset: resetDrag });

  useEffect(() => {
    if (!dateContainerRef.current) return;
    if (!mouseDown) return;

    const node = Array.from(dateContainerRef.current.children)[dragStartDateIndex] as HTMLDivElement;
    snapshotRef.current = {
      width: node.offsetWidth,
      height: node.offsetHeight,
      top: node.getBoundingClientRect().top,
      bottom: node.getBoundingClientRect().bottom,
      left: node.getBoundingClientRect().left,
      right: node.getBoundingClientRect().right,
    };

    node.classList.add('bg-blue-50');
  }, [dragStartDateIndex, mouseDown]);

  useEffect(() => {
    if (!dateContainerRef.current) return;
    if (!mouseDown) return;

    const node = Array.from(dateContainerRef.current.children)[dragEndDateIndex] as HTMLDivElement;
    snapshotRef.current = {
      width: node.offsetWidth,
      height: node.offsetHeight,
      top: node.getBoundingClientRect().top,
      bottom: node.getBoundingClientRect().bottom,
      left: node.getBoundingClientRect().left,
      right: node.getBoundingClientRect().right,
    };

    let [smallIndex, largeIndex] = [dragStartDateIndex, dragEndDateIndex];
    if (smallIndex > largeIndex) {
      [smallIndex, largeIndex] = [largeIndex, smallIndex];
    }

    Array.from(dateContainerRef.current.children).forEach((target, index) => {
      if (smallIndex <= index && index <= largeIndex) target.classList.add('bg-blue-50');
      else target.classList.remove('bg-blue-50');
    });
  }, [dragEndDateIndex]);

  const countWeeks = () => {
    const target = new Date(selectedDate);

    target.setDate(1);
    const lastMonthDaysofFirstWeekCount = target.getDay();

    const currentMonthDaysCount = countMonthDays(target);

    return Math.ceil((currentMonthDaysCount + lastMonthDaysofFirstWeekCount) / 7);
  };

  const countDays = () => countWeeks() * 7;

  const selectedMonthDateArray = Array.from({ length: countDays() }, (_, count) => {
    const targetDate = new Date(selectedDate);
    targetDate.setDate(1);
    const days = targetDate.getDay();
    targetDate.setDate(targetDate.getDate() - days + count);
    return [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate()];
  });

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

  const getGridRows = (row: number) => {
    if (row === 4) return 'grid-rows-4';
    if (row === 5) return 'grid-rows-5';
    if (row === 6) return 'grid-rows-6';
    if (row === 7) return 'grid-rows-7';
    return 'grid-rows-8';
  };

  const calculateModalXPosition = () => {
    if (dragEndDateIndex % 7 < 2) return { left: `${snapshotRef.current.left + snapshotRef.current.width + 16}px` };
    return { left: `${snapshotRef.current.left - 400 - 16}px` };
  };
  const calculateModalYPosition = () => {
    if (dragEndDateIndex % 7 < 2) return { top: `${snapshotRef.current.top + 16}px` };
    return { top: `${snapshotRef.current.top}px` };
  };

  return (
    <>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500">
        {['일', '월', '화', '수', '목', '금', '토'].map((value) => (
          <div key={value} className="border-l pt-2">
            {value}
          </div>
        ))}
      </div>
      <div
        ref={dateContainerRef}
        className={`grid grid-cols-7 ${getGridRows(countWeeks())} text-xs text-center overflow-hidden select-none`}
      >
        {selectedMonthDateArray.map(([year, month, date], index) => (
          <div
            role="gridcell"
            tabIndex={0}
            className="border-l border-b cursor-pointer grid grid-rows-auto-start gap-0 auto-rows-min"
            key={`${year}-${month}-${date}`}
            aria-label={`${year}-${month}-${date}-cell`}
            onMouseDown={() => {
              setDragStartDateIndex(index);
              setMouseDown(true);
            }}
            onMouseEnter={() => {
              if (mouseDown) setDragEndDateIndex(index);
            }}
            onMouseUp={() => {
              setMouseDown(false);
              openModal();
            }}
            onKeyDown={(e) => {
              if (e.code === 'Space') openModal();
            }}
          >
            <div className="pt-1">
              <DateButton
                year={year}
                month={month}
                date={date}
                classExtend={[date !== 1 ? 'w-6' : '!w-auto', getDateButtonCss(year, month, date)]}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  actions.setCalendarUnit('D');
                  actions.setSelectedDate(new Date(year, month - 1, date));
                }}
              >
                {date === 1 ? `${month}월 ${date}일` : date}
              </DateButton>
            </div>
            <div />
          </div>
        ))}
      </div>
      <ModalPortal>
        <CreateForm style={{ ...calculateModalXPosition(), ...calculateModalYPosition() }} />
      </ModalPortal>
    </>
  );
}
