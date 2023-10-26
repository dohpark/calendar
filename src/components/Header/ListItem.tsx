import { useCalendar } from '@/store/calendar';
import { ListItemType } from './types';

interface ListItemProps {
  item: ListItemType;
  onClick: () => void;
}

export default function ListItem({ item, onClick: handleClickItem }: ListItemProps) {
  const { actions } = useCalendar();

  return (
    <li key={item.key} className=" hover:bg-zinc-100 hover:cursor-pointer">
      <button
        type="button"
        className="w-full px-4 py-2 grid grid-cols-auto-start items-center"
        onClick={() => {
          actions.setCalendarUnit(item.dayEng);
          handleClickItem();
        }}
      >
        <span className="text-sm">{item.dayKor}</span>
        <span className="text-xs text-right">{item.dayEng}</span>
      </button>
    </li>
  );
}
