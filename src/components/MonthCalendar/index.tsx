'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMainCalendar } from '@/store/mainCalendar';
import DateButton from '@/components/shared/DateButton';
import { countDaysInMonthCalendar, countWeeksInMonthCalendar } from '@/utils/calendar';
import useModal from '@/hooks/useModal';
import CreateForm from '@/components/modals/CreateForm';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';
import { useQuery } from '@tanstack/react-query';
import scheduleApi from '@/api/schedule';
import { ScheduleArray } from '@/types/schedule';
import SelectedSchedule from '@/components/modals/SelectedSchedule';
import { InitialScheduleInfo } from '@/constants/schedule';
import ScheduleItems from './ScheduleItems';

interface DragState {
  start: Date;
  end: Date;
}

export default function MonthCalendar() {
  const { selectedDate, actions } = useMainCalendar();

  const dateContainerRef = useRef<HTMLDivElement>(null);
  const createFormModalRef = useRef<HTMLFormElement>(null);
  const selectedScheduleModalRef = useRef<HTMLDivElement>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const [dragDate, setDragDate] = useState<DragState>({
    start: new Date(),
    end: new Date(),
  });
  const [dateBoxSize, setDateBoxSize] = useState({
    width: 0,
    height: 0,
  });
  const [createFormModalPosition, setCreateFormModalPosition] = useState({
    top: 0,
    left: 0,
  });
  const [createFormModalStyle, setCreateFormModalStyle] = useState({ left: 0, top: 0, opacity: 0 });
  const [createdFormModalMounted, setCreatedFormModalMounted] = useState(false);

  const [selectedScheduleInfo, setSelectedScheduleInfo] = useState(InitialScheduleInfo);
  const [selectedScheduleModalPosition, setSelectedScheduleModalPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [selectedScheduleModalStyle, setSelectedScheduleModalStyle] = useState({ left: 0, top: 0, opacity: 0 });

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

  const fetchSchedule = (): Promise<ScheduleArray> =>
    scheduleApi.getMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
  const { data, isSuccess } = useQuery({
    queryKey: [`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`],
    queryFn: fetchSchedule,
    refetchOnWindowFocus: false,
  });

  // dateBoxSize의 높이에 맞춰 hiddenRender 계산
  const mutateData = () => {
    if (!data) return;
    const set = new Set<number>();
    const limit = Math.floor((dateBoxSize.height - 28) / 24);

    data.forEach(({ schedules, renderOrder }, index) => {
      if (renderOrder.length >= limit) {
        const hidden = renderOrder.slice(limit - 1);
        hidden.forEach((item) => {
          if (item !== -1) set.add(item);
        });
        const setArray = Array.from(set);

        // 1. hiddenRender에 추가
        data[index].hiddenRender = [...setArray];

        // 2. set의 element가 현재 renderType가 startend 혹은 end면 삭제
        setArray.forEach((item) => {
          const renderType = schedules.find((schedule) => schedule.id === item)?.renderType;
          if (renderType === 'end' || renderType === 'startEnd') set.delete(item);
        });
      }
    });
  };
  mutateData();

  // ResizeObserver를 활용하여 window 크기 변동시 자동으로 dateBoxSize 크기를 저장
  useEffect(() => {
    if (!dateContainerRef.current) return;

    const element = Array.from(dateContainerRef.current.children)[0] as HTMLDivElement;

    const observer = new ResizeObserver(() => {
      setDateBoxSize({
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

  // dragDate의 변화 및 mouseDown에 맞춰 snapshotRef 값 변경 및 drag한 날짜들 배경색상 변화
  useEffect(() => {
    if (!dateContainerRef.current) return;
    if (!mouseDown) return;
    if (!dragDate) return;

    const dragStartIndex = getTargetDateIndex(dragDate.start);
    const dragEndIndex = getTargetDateIndex(dragDate.end);

    const dragStartElement = Array.from(dateContainerRef.current.children)[dragStartIndex] as HTMLDivElement;
    const dragEndElement = Array.from(dateContainerRef.current.children)[dragEndIndex] as HTMLDivElement;

    setCreateFormModalPosition({
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
  }, [dragDate, mouseDown]);

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

  // 모달 닫을 시 reset
  const resetDrag = () => {
    if (!dateContainerRef.current) return;
    Array.from(dateContainerRef.current.children).forEach((target) => {
      target.classList.remove('bg-blue-50');
    });
    setMouseDown(false);
    setCreatedFormModalMounted(false);
    setCreateFormModalStyle((state) => ({ ...state, opacity: 0 }));
  };

  const { openModal, ModalPortal, modalOpen, closeModal } = useModal({ reset: resetDrag });
  const {
    ModalPortal: SelectedSchedulePortal,
    openModal: openSelectedScheduleModal,
    closeModal: closeSelectedScheduleModal,
    modalOpen: selectedScheduleModalOpen,
  } = useModal({ reset: () => setSelectedScheduleModalStyle((state) => ({ ...state, opacity: 0 })) });

  // 스케줄 생성 모달 생성 위치 계산
  useEffect(() => {
    if (!modalOpen) return;
    if (createdFormModalMounted) return;
    if (!dateContainerRef.current) return;
    if (!createFormModalRef.current) return;

    const modalWidth = createFormModalRef.current.offsetWidth;
    const modalHeight = createFormModalRef.current.offsetHeight;
    const screenWidth = dateBoxSize.width * 7 + 256;
    const screenHeight = dateBoxSize.height * countWeeksInMonthCalendar(selectedDate) + 88;

    let left = createFormModalPosition.left - modalWidth / 2;
    if (left < 256) left = 256 + 24;
    else if (left + modalWidth > screenWidth) left = screenWidth - modalWidth - 24;

    let { top } = createFormModalPosition;
    if (top + modalHeight > screenHeight) top -= modalHeight;

    setCreateFormModalStyle({ left, top, opacity: 100 });

    setCreatedFormModalMounted(true);
  }, [modalOpen]);

  // 선택한 스케줄 모달 생성 위치 계산
  useEffect(() => {
    if (!selectedScheduleModalOpen) return;
    if (!selectedScheduleModalRef.current) return;

    const modalWidth = selectedScheduleModalRef.current.offsetWidth;
    const modalHeight = selectedScheduleModalRef.current.offsetHeight;
    const screenWidth = dateBoxSize.width * 7 + 256;
    const screenHeight = dateBoxSize.height * countWeeksInMonthCalendar(selectedDate) + 88;
    const itemWidth = selectedScheduleModalPosition.width;

    let left = selectedScheduleModalPosition.left + itemWidth + 20;
    let { top } = selectedScheduleModalPosition;

    if (left + modalWidth > screenWidth) {
      left = selectedScheduleModalPosition.left - (modalWidth + 20);
    }
    if (left < 0) {
      left = selectedScheduleModalPosition.left + 24;
      top += 24;
    }

    if (top + modalHeight > screenHeight) top -= modalHeight - 24;

    setSelectedScheduleModalStyle({ left, top, opacity: 100 });
  }, [selectedScheduleModalPosition, selectedScheduleModalOpen]);

  /**
   * 상태변화에 따른 모달 컨테이너의 리렌더링 방지
   */
  const modal = useMemo(
    () => (
      <ModalPortal>
        <CreateForm
          ref={createFormModalRef}
          style={{ ...createFormModalStyle }}
          dragDate={dragDate}
          setDragDate={setDragDate}
          closeModal={closeModal}
        />
      </ModalPortal>
    ),
    [modalOpen, closeModal, createFormModalStyle],
  );

  return (
    <>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500">
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
              setDragDate({ start: new Date(year, month - 1, date), end: new Date(year, month - 1, date) });
              setMouseDown(true);
            }}
            onMouseEnter={() => {
              if (mouseDown) setDragDate((state) => ({ ...state, end: new Date(year, month - 1, date) }));
            }}
            onMouseUp={() => {
              if (mouseDown) openModal();
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
                onClick={(e) => {
                  e.stopPropagation();
                  actions.setCalendarUnit('D');
                  actions.setSelectedDate(new Date(year, month - 1, date));
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {date === 1 ? `${month}월 ${date}일` : date}
              </DateButton>
            </div>
            {isSuccess ? (
              <ScheduleItems
                data={data[index]}
                dateBoxSize={dateBoxSize}
                openModal={openSelectedScheduleModal}
                setSelectedScheduleInfo={setSelectedScheduleInfo}
                setSelectedScheduleModalPosition={setSelectedScheduleModalPosition}
              />
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
      {modal}
      <SelectedSchedulePortal>
        <SelectedSchedule
          ref={selectedScheduleModalRef}
          style={{ ...selectedScheduleModalStyle }}
          close={closeSelectedScheduleModal}
          scheduleInfo={selectedScheduleInfo}
        />
      </SelectedSchedulePortal>
    </>
  );
}
