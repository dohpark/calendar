import { ScheduleWithDateAndOrder } from '@/types/schedule';

interface SchedulesProps {
  data: ScheduleWithDateAndOrder;
  width: number;
}

export default function Schedule({ data, width }: SchedulesProps) {
  const { date, renderOrder } = data;

  const getOrder = (id: number) => renderOrder.indexOf(id);
  const getColor = (type: 'event' | 'todo') => {
    if (type === 'event') return 'bg-yellow-200';
    return 'bg-lime-200';
  };

  return (
    <div key={date.valueOf()} className="relative">
      {data.schedules
        .filter((schedule) => schedule.renderType === 'start' || schedule.renderType === 'startEnd')
        .map((schedule) => (
          <div
            key={schedule.id}
            className="h-6 absolute z-10"
            style={{ left: '8px', top: `${getOrder(schedule.id) * 24}px`, width: `${schedule.render * width - 20}px` }}
          >
            <button
              aria-label={`${schedule.type}-${schedule.title}`}
              className={`cursor-pointer h-[22px] text-left align-middle px-2 rounded leading-[22px] block w-full ${getColor(
                schedule.type,
              )}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              {schedule.type} {schedule.title}
            </button>
          </div>
        ))}
    </div>
  );
}
