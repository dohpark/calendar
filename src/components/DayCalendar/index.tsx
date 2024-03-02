import { useRef, useEffect } from 'react';
import Split from '@/components/shared/layouts/Split';
import Expand from '@public/svg/expand_vertical.svg';
import IconButton from '@/components/shared/IconButton';
import ScheduleItem from '@/components/shared/ScheduleItem';
import { useDayCalendarStore } from '@/store/dayCalendar';
import { useCreateFormStore } from '@/store/createForm';
import { useMainCalendarStore } from '@/store/mainCalendar';
import { isSameDate } from '@/utils/calendar';

export default function DayCalendar({
  openCreateFormModal,
  createFormModalOpen,
  openSelectedScheduleModal,
}: {
  openCreateFormModal: () => void;
  createFormModalOpen: boolean;
  openSelectedScheduleModal: () => void;
}) {
  const { selectedDate } = useMainCalendarStore();
  const { calendar, actions: dayCalendarActions } = useDayCalendarStore();
  const { createForm, actions: createFormActions } = useCreateFormStore();

  console.log(openSelectedScheduleModal, createForm);

  const timeContainerRef = useRef<HTMLDivElement>(null);

  // selectedDate의 월 달력 내의 날짜 생성
  const dateTimeArray = Array.from({ length: 24 * 4 }, (_, count) => {
    const hour = Math.floor((count * 15) / 60);
    const minute = (count * 15) % 60;

    return { hour, minute, count };
  });

  // dragIndex의 변화에 맞춰 createFormModal의 위치값 변경
  useEffect(() => {
    if (!timeContainerRef.current) return;
    if (!calendar.mouseDown) return;
    if (!calendar.dragIndex) return;

    const dragStartElement = Array.from(timeContainerRef.current.children)[calendar.dragIndex.start] as HTMLDivElement;
    const dragEndElement = Array.from(timeContainerRef.current.children)[calendar.dragIndex.end] as HTMLDivElement;

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

  const filter = (date: { hour: number; minute: number; count: number }, target: Date) =>
    date.hour === target.getHours() && date.minute === target.getMinutes();
  const getTargetTimeIndex = (target: Date) => {
    const index = dateTimeArray.findIndex((date) => filter(date, target));
    if (index === -1 || !isSameDate(target, selectedDate)) return dateTimeArray.length - 1;
    return index;
  };

  // createForm의 시작일, 종료일에 맞춰 dragIndex 변경
  useEffect(() => {
    if (!calendar.mouseDown) return;
    dayCalendarActions.setDragIndex({
      start: getTargetTimeIndex(createForm.form.from),
      end: getTargetTimeIndex(createForm.form.until) - 1,
    });
  }, [createForm.form.from, createForm.form.until]);

  // createFormModal이 열릴시 시작일, 종료일 데이터 전달
  useEffect(() => {
    if (!createFormModalOpen) {
      dayCalendarActions.setMouseDown(false);
      return;
    }
    let [smallIndex, largeIndex] = [calendar.dragIndex.start, calendar.dragIndex.end];
    if (smallIndex > largeIndex) {
      [smallIndex, largeIndex] = [largeIndex, smallIndex];
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = selectedDate.getDate();

    const startHour = Math.floor((smallIndex * 15) / 60);
    const startMinute = (smallIndex * 15) % 60;

    const endHour = Math.floor(((largeIndex + 1) * 15) / 60);
    const endMinute = ((largeIndex + 1) * 15) % 60;

    createFormActions.setForm({
      type: 'event',
      title: '',
      description: '',
      allDay: false,
      from: new Date(year, month, date, startHour, startMinute),
      until: new Date(year, month, date, endHour, endMinute),
    });
  }, [createFormModalOpen]);

  // 날짜 드래그 css 주기
  const getTimeBoxBackgroundCss = (index: number) => {
    let [smallIndex, largeIndex] = [calendar.dragIndex.start, calendar.dragIndex.end];
    if (smallIndex > largeIndex) {
      [smallIndex, largeIndex] = [largeIndex, smallIndex];
    }

    return calendar.mouseDown && smallIndex <= index && index <= largeIndex ? 'bg-blue-50' : '';
  };

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
              className={`h-3 text-xs ${minute === 45 ? 'border-b' : ''} ${getTimeBoxBackgroundCss(index)}`}
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
                if (calendar.mouseDown) openCreateFormModal();
              }}
            />
          ))}
        </div>
      </Split>
    </div>
  );
}
