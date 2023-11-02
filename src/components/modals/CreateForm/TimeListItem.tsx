import { getTimeDisplay } from '@/utils/calendar';

interface ListItemProps {
  time: { key: string; hour: number; minute: number };
  onClick: (hour: number, minute: number) => void;
}

export default function TimeListItem({ time, onClick: handleClickItem }: ListItemProps) {
  const item = getTimeDisplay(time.hour, time.minute);

  return (
    <li key={time.key} className="text-sm hover:bg-zinc-100 hover:cursor-pointer">
      <button
        type="button"
        className="w-full px-4 py-2 text-left cursor-pointer"
        onClick={() => {
          handleClickItem(time.hour, time.minute);
        }}
      >
        {item}
      </button>
    </li>
  );
}
