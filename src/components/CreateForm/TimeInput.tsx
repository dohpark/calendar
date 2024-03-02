import { useState } from 'react';
import OutsideDetecter from '@/hooks/useOutsideDetector';
import ListBox from '@/components/shared/ListBox';
import { getDateExcludingTime, getTimeDisplay, isSameDate } from '@/utils/calendar';
import TimeListItem from './TimeListItem';

interface TimeInputProps {
  date: Date;
  compareDate?: Date;
  label: string;
  setTime: (date: Date) => void;
  className?: string;
}

export default function TimeInput({ date, setTime, label, className, compareDate }: TimeInputProps) {
  const [isFocus, setIsFocus] = useState(false);

  const createTimeItems = (startDate: Date, type: 'default' | 'compare') => {
    const length = 24 * 4;

    const targetDate = type === 'compare' ? startDate : getDateExcludingTime(startDate);

    const standard = targetDate.getTime();

    const array = Array.from({ length }, (_, index) => ({
      key: standard + index,
      time: standard + 1000 * 15 * 60 * index,
      index,
      type,
    }));

    return array;
  };

  return (
    <>
      <input
        aria-label={label}
        className="w-20 outline-none rounded px-1 py-1 hover:bg-zinc-100 cursor-pointer"
        value={getTimeDisplay(date.getHours(), date.getMinutes())}
        onClick={() => {
          setIsFocus((state) => !state);
        }}
        readOnly
      />
      {isFocus ? (
        <OutsideDetecter callback={() => setIsFocus(false)} classExtend={[className || '']}>
          <ListBox<{ key: number; time: number; index: number; type: 'default' | 'compare' }>
            classExtend={['w-40', 'h-44', 'overflow-y-auto']}
            ItemComponent={TimeListItem}
            onClick={(targetDate: Date) => setTime(targetDate)}
            sourceName="info"
            items={
              compareDate && isSameDate(date, compareDate)
                ? createTimeItems(compareDate, 'compare').slice(1)
                : createTimeItems(date, 'default')
            }
          />
        </OutsideDetecter>
      ) : null}
    </>
  );
}
