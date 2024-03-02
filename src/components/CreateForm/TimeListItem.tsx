import { getTimeDisplay } from '@/utils/calendar';

interface ListItemProps {
  info: {
    key: number;
    time: number;
    index: number;
    type: 'default' | 'compare';
  };
  onClick: (date: Date) => void;
}

export default function ComparedTimeListItem({
  info: { key, time, index, type },
  onClick: handleClickItem,
}: ListItemProps) {
  const target = new Date(time);

  const deltaHour = Math.floor((15 * index) / 60);
  const deltaMinute = (15 * index) % 60;

  const compare =
    type === 'compare' ? ` (+${deltaHour === 0 ? `${deltaMinute}분` : `${deltaHour}시간 ${deltaMinute}분`})` : '';

  const item = `${getTimeDisplay(target.getHours(), target.getMinutes())}${compare}`;

  return (
    <li key={key} className="text-sm hover:bg-zinc-100 hover:cursor-pointer">
      <button
        type="button"
        className="w-full px-4 py-2 text-left cursor-pointer"
        onClick={() => {
          handleClickItem(target);
        }}
      >
        {item}
      </button>
    </li>
  );
}
