import { FormEvent, ForwardedRef, forwardRef, useRef } from 'react';
import Layer from '@/components/shared/layouts/Layer';
import Text from '@public/svg/text.svg';
import Time from '@public/svg/time.svg';
import Close from '@public/svg/close.svg';
import TextButton from '@/components/shared/TextButton';
import { useMainCalendarStore } from '@/store/mainCalendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import scheduleApi from '@/api/schedule';
import LayerItem from '@/components/shared/LayerItem';
import { useCreateFormStore } from '@/store/createForm';
import CalendarInput from './CalendarInput';
import TimeInput from './TimeInput';

interface CreateFormProps {
  style?: object;
  closeModal: () => void;
}

function CreateForm({ style = {}, closeModal }: CreateFormProps, ref: ForwardedRef<HTMLFormElement>) {
  const { selectedDate, calendarUnit, actions: mainCalendarActions } = useMainCalendarStore();
  const { createForm, actions: createFormActions } = useCreateFormStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const { mutate: createSchedule } = useMutation({
    mutationFn: () => scheduleApi.create(createForm.form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`] });
      closeModal();
    },
  });

  const setEventStartDate = (targetDate: Date) => {
    createFormActions.setForm({ from: targetDate });
    if (
      targetDate.getFullYear() !== createForm.form.from.getFullYear() ||
      targetDate.getMonth() !== createForm.form.from.getMonth()
    ) {
      mainCalendarActions.setSelectedDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    }
  };

  const setEventEndDate = (targetDate: Date) => {
    createFormActions.setForm({ until: targetDate });
  };

  const initTodo = () => {
    createFormActions.setForm({ until: createForm.form.from, type: 'todo' });
  };

  const setTodoDate = (targetDate: Date) => {
    createFormActions.setForm({ from: targetDate, until: targetDate });
    if (
      targetDate.getFullYear() !== createForm.form.from.getFullYear() ||
      targetDate.getMonth() !== createForm.form.from.getMonth()
    ) {
      mainCalendarActions.setSelectedDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    }
  };

  const setDescription = (description: string) => {
    createFormActions.setForm({ description });
  };

  const setFromTime = (hour: number, minute: number) => {
    const targetDate = new Date(createForm.form.from);
    targetDate.setHours(hour, minute);
    createFormActions.setForm({ from: targetDate });
  };

  const setUntilTime = (hour: number, minute: number) => {
    const targetDate = new Date(createForm.form.until);
    targetDate.setHours(hour, minute);
    createFormActions.setForm({ until: targetDate });
  };

  const startDisabledFilterCallback = (date: Date) => {
    if (date > createForm.form.until) return true;
    return false;
  };

  const endDisabledFilterCallback = (date: Date) => {
    if (date < createForm.form.from) return true;
    return false;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSchedule();
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
            value={createForm.form.title}
            onChange={(e) => createFormActions.setForm({ title: e.target.value })}
          />
        </LayerItem>
        <LayerItem>
          <input
            className="hidden peer/event"
            type="radio"
            id="event"
            value="event"
            checked={createForm.form.type === 'event'}
            onChange={() => createFormActions.setForm({ type: 'event' })}
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
            checked={createForm.form.type === 'todo'}
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
          {createForm.form.type === 'event' && calendarUnit === 'M' ? (
            <div className="self-center text-sm" role="presentation" aria-label="create form selected date">
              <span className="relative" aria-label="event start date">
                <CalendarInput
                  label="start date"
                  date={createForm.form.from}
                  setDate={setEventStartDate}
                  disabledFilterCallback={startDisabledFilterCallback}
                />
              </span>
              <span className="px-2">-</span>
              <span className="relative" aria-label="event end date">
                <CalendarInput
                  label="end date"
                  date={createForm.form.until}
                  setDate={setEventEndDate}
                  disabledFilterCallback={endDisabledFilterCallback}
                />
              </span>
            </div>
          ) : null}
          {createForm.form.type === 'event' && calendarUnit === 'D' ? (
            <div className="self-center text-sm">
              <div role="presentation" aria-label="create form selected date">
                <span className="relative">
                  <CalendarInput label="start date" date={createForm.form.from} setDate={setTodoDate} />
                </span>
                {!createForm.form.allDay ? (
                  <>
                    <span className="ml-3 relative">
                      <TimeInput date={createForm.form.from} setTime={setFromTime} label="start time" />
                    </span>
                    <span className="px-2">-</span>
                    <span className="relative">
                      <TimeInput date={createForm.form.until} setTime={setUntilTime} label="end time" />
                    </span>
                  </>
                ) : null}
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="allday"
                  className="w-4 h-4 mr-2"
                  checked={createForm.form.allDay}
                  onChange={() => createFormActions.toggleAllDay()}
                />
                <label htmlFor="allday">종일</label>
              </div>
            </div>
          ) : null}
          {createForm.form.type === 'todo' ? (
            <div className="self-center text-sm">
              <div role="presentation" aria-label="create form selected date">
                <span className="relative" aria-label="todo start date">
                  <CalendarInput label="start date" date={createForm.form.from} setDate={setTodoDate} />
                </span>
                {!createForm.form.allDay ? (
                  <span className="ml-3 relative">
                    <TimeInput date={createForm.form.from} setTime={setFromTime} label="todo time" />
                  </span>
                ) : null}
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="allday"
                  className="w-4 h-4 mr-2"
                  checked={createForm.form.allDay}
                  onChange={() => createFormActions.toggleAllDay()}
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
            value={createForm.form.description || ''}
            placeholder="설명 추가"
            className="w-full p-2 text-sm outline-none bg-gray-100 text-gray-700 rounded-sm resize-none"
            onChange={(e) => {
              if (!textareaRef.current) return;
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              setDescription(e.target.value);
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
