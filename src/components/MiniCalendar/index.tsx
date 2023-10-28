import { useEffect, useState } from 'react';
import Inline from '@/components/layouts/Inline';
import Layer from '@/components/layouts/Layer';
import Split from '@/components/layouts/Split';
import IconButton from '@/components/common/IconButton';
import Left from '@public/svg/left.svg';
import Right from '@public/svg/right.svg';
import { useMainCalendar } from '@/store/mainCalendar';

interface MiniCalendarProps {
  classExtend?: string[];
}

export default function MiniCalendar({ classExtend }: MiniCalendarProps) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const [displayDate, setDisplayDate] = useState(new Date(todayYear, todayMonth - 1, 1));

  const { selectedDate, actions: mainCalendarActions } = useMainCalendar();

  useEffect(() => {
    const mainCalendarYear = selectedDate.getFullYear();
    const mainCalendarMonth = selectedDate.getMonth();

    const miniCalendarYear = displayDate.getFullYear();
    const miniCalendarMonth = displayDate.getMonth();

    if (mainCalendarYear !== miniCalendarYear || mainCalendarMonth !== miniCalendarMonth) {
      setDisplayDate(new Date(mainCalendarYear, mainCalendarMonth, 1));
    }
  }, [selectedDate]);

  const miniCalendarYear = displayDate.getFullYear();
  const miniCalendarMonth = displayDate.getMonth() + 1;

  const selectedMonthDateArray = Array.from({ length: 42 }, (_, index) => {
    const targetDate = new Date(displayDate);
    targetDate.setDate(1);
    const day = targetDate.getDay();

    targetDate.setDate(targetDate.getDate() - day + index);
    return [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate()];
  });

  const increaseMiniCalendarMonth = () => {
    const targetDate = new Date(displayDate);
    targetDate.setMonth(displayDate.getMonth() + 1);

    setDisplayDate(targetDate);
  };
  const decreaseMiniCalendarMonth = () => {
    const targetDate = new Date(displayDate);
    targetDate.setMonth(displayDate.getMonth() - 1);

    setDisplayDate(targetDate);
  };

  const getDateButtonCss = (year: number, month: number, date: number) => {
    if (todayYear === year && todayMonth === month && todayDate === date)
      return 'bg-blue-500 text-white hover:bg-blue-600';
    if (selectedDate.getFullYear() === year && selectedDate.getMonth() + 1 === month && selectedDate.getDate() === date)
      return 'bg-blue-200 text-blue-500 hover:bg-blue-300';
    if (month !== displayDate.getMonth() + 1) return 'text-gray-400';

    return 'text-gray-600';
  };

  const classExtension = classExtend ? classExtend.join(' ') : '';
  return (
    <div className={`${classExtension}`} role="presentation" aria-label="mini calendar">
      <Layer gap="0">
        <Split fraction="3/4" gap="0" classExtend={['items-center']}>
          <div
            className="text-sm pl-2 text-gray-800"
            role="presentation"
            aria-label="mini calendar display year and month"
          >{`${miniCalendarYear}년 ${miniCalendarMonth}월`}</div>
          <Inline gap="0" justify="end" align="center">
            <IconButton
              aria-label="mini calendar left button"
              type="button"
              classExtend={['p-2']}
              onClick={decreaseMiniCalendarMonth}
            >
              <span>
                <Left width="10" height="10" />
              </span>
            </IconButton>
            <IconButton
              aria-label="mini calendar right button"
              type="button"
              classExtend={['p-2']}
              onClick={increaseMiniCalendarMonth}
            >
              <span>
                <Right width="10" height="10" />
              </span>
            </IconButton>
          </Inline>
        </Split>
        <div className="grid grid-cols-7 py-2 text-xs text-center text-gray-500">
          {['일', '월', '화', '수', '목', '금', '토'].map((value) => (
            <div key={value} className="">
              {value}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-xs text-center">
          {selectedMonthDateArray.map(([year, month, date]) => (
            <IconButton
              key={`${year}-${month}-${date}`}
              aria-label={`${year}-${month}-${date}`}
              classExtend={['w-6', 'h-6', 'p-1', 'justify-self-center', getDateButtonCss(year, month, date)]}
              onClick={() => mainCalendarActions.setSelectedDate(new Date(year, month - 1, date))}
            >
              {date}
            </IconButton>
          ))}
        </div>
      </Layer>
    </div>
  );
}
