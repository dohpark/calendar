import { useMainCalendar } from '@/store/mainCalendar';
import { CalendarUnitListItemType } from './types';

interface ListItemProps {
  calendarUnitItem: CalendarUnitListItemType;
  onClick: () => void;
}

export default function CalendarUnitListItem({ calendarUnitItem, onClick: handleClickItem }: ListItemProps) {
  const { actions } = useMainCalendar();

  return (
    <li key={calendarUnitItem.key} className=" hover:bg-zinc-100 hover:cursor-pointer">
      <button
        type="button"
        className="w-full px-4 py-2 grid grid-cols-auto-start items-center"
        onClick={() => {
          actions.setCalendarUnit(calendarUnitItem.dayEng);
          handleClickItem();
        }}
      >
        <span className="text-sm">{calendarUnitItem.dayKor}</span>
        <span className="text-xs text-right">{calendarUnitItem.dayEng}</span>
      </button>
    </li>
  );
}
