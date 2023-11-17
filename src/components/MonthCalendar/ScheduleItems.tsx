import React, {
  Dispatch,
  ForwardedRef,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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

interface DateBoxProps {
  date: Date;
  schedules: ScheduleApi[];
  handleScheduleItemClick: (e: React.MouseEvent, schedule: ScheduleApi) => void;
}

interface SeeMoreProps {
  limit: number;
  dateBoxWidth: number;
  hiddenSize: number;
  date: Date;
  schedules: ScheduleApi[];
  handleScheduleItemClick: (e: React.MouseEvent, schedule: ScheduleApi) => void;
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

const DateBox = forwardRef(
  ({ date, schedules, handleScheduleItemClick }: DateBoxProps, ref: ForwardedRef<HTMLDivElement>) => {
    const targetDate = new Date(date);

    return (
      <div
        role="presentation"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        ref={ref}
      >
        <Layer gap="2" classExtend={['w-52', 'bg-white', 'rounded', 'shadow-box-2', 'p-3']}>
          <div>
            <div>{DAYS_OF_THE_WEEK[targetDate.getDay()]}</div>
            <div className="text-2xl">{targetDate.getDate()}</div>
          </div>
          <div>
            {schedules.map((schedule) => (
              <div className="h-6" key={schedule.id}>
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
  },
);

function SeeMore({ limit, dateBoxWidth, hiddenSize, date, schedules, handleScheduleItemClick }: SeeMoreProps) {
  const [isFocus, setIsFocus] = useState(false);
  const [dateBoxPosition, setDateBoxPosition] = useState({ top: -28, left: 0, opacity: 0 });

  const dateboxRef = useRef<HTMLDivElement>(null);

  const handleSeeMoreClick = (e: React.MouseEvent) => {
    setIsFocus(true);
    e.stopPropagation();
  };

  const callback = useCallback(() => setIsFocus(false), []);

  /**
   * 더 보기 다이얼로그 생성 위치 계산 로직
   * 다이얼로그의 높이와 넓이, 뷰포트의 넓이와 높이, window 기준 다이얼로그의 절대적 위치(top, left), 다이얼로그의 부모 기준 다이얼로그의 상대적 위치(top, left)를 고려하여 계산한다.
   */
  useEffect(() => {
    if (!dateboxRef.current) return;
    if (!isFocus) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenBasedTop = dateboxRef.current.getBoundingClientRect().top;
    const screenBasedLeft = dateboxRef.current.getBoundingClientRect().left;
    const targetHeight = dateboxRef.current.offsetHeight;
    const targetWidth = dateboxRef.current.offsetWidth;
    let { top } = dateBoxPosition;
    let { left } = dateBoxPosition;

    // 만약 다이얼로그의 높이가 너무 높아 모니터 아래를 넘게 되면 화면에 안보이는만큼 위로 올린다.
    if (screenBasedTop + targetHeight > screenHeight) {
      top -= screenBasedTop + targetHeight - screenHeight + 8;
    }

    // 만약 다이얼로그의 screenBasedTop이 main calendar보다 높게 생성되면 main calendar 내에 생성될 수 있게 수정한다.
    // 헤더의 높이가 88이고 그 아래가 바로 main calendar이 존재한다.
    if (screenBasedTop < 88) {
      top += 88 - screenBasedTop;
    }

    // 만약 다이얼로그가 화면 오른쪽으로 넘어가면 화면에 안보이는만큼 왼쪽으로 이동시킨다.
    if (screenBasedLeft + targetWidth > screenWidth) {
      left -= screenBasedLeft + targetWidth - screenWidth;
    }

    setDateBoxPosition({ left, top, opacity: 100 });
  }, [isFocus]);

  return (
    <div>
      <ItemContainer top={(limit - 1) * 24} left={8} width={dateBoxWidth - 20}>
        <Item classExtend={['bg-blue-100']} onClick={handleSeeMoreClick}>
          <span>{hiddenSize}개 더보기</span>
        </Item>
      </ItemContainer>
      {isFocus ? (
        <OutsideDetecter callback={callback} classExtend={['absolute', 'z-20']} style={dateBoxPosition}>
          <DateBox
            ref={dateboxRef}
            date={date}
            schedules={schedules}
            handleScheduleItemClick={handleScheduleItemClick}
          />
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

  /**
   * limit은 날짜칸에 몇개의 스케줄을 표시할 수 있는지 계산한 값이다.
   * renderOrder은 어느 스케줄을 어느 순서에 따라 생성해야하는지 로직을 담고있다. 스케줄의 아이디값을 지니며, 만약에 렌더링을 하면 안되는 빈칸의 경우 -1 값을 지닌다.
   *
   * renderOrder을 slice하여 렌더링할 수 있는 만큼 자른다.
   * map을 활용하여 스케줄의 아이디의 정보를 가져온다.
   * 받아온 정보를 활용하여 렌더링을 해야하는 스케줄들을 filter한다.
   */
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
