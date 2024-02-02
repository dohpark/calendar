import { CalendarCreateType } from '@/types/calendar';

export default function ScheduleItem({
  type,
  title,
  onClick: handleClick,
  classExtend = [],
}: {
  type: CalendarCreateType;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  classExtend?: string[];
}) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <div className={`h-6 ${classExtension}`}>
      <button
        className={`cursor-pointer text-left align-middle px-2 rounded leading-[22px] block w-full bg-blue-200 ${
          type === 'event' ? 'bg-yellow-200' : 'bg-lime-200'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
      >
        {title}
      </button>
    </div>
  );
}
