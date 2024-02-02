import Split from '@/components/shared/layouts/Split';
import Expand from '@public/svg/expand_vertical.svg';
import IconButton from '@/components/shared/IconButton';
import ScheduleItem from '@/components/shared/ScheduleItem';

export default function DayCalendar() {
  return (
    <div className="overflow-hidden relative select-none">
      <div>
        <Split fraction="auto-start" gap="0" classExtend={['text-xs', 'text-gray-500', 'mt-1', 'mb-1']}>
          <div className="w-16 text-right">GMT+09</div>
          <div className="ml-auto mr-auto">
            <span className="mr-1">토</span>
            <span>2</span>
          </div>
        </Split>
        <Split fraction="auto-start" gap="0" classExtend={['border-gray-200', 'border-b', 'border-t']}>
          <div className="w-16 text-right border-r">
            <IconButton classExtend={['mr-2']}>
              <Expand width="12" height="12" />
            </IconButton>
          </div>
          <div className="mt-1 pl-1">
            <ScheduleItem type="event" title="test1" onClick={() => {}} classExtend={['pr-3', 'text-xs']} />
            <ScheduleItem type="event" title="test2" onClick={() => {}} classExtend={['pr-3', 'text-xs']} />
            <ScheduleItem type="event" title="test3" onClick={() => {}} classExtend={['pr-3', 'text-xs']} />
          </div>
        </Split>
      </div>
      <Split
        fraction="auto-start"
        gap="0"
        classExtend={['overflow-y-scroll', 'h-[calc(100vh-165px)]', 'scrollbar-hide']}
      >
        <div className="w-16 border-r">
          {Array.from({ length: 23 }, (_, i) => i).map((v) => (
            <div key={v} className="h-[48px] relative">
              <span className="absolute -bottom-2 text-xs right-2 text-gray-500">
                {v + 1 < 12 ? `${v + 1} am` : `${v + 1} pm`}
              </span>
            </div>
          ))}
        </div>
        <div>
          {Array.from({ length: 24 * 4 }, (_, i) => i).map((v) => (
            <div key={v} className={`h-3 text-xs ${(v + 1) % 4 === 0 ? 'border-b' : ''}`} />
          ))}
        </div>
      </Split>
    </div>
  );
}
