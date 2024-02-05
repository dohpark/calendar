import { useEffect, useRef } from 'react';
import Split from '@/components/shared/layouts/Split';
import Expand from '@public/svg/expand_vertical.svg';
import IconButton from '@/components/shared/IconButton';
import ScheduleItem from '@/components/shared/ScheduleItem';
import { useDayCalendarStore } from '@/store/dayCalendar';

export default function DayCalendar() {
  const { calendar, actions: dayCalendarActions } = useDayCalendarStore();

  const timeContainerRef = useRef<HTMLDivElement>(null);

  // selectedDate의 월 달력 내의 날짜 생성
  const dateTimeArray = Array.from({ length: 24 * 4 }, (_, count) => {
    const hour = Math.floor((count * 15) / 60);
    const minute = (count * 15) % 60;

    return { hour, minute, count };
  });

  // dragDate의 변화 및 mouseDown에 맞춰 drag한 날짜들 배경색상 변화
  useEffect(() => {
    if (!timeContainerRef.current) return;
    if (!calendar.mouseDown) return;
    if (!calendar.dragDate) return;

    let [smallIndex, largeIndex] = [calendar.dragIndex.start, calendar.dragIndex.end];
    if (smallIndex > largeIndex) {
      [smallIndex, largeIndex] = [largeIndex, smallIndex];
    }

    Array.from(timeContainerRef.current.children).forEach((target, index) => {
      if (smallIndex <= index && index <= largeIndex) target.classList.add('bg-blue-50');
      else target.classList.remove('bg-blue-50');
    });
  }, [calendar.dragIndex, calendar.mouseDown]);

  return (
    <div className="overflow-hidden relative select-none">
      <div>
        <Split fraction="auto-start" gap="0" classExtend={['text-xs', 'text-gray-500', 'mt-1', 'mb-1']}>
          <div className="w-16 text-right">GMT+09</div>
          <div className="ml-auto mr-auto">
            <span className="mr-1">토</span>
            <span>2</span>
          </div>
        </Split>
        <Split fraction="auto-start" gap="0" classExtend={['border-gray-200', 'border-b', 'border-t']}>
          <div className="w-16 text-right border-r">
            <IconButton classExtend={['mr-2']}>
              <Expand width="12" height="12" />
            </IconButton>
          </div>
          <div className="mt-1 pl-1">
            <ScheduleItem type="event" title="test1" onClick={() => {}} classExtend={['pr-3', 'text-xs']} />
            <ScheduleItem type="event" title="test2" onClick={() => {}} classExtend={['pr-3', 'text-xs']} />
            <ScheduleItem type="event" title="test3" onClick={() => {}} classExtend={['pr-3', 'text-xs']} />
          </div>
        </Split>
      </div>
      <Split
        fraction="auto-start"
        gap="0"
        classExtend={['overflow-y-scroll', 'h-[calc(100vh-165px)]', 'scrollbar-hide']}
      >
        <div className="w-16 border-r">
          {Array.from({ length: 23 }, (_, i) => i).map((v) => (
            <div key={v} className="h-[48px] relative">
              <span className="absolute -bottom-2 text-xs right-2 text-gray-500">
                {v + 1 < 12 ? `${v + 1} am` : `${v + 1} pm`}
              </span>
            </div>
          ))}
        </div>
        <div ref={timeContainerRef}>
          {dateTimeArray.map(({ hour, minute }, index) => (
            <div
              key={`${hour}-${minute}`}
              role="gridcell"
              aria-label={`${hour}-${minute}-cell`}
              className={`h-3 text-xs ${minute === 45 ? 'border-b' : ''}`}
              tabIndex={0}
              onMouseDown={() => {
                dayCalendarActions.setDragIndex({
                  start: index,
                  end: index,
                });
                dayCalendarActions.setMouseDown(true);
              }}
              onMouseEnter={() => {
                if (calendar.mouseDown)
                  dayCalendarActions.setDragIndex({
                    end: index,
                  });
              }}
              onMouseUp={() => {
                if (calendar.mouseDown) dayCalendarActions.setMouseDown(false);
              }}
            />
          ))}
        </div>
      </Split>
    </div>
  );
}
