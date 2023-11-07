import { useState } from 'react';
import MiniCalendar from '@/components/MiniCalendar';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';
import OutsideDetecter from '@/hooks/useOutsideDetector';

interface CalendarInputProps {
  date: Date;
  label: string;
  setDate: (date: Date) => void;
  disabledFilterCallback?: (date: Date) => boolean;
}

export default function CalendarInput({ date, setDate, label, disabledFilterCallback }: CalendarInputProps) {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <>
      <input
        aria-label={label}
        className="w-24 outline-none rounded px-1 py-1 hover:bg-zinc-100 cursor-pointer"
        value={`${date.getMonth() + 1}월 ${date.getDate()}일 (${DAYS_OF_THE_WEEK[date.getDay()]})`}
        onClick={() => {
          setIsFocus((state) => !state);
        }}
        readOnly
      />
      {isFocus ? (
        <OutsideDetecter callback={() => setIsFocus(false)} classExtend={['absolute', 'top-8', 'left-0']}>
          <MiniCalendar
            selectDate={setDate}
            selectedDate={date}
            disabledFilterCallback={disabledFilterCallback}
            classExtend={['bg-white', 'w-52', 'shadow-box-2', 'p-2', 'rounded']}
          />
        </OutsideDetecter>
      ) : null}
    </>
  );
}
