import React, { Dispatch, SetStateAction } from 'react';
import { Schedule, ScheduleWithDateAndOrder } from '@/types/schedule';

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
  width: number;
}

interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classExtend?: string[];
}

function ItemContainer({ children, top, width }: ItemContainerProps) {
  return (
    <div
      className="h-6 absolute z-10"
      style={{
        left: '8px',
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

export default function ScheduleItems({
  data,
  dateBoxSize,
  openModal,
  setSelectedScheduleInfo,
  setSelectedScheduleModalPosition,
}: SchedulesProps) {
  const { date, renderOrder, schedules, hiddenRender } = data;

  const getOrder = (id: number) => renderOrder.indexOf(id);
  const getColor = (type: 'event' | 'todo') => {
    if (type === 'event') return 'bg-yellow-200';
    return 'bg-lime-200';
  };

  const limit = Math.floor((dateBoxSize.height - 28) / 24);

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
                width={schedule.render * dateBoxSize.width - 20}
              >
                <Item
                  aria-label={`${schedule.type}-${schedule.title}`}
                  classExtend={[getColor(schedule.type)]}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                    setSelectedScheduleInfo(schedule);

                    const eventTarget = e.target as HTMLButtonElement;
                    setSelectedScheduleModalPosition({
                      left: eventTarget.getBoundingClientRect().left,
                      top: eventTarget.getBoundingClientRect().top,
                      width: eventTarget.offsetWidth,
                    });
                  }}
                >
                  {schedule.title}
                </Item>
              </ItemContainer>
            ),
        )}
      {limit <= renderOrder.length ? (
        <ItemContainer top={(limit - 1) * 24} width={dateBoxSize.width - 20}>
          <Item classExtend={['bg-blue-100']}>
            <span>{hiddenRender.length}개 더보기</span>
          </Item>
        </ItemContainer>
      ) : null}
    </div>
  );
}
