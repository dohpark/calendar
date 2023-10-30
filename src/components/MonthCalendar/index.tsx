'use client';

import { useMainCalendar } from '@/store/mainCalendar';
import DateButton from '@/components/common/DateButton';
import { countMonthDays } from '@/utils/calendar';

export default function MonthCalendar() {
  const { selectedDate } = useMainCalendar();

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

  return (
    <>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500">
        {['일', '월', '화', '수', '목', '금', '토'].map((value) => (
          <div key={value} className="border-l pt-2">
            {value}
          </div>
        ))}
      </div>
      <div className={`grid grid-cols-7 ${getGridRows(countWeeks())} text-xs text-center overflow-hidden`}>
        {selectedMonthDateArray.map(([year, month, date]) => (
          <div
            role="gridcell"
            tabIndex={0}
            className="border-l border-b cursor-pointer grid grid-rows-auto-start gap-0 auto-rows-min"
            key={`${year}-${month}-${date}`}
            aria-label={`${year}-${month}-${date}`}
            onClick={() => console.log(`${year}-${month}-${date}`)}
            onKeyDown={(e) => {
              if (e.code === 'Space') console.log(`${year}-${month}-${date}`);
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
                  console.log(date);
                }}
              >
                {date === 1 ? `${month}월 ${date}일` : date}
              </DateButton>
            </div>
            <div />
          </div>
        ))}
      </div>
    </>
  );
}
