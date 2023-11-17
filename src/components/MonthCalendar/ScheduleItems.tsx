import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Schedule, ScheduleApi, ScheduleWithDateAndOrder } from '@/types/schedule';
import OutsideDetecter from '@/hooks/useOutsideDetector';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';
import Layer from '../layouts/Layer';

interface SchedulesProps {
  data: ScheduleWithDateAndOrder;
  dateBoxSize: { width: number; height: number };
  openModal: () => void;
  setSelectedScheduleInfo: Dispatch<SetStateAction<Schedule>>;
  setSelectedScheduleModalPosition: Dispatch<SetStateAction<{ top: number; left: number; width: number }>>;
}

interface ItemContainerProps {
  children: React.ReactNode;
  top: number;
  left: number;
  width: number;
}

interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classExtend?: string[];
}

const getColor = (type: 'event' | 'todo') => {
  if (type === 'event') return 'bg-yellow-200';
  return 'bg-lime-200';
};

function ItemContainer({ children, top, left, width }: ItemContainerProps) {
  return (
    <div
      className="h-6 absolute z-10"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
      }}
    >
      {children}
    </div>
  );
}

function Item({ children, classExtend, ...props }: ItemProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';
  return (
    <button
      {...props}
      className={`cursor-pointer h-[22px] text-left align-middle px-2 rounded leading-[22px] block w-full ${classExtension}`}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </button>
  );
}

function DateBox({
  date,
  schedules,
  handleScheduleItemClick,
}: {
  date: Date;
  schedules: ScheduleApi[];
  handleScheduleItemClick: (e: React.MouseEvent, schedule: ScheduleApi) => void;
}) {
  const targetDate = new Date(date);

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Layer gap="2" classExtend={['w-52', 'bg-white', 'rounded', 'shadow-box-2', 'p-3']}>
        <div>
          <div>{DAYS_OF_THE_WEEK[targetDate.getDay()]}</div>
          <div className="text-2xl">{targetDate.getDate()}</div>
        </div>
        <div>
          {schedules.map((schedule) => (
            <div className="h-6">
              <button
                className={`cursor-pointer text-left align-middle px-2 rounded leading-[22px] block w-full bg-blue-200 ${getColor(
                  schedule.type,
                )}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleScheduleItemClick(e, schedule);
                }}
              >
                {schedule.title}
              </button>
            </div>
          ))}
        </div>
      </Layer>
    </div>
  );
}

function SeeMore({
  limit,
  dateBoxWidth,
  hiddenSize,
  date,
  schedules,
  handleScheduleItemClick,
}: {
  limit: number;
  dateBoxWidth: number;
  hiddenSize: number;
  date: Date;
  schedules: ScheduleApi[];
  handleScheduleItemClick: (e: React.MouseEvent, schedule: ScheduleApi) => void;
}) {
  const [isFocus, setIsFocus] = useState(false);

  const handleSeeMoreClick = (e: React.MouseEvent) => {
    setIsFocus(true);
    e.stopPropagation();
  };

  const callback = useCallback(() => setIsFocus(false), []);

  return (
    <div>
      <ItemContainer top={(limit - 1) * 24} left={8} width={dateBoxWidth - 20}>
        <Item classExtend={['bg-blue-100']} onClick={handleSeeMoreClick}>
          <span>{hiddenSize}개 더보기</span>
        </Item>
      </ItemContainer>
      {isFocus ? (
        <OutsideDetecter callback={callback} classExtend={['absolute', '-top-7', 'left-0', 'z-20']}>
          <DateBox date={date} schedules={schedules} handleScheduleItemClick={handleScheduleItemClick} />
        </OutsideDetecter>
      ) : null}
    </div>
  );
}

export default function ScheduleItems({
  data,
  dateBoxSize,
  openModal,
  setSelectedScheduleInfo,
  setSelectedScheduleModalPosition,
}: SchedulesProps) {
  const { date, renderOrder, schedules, hiddenRender } = data;

  const getOrder = (id: number) => renderOrder.indexOf(id);

  const limit = Math.floor((dateBoxSize.height - 28) / 24);

  const handleScheduleItemClick = (e: React.MouseEvent, schedule: ScheduleApi) => {
    openModal();
    setSelectedScheduleInfo(schedule);

    const eventTarget = e.target as HTMLButtonElement;
    setSelectedScheduleModalPosition({
      left: eventTarget.getBoundingClientRect().left,
      top: eventTarget.getBoundingClientRect().top,
      width: eventTarget.offsetWidth,
    });
  };

  return (
    <div key={date.valueOf()} className="relative text-gray-800">
      {renderOrder
        .slice(0, limit - 1)
        .map((renderId) => schedules.find((schedule) => renderId === schedule.id))
        .filter((schedule) => schedule && (schedule.renderType === 'start' || schedule.renderType === 'startEnd'))
        .map(
          (schedule) =>
            schedule && (
              <ItemContainer
                key={schedule.id}
                top={getOrder(schedule.id) * 24}
                left={8}
                width={schedule.render * dateBoxSize.width - 20}
              >
                <Item
                  aria-label={`${schedule.type}-${schedule.title}`}
                  classExtend={[getColor(schedule.type)]}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScheduleItemClick(e, schedule);
                  }}
                >
                  {schedule.title}
                </Item>
              </ItemContainer>
            ),
        )}
      {limit <= renderOrder.length ? (
        <SeeMore
          limit={limit}
          dateBoxWidth={dateBoxSize.width}
          hiddenSize={hiddenRender.length}
          date={date}
          schedules={schedules}
          handleScheduleItemClick={handleScheduleItemClick}
        />
      ) : null}
    </div>
  );
}
