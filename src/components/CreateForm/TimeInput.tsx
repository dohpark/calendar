import { useState } from 'react';
import OutsideDetecter from '@/hooks/useOutsideDetector';
import ListBox from '@/components/shared/ListBox';
import { createTimeItems, getTimeDisplay } from '@/utils/calendar';
import TimeListItem from './TimeListItem';

interface TimeInputProps {
  date: Date;
  label: string;
  setTime: (hour: number, minute: number) => void;
}

export default function TimeInput({ date, setTime, label }: TimeInputProps) {
  const [isFocus, setIsFocus] = useState(false);

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
        <OutsideDetecter callback={() => setIsFocus(false)} classExtend={['absolute', 'top-8', 'left-0']}>
          <ListBox<{ key: string; hour: number; minute: number }>
            classExtend={['w-40', 'h-44', 'overflow-y-auto']}
            ItemComponent={TimeListItem}
            onClick={(hour: number, minute: number) => setTime(hour, minute)}
            sourceName="time"
            items={createTimeItems()}
          />
        </OutsideDetecter>
      ) : null}
    </>
  );
}
