import Layer from '@/components/shared/layouts/Layer';
import LayerItem from '@/components/shared/LayerItem';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';
import Close from '@public/svg/close.svg';
import Text from '@public/svg/text.svg';
import Time from '@public/svg/time.svg';
import TrashCan from '@public/svg/trash_can.svg';
import Pencil from '@public/svg/pencil.svg';
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import Inline from '@/components/shared/layouts/Inline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import scheduleApi from '@/api/schedule';
import { useMainCalendarStore } from '@/store/mainCalendar';
import { useSelectedScheduleStore } from '@/store/selectedSchedule';

interface SelectedScheduleProps {
  style: { top: number; left: number };
  close: () => void;
}

function SelectedSchedule({ close, style }: SelectedScheduleProps, ref: ForwardedRef<HTMLDivElement>) {
  const {
    selectedSchedule: {
      info: { id, title, from, until, description, type },
    },
  } = useSelectedScheduleStore();

  const startDate = new Date(from);
  const endDate = new Date(until);
  const { selectedDate } = useMainCalendarStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [description]);

  const queryClient = useQueryClient();
  const { mutate: deleteSchedule } = useMutation({
    mutationFn: () => scheduleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`] });
      close();
    },
  });

  return (
    <div
      ref={ref}
      style={style}
      role="dialog"
      className="absolute w-[400px] rounded z-20 bg-white shadow-box-2 select-none"
    >
      <Inline gap="0" justify="end" align="center" classExtend={['px-3', 'py-3', 'bg-gray-100']}>
        <button type="button" onClick={() => {}}>
          <Pencil height="20" width="20" />
        </button>
        <button className="ml-5" type="button" onClick={() => deleteSchedule()}>
          <TrashCan height="20" width="20" />
        </button>
        <button className="ml-10" type="button" onClick={() => close()}>
          <Close height="20" width="20" />
        </button>
      </Inline>
      <Layer gap="3" classExtend={['p-4']}>
        <LayerItem backgroundColor={type === 'event' ? 'bg-yellow-200' : 'bg-lime-200'}>
          <div className="self-center">{title}</div>
        </LayerItem>
        <LayerItem Icon={Time}>
          <div className="self-center text-sm" role="presentation" aria-label="create form selected date">
            <span className="relative" aria-label="event start date">
              {`${startDate.getMonth() + 1}월 ${startDate.getDate()}일 (${DAYS_OF_THE_WEEK[startDate.getDay()]})`}
            </span>
            <span className="px-2">-</span>
            <span className="relative" aria-label="event end date">
              {`${endDate.getMonth() + 1}월 ${endDate.getDate()}일 (${DAYS_OF_THE_WEEK[endDate.getDay()]})`}
            </span>
          </div>
        </LayerItem>
        <LayerItem Icon={Text}>
          <textarea
            ref={textareaRef}
            rows={2}
            value={description || '설명 없음'}
            className="w-full p-2 text-sm outline-none bg-gray-100 text-gray-700 rounded-sm resize-none mb-3"
            readOnly
          />
        </LayerItem>
      </Layer>
    </div>
  );
}

export default forwardRef<HTMLDivElement, SelectedScheduleProps>(SelectedSchedule);
