import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Layer from '@/components/layouts/Layer';
import Text from '@public/svg/text.svg';
import Time from '@public/svg/time.svg';
import Close from '@public/svg/close.svg';
import TextButton from '@/components/common/TextButton';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';
import { CalendarCreateType } from '@/types/calendar';
import MiniCalendar from '@/components/MiniCalendar';
import OutsideDetecter from '@/hooks/useOutsideDetector';
import { useMainCalendar } from '@/store/mainCalendar';
import ListBox from '@/components/common/ListBox';
import { createTimeItems, getTimeDisplay } from '@/utils/calendar';
import TimeListItem from './TimeListItem';

interface LayerItemProps {
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}

interface DragState {
  start: Date;
  end: Date;
}

interface CreateFormProps {
  style?: object;
  dragDate: DragState;
  setDragDate: Dispatch<SetStateAction<DragState>>;
}

interface CalendarInputProps {
  date: Date;
  label: string;
  setDate: (date: Date) => void;
  disabledFilterCallback?: (date: Date) => boolean;
}

interface TimeInputProps {
  date: Date;
  setTime: (hour: number, minute: number) => void;
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

function CalendarInput({ date, setDate, label, disabledFilterCallback }: CalendarInputProps) {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <>
      <input
        aria-label={label}
        className="w-24 outline-none rounded px-1 py-1 hover:bg-zinc-100 cursor-pointer"
        value={`${date.getMonth() + 1}월 ${date.getDate()}일 (${DAYS_OF_THE_WEEK[date.getDay()]})`}
        onClick={() => {
          setIsFocus((state) => !state);
        }}
        readOnly
      />
      {isFocus ? (
        <OutsideDetecter callback={() => setIsFocus(false)} classExtend={['absolute', 'top-8', 'left-0']}>
          <MiniCalendar
            selectDate={setDate}
            selectedDate={date}
            disabledFilterCallback={disabledFilterCallback}
            classExtend={['bg-white', 'w-52', 'shadow-box-2', 'p-2', 'rounded']}
          />
        </OutsideDetecter>
      ) : null}
    </>
  );
}

function TimeInput({ date, setTime }: TimeInputProps) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <>
      <input
        aria-label="start time"
        className="w-20 outline-none rounded px-1 py-1 hover:bg-zinc-100 cursor-pointer"
        value={getTimeDisplay(date.getHours(), date.getMinutes())}
        onClick={() => {
          setIsFocus((state) => !state);
        }}
        readOnly
      />
      {isFocus ? (
        <OutsideDetecter callback={() => setIsFocus(false)} classExtend={['absolute', 'top-8', 'left-0']}>
          <ListBox<{ key: string; hour: number; minute: number }>
            classExtend={['w-40', 'h-44', 'overflow-y-auto']}
            ItemComponent={TimeListItem}
            onClick={(hour: number, minute: number) => setTime(hour, minute)}
            sourceName="time"
            items={createTimeItems()}
          />
        </OutsideDetecter>
      ) : null}
    </>
  );
}

export default function CreateForm({ style = {}, dragDate, setDragDate }: CreateFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState<CalendarCreateType>('event');
  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState(dragDate.start < dragDate.end ? dragDate.start : dragDate.end);
  const [endDate, setEndDate] = useState(dragDate.start > dragDate.end ? dragDate.start : dragDate.end);

  const { actions } = useMainCalendar();

  const setEventStartDate = (targetDate: Date) => {
    setStartDate(targetDate);
    if (targetDate.getFullYear() !== startDate.getFullYear() || targetDate.getMonth() !== startDate.getMonth()) {
      actions.setSelectedDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    }
    setDragDate({ start: targetDate, end: endDate });
  };

  const setEventEndDate = (targetDate: Date) => {
    setEndDate(targetDate);
    setDragDate((prevDate) => ({ ...prevDate, end: targetDate }));
  };

  const setTodoDate = (targetDate: Date) => {
    setStartDate(targetDate);
    setEndDate(targetDate);
    setDragDate({ start: targetDate, end: targetDate });
    if (targetDate.getFullYear() !== startDate.getFullYear() || targetDate.getMonth() !== startDate.getMonth()) {
      actions.setSelectedDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    }
  };

  const setTodoTime = (hour: number, minute: number) => {
    const targetDate = new Date(startDate);
    targetDate.setHours(hour, minute);
    setStartDate(targetDate);
  };

  const startDisabledFilterCallback = (date: Date) => {
    if (date > endDate) return true;
    return false;
  };

  const endDisabledFilterCallback = (date: Date) => {
    if (date < startDate) return true;
    return false;
  };

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
          {type === 'event' ? (
            <div className="self-center text-sm" role="presentation" aria-label="create form selected date">
              <span className="relative" aria-label="event start date">
                <CalendarInput
                  label="start date"
                  date={startDate}
                  setDate={setEventStartDate}
                  disabledFilterCallback={startDisabledFilterCallback}
                />
              </span>
              <span className="px-2">-</span>
              <span className="relative" aria-label="event end date">
                <CalendarInput
                  label="end date"
                  date={endDate}
                  setDate={setEventEndDate}
                  disabledFilterCallback={endDisabledFilterCallback}
                />
              </span>
            </div>
          ) : null}
          {type === 'todo' ? (
            <div className="self-center text-sm">
              <div role="presentation" aria-label="create form selected date">
                <span className="relative" aria-label="todo start date">
                  <CalendarInput label="start date" date={startDate} setDate={setTodoDate} />
                </span>
                {!isAllDay ? (
                  <span className="ml-3 relative">
                    <TimeInput date={startDate} setTime={setTodoTime} />
                  </span>
                ) : null}
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="allday"
                  className="w-4 h-4 mr-2"
                  checked={isAllDay}
                  onChange={() => setIsAllDay((state) => !state)}
                />
                <label htmlFor="allday">종일</label>
              </div>
            </div>
          ) : null}
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
