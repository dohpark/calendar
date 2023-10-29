'use client';

import { useMainCalendar } from '@/store/mainCalendar';
import DateButton from '@/components/common/DateButton';
import Layer from '@/components/layouts/Layer';
import { countMonthDays } from '@/utils/calendar';

export default function MonthCalendar() {
  const { selectedDate } = useMainCalendar();

  const countDays = () => {
    const target = new Date(selectedDate);

    target.setDate(1);
    const lastMonthDaysofFirstWeekCount = target.getDay();

    const currentMonthDaysCount = countMonthDays(target);

    return Math.ceil((currentMonthDaysCount + lastMonthDaysofFirstWeekCount) / 7) * 7;
  };

  const selectedMonthDateArray = Array.from({ length: countDays() }, (_, index) => {
    const targetDate = new Date(selectedDate);
    targetDate.setDate(1);
    const day = targetDate.getDay();

    targetDate.setDate(targetDate.getDate() - day + index);
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

  return (
    <>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500">
        {['일', '월', '화', '수', '목', '금', '토'].map((value) => (
          <div key={value} className="border-l pt-2">
            {value}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-xs text-center">
        {selectedMonthDateArray.map(([year, month, date]) => (
          <Layer
            gap="0"
            key={`${year}-${month}-${date}`}
            aria-label={`${year}-${month}-${date}`}
            classExtend={['border-l', 'border-b', 'cursor-pointer', 'grid-rows-auto-start']}
          >
            <div className="pt-1">
              <DateButton
                year={year}
                month={month}
                date={date}
                classExtend={[date !== 1 ? 'w-6' : '!w-auto', getDateButtonCss(year, month, date)]}
                onClick={() => console.log(date)}
              >
                {date === 1 ? `${month}월 ${date}일` : date}
              </DateButton>
            </div>
            <div />
          </Layer>
        ))}
      </div>
    </>
  );
}
