import { useRef, useState } from 'react';
import Layer from '@/components/layouts/Layer';
import Text from '@public/svg/text.svg';
import Time from '@public/svg/time.svg';
import Close from '@public/svg/close.svg';
import TextButton from '@/components/common/TextButton';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';

interface LayerItemProps {
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}

interface CreateFormProps {
  style?: object;
  dragStartDate: Date;
  dragEndDate: Date;
}

function LayerItem({ children, Icon }: LayerItemProps) {
  return (
    <div className="flex">
      <div className="flex-none w-9 h-9 p-2 mr-2">
        {Icon ? <Icon width="20" height="20" /> : <div className="w-5 h-5" />}
      </div>
      {children}
    </div>
  );
}

export default function CreateForm({ style = {}, dragStartDate, dragEndDate }: CreateFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<'event' | 'todo'>('event');

  const startDate = dragStartDate < dragEndDate ? dragStartDate : dragEndDate;
  const endDate = dragStartDate > dragEndDate ? dragStartDate : dragEndDate;

  return (
    <div style={style} role="dialog" className="absolute w-[400px] rounded z-20 bg-white shadow-box-2 select-none">
      <div className="flex flex-row-reverse px-3 py-2 bg-gray-100">
        <button type="button">
          <Close height="20" width="20" />
        </button>
      </div>
      <Layer gap="3" classExtend={['p-4']}>
        <LayerItem>
          <input placeholder="제목" className="border-b-2 w-full p-1 text-lg outline-none" />
        </LayerItem>
        <LayerItem>
          <input
            className="hidden peer/event"
            type="radio"
            id="event"
            value="event"
            checked={type === 'event'}
            onChange={() => setType('event')}
          />
          <label
            className="text-sm px-3 py-1 mr-2 leading-7 cursor-pointer rounded hover:bg-zinc-100 peer-checked/event:bg-blue-100 peer-checked/event:text-blue-500"
            htmlFor="event"
          >
            이벤트
          </label>

          <input
            className="hidden peer/todo"
            type="radio"
            id="todo"
            value="todo"
            checked={type === 'todo'}
            onChange={() => setType('todo')}
          />
          <label
            className="text-sm px-3 py-1 mr-4 leading-7 cursor-pointer rounded hover:bg-zinc-100 peer-checked/todo:bg-blue-100 peer-checked/todo:text-blue-500"
            htmlFor="todo"
          >
            할 일
          </label>
        </LayerItem>
        <LayerItem Icon={Time}>
          <div className="self-center text-sm" role="presentation" aria-label="create form selected date">
            <span>
              {startDate.getMonth() + 1}월 {startDate.getDate()}일 ({DAYS_OF_THE_WEEK[startDate.getDay()]})
            </span>
            <span className="px-2">-</span>
            <span>
              {endDate.getMonth() + 1}월 {endDate.getDate()}일 ({DAYS_OF_THE_WEEK[endDate.getDay()]})
            </span>
          </div>
        </LayerItem>
        <LayerItem Icon={Text}>
          <textarea
            ref={textareaRef}
            rows={3}
            placeholder="설명 추가"
            className="w-full p-2 text-sm outline-none bg-gray-100 text-gray-700 rounded-sm resize-none"
            onChange={() => {
              if (!textareaRef.current) return;
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }}
          />
        </LayerItem>
        <div className="flex flex-row-reverse mt-5">
          <TextButton
            classExtend={['px-5', 'py-2', 'text-sm', 'bg-blue-500', 'text-white', 'hover:!bg-blue-600']}
            type="button"
          >
            저장
          </TextButton>
        </div>
      </Layer>
    </div>
  );
}
