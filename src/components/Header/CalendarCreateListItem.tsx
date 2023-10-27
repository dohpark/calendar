import { calendarCreate } from '@/constants/calendar';
import { CalendarCreateListItemType } from './types';

interface ListItemProps {
  calendarUnitItem: CalendarCreateListItemType;
  onClick: () => void;
}

export default function CalendarCreateListItem({ calendarUnitItem, onClick: handleClickItem }: ListItemProps) {
  return (
    <li key={calendarUnitItem.key} className="text-sm hover:bg-zinc-100 hover:cursor-pointer">
      <button
        type="button"
        className="w-full px-4 py-2 grid grid-cols-auto-start items-center"
        onClick={() => {
          handleClickItem();
        }}
      >
        {calendarCreate[calendarUnitItem.createType]}
      </button>
    </li>
  );
}
