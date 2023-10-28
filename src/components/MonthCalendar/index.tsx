'use client';

import { useMainCalendar } from '@/store/mainCalendar';
import IconButton from '@/components/common/IconButton';
import Layer from '@/components/layouts/Layer';

export default function MonthCalendar() {
  const { selectedDate } = useMainCalendar();

  const countDays = () => {
    const target = new Date(selectedDate);

    target.setDate(1);
    const lastMonthDaysofFirstWeekCount = target.getDay();

    target.setMonth(selectedDate.getMonth() + 1);
    target.setDate(0);
    const currentMonthDaysCount = target.getDate();

    return Math.ceil((currentMonthDaysCount + lastMonthDaysofFirstWeekCount) / 7) * 7;
  };

  const selectedMonthDateArray = Array.from({ length: countDays() }, (_, index) => {
    const targetDate = new Date(selectedDate);
    targetDate.setDate(1);
    const day = targetDate.getDay();

    targetDate.setDate(targetDate.getDate() - day + index);
    return [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate()];
  });

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
              <IconButton
                key={`${year}-${month}-${date}`}
                aria-label={`${year}-${month}-${date}`}
                classExtend={['w-6', 'h-6', 'p-1']}
                onClick={() => console.log(date)}
              >
                {date}
              </IconButton>
            </div>
            <div />
          </Layer>
        ))}
      </div>
    </>
  );
}
