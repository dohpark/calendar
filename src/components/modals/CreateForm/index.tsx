import { Dispatch, FormEvent, ForwardedRef, SetStateAction, forwardRef, useRef, useState } from 'react';
import Layer from '@/components/layouts/Layer';
import Text from '@public/svg/text.svg';
import Time from '@public/svg/time.svg';
import Close from '@public/svg/close.svg';
import TextButton from '@/components/common/TextButton';
import { useMainCalendar } from '@/store/mainCalendar';
import { useMutation } from '@tanstack/react-query';
import scheduleApi from '@/api/schedule';
import { CreateSchedule } from '@/types/schedule';
import CalendarInput from './CalendarInput';
import TimeInput from './TimeInput';

interface LayerItemProps {
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
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

interface DragState {
  start: Date;
  end: Date;
}

interface CreateFormProps {
  style?: object;
  dragDate: DragState;
  setDragDate: Dispatch<SetStateAction<DragState>>;
  closeModal: () => void;
}

function CreateForm(
  { style = {}, dragDate, setDragDate, closeModal }: CreateFormProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState<CreateSchedule>({
    type: 'event',
    title: '',
    description: null,
    from: dragDate.start < dragDate.end ? dragDate.start : dragDate.end,
    until: dragDate.start > dragDate.end ? dragDate.start : dragDate.end,
    allDay: true,
  });

  const { mutate: createSchedule } = useMutation({ mutationFn: () => scheduleApi.create(form) });

  const { actions } = useMainCalendar();

  const setEventStartDate = (targetDate: Date) => {
    setForm((prevForm) => ({ ...prevForm, from: targetDate }));
    if (targetDate.getFullYear() !== form.from.getFullYear() || targetDate.getMonth() !== form.from.getMonth()) {
      actions.setSelectedDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    }
    setDragDate({ start: targetDate, end: form.until });
  };

  const setEventEndDate = (targetDate: Date) => {
    setForm((prevForm) => ({ ...prevForm, until: targetDate }));
    setDragDate((prevDate) => ({ ...prevDate, end: targetDate }));
  };

  const initTodo = () => {
    setForm((prevForm) => ({ ...prevForm, until: form.from, type: 'todo' }));
    setDragDate({ start: form.from, end: form.from });
  };

  const setTodoDate = (targetDate: Date) => {
    setForm((prevForm) => ({ ...prevForm, from: targetDate, until: targetDate }));
    setDragDate({ start: targetDate, end: targetDate });
    if (targetDate.getFullYear() !== form.from.getFullYear() || targetDate.getMonth() !== form.from.getMonth()) {
      actions.setSelectedDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    }
  };

  const setTodoTime = (hour: number, minute: number) => {
    const targetDate = new Date(form.from);
    targetDate.setHours(hour, minute);
    setForm((prevForm) => ({ ...prevForm, from: targetDate }));
  };

  const startDisabledFilterCallback = (date: Date) => {
    if (date > form.until) return true;
    return false;
  };

  const endDisabledFilterCallback = (date: Date) => {
    if (date < form.from) return true;
    return false;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSchedule();
    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={style}
      ref={ref}
      role="dialog"
      className="absolute w-[400px] rounded z-20 bg-white shadow-box-2 select-none"
    >
      <div className="flex flex-row-reverse px-3 py-2 bg-gray-100">
        <button type="button" onClick={() => closeModal()}>
          <Close height="20" width="20" />
        </button>
      </div>
      <Layer gap="3" classExtend={['p-4']}>
        <LayerItem>
          <input
            placeholder="제목"
            className="border-b-2 w-full p-1 text-lg outline-none"
            value={form.title}
            onChange={(e) => setForm((prevForm) => ({ ...prevForm, title: e.target.value }))}
          />
        </LayerItem>
        <LayerItem>
          <input
            className="hidden peer/event"
            type="radio"
            id="event"
            value="event"
            checked={form.type === 'event'}
            onChange={() => setForm((prevForm) => ({ ...prevForm, type: 'event' }))}
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
            checked={form.type === 'todo'}
            onChange={() => initTodo()}
          />
          <label
            className="text-sm px-3 py-1 mr-4 leading-7 cursor-pointer rounded hover:bg-zinc-100 peer-checked/todo:bg-blue-100 peer-checked/todo:text-blue-500"
            htmlFor="todo"
          >
            할 일
          </label>
        </LayerItem>
        <LayerItem Icon={Time}>
          {form.type === 'event' ? (
            <div className="self-center text-sm" role="presentation" aria-label="create form selected date">
              <span className="relative" aria-label="event start date">
                <CalendarInput
                  label="start date"
                  date={form.from}
                  setDate={setEventStartDate}
                  disabledFilterCallback={startDisabledFilterCallback}
                />
              </span>
              <span className="px-2">-</span>
              <span className="relative" aria-label="event end date">
                <CalendarInput
                  label="end date"
                  date={form.until}
                  setDate={setEventEndDate}
                  disabledFilterCallback={endDisabledFilterCallback}
                />
              </span>
            </div>
          ) : null}
          {form.type === 'todo' ? (
            <div className="self-center text-sm">
              <div role="presentation" aria-label="create form selected date">
                <span className="relative" aria-label="todo start date">
                  <CalendarInput label="start date" date={form.from} setDate={setTodoDate} />
                </span>
                {!form.allDay ? (
                  <span className="ml-3 relative">
                    <TimeInput date={form.from} setTime={setTodoTime} />
                  </span>
                ) : null}
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="allday"
                  className="w-4 h-4 mr-2"
                  checked={form.allDay}
                  onChange={() => setForm((prevForm) => ({ ...prevForm, allDay: !prevForm.allDay }))}
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
            type="submit"
          >
            저장
          </TextButton>
        </div>
      </Layer>
    </form>
  );
}

export default forwardRef<HTMLFormElement, CreateFormProps>(CreateForm);
