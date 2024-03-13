import { DateScheduleArray } from '@/types/schedule';
import { getTime, getTimeMinuteGap } from '@/utils/calendar';

export default function DayScheduleItem({ data }: { data: DateScheduleArray }) {
  return (
    <div className="flex w-[calc(100%-12px)] relative">
      {data.schedules.map((schedule) => {
        const minuteGap = getTimeMinuteGap(new Date(schedule.until), new Date(schedule.from));

        const height = `${(16 * minuteGap) / 15}px`;
        const width = `calc(100% / ${schedule.columnSize} * ${schedule.expand})`;
        const left = `calc(100% * ${schedule.currentColumn} / ${schedule.columnSize})`;

        return (
          <div
            key={schedule.id}
            className="absolute bg-blue-300 rounded-sm border border-white"
            style={{
              height,
              width,
              left,
            }}
          >
            <button
              className="bg-blue-100 w-[calc(100%-4px)] h-full text-xxs align-top pl-2 pt-[2px] flex align-items justify-left"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="text-sky-900 pr-2">{schedule.title}</div>
              <div className="text-slate-400 text-xxs">
                {getTime(new Date(schedule.from))}-{getTime(new Date(schedule.until))}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
