import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DragState {
  start: Date;
  end: Date;
}

interface DateBoxSize {
  width: number;
  height: number;
}

type CalendarState = {
  calendar: {
    mouseDown: boolean;
    dragDate: DragState;
    dateBoxSize: DateBoxSize;
  };
};

type CalendarAction = {
  actions: {
    setMouseDown: (mouseDown: boolean) => void;
    setDragDate: (dragDate: Partial<DragState>) => void;
    setDateBoxSize: (dateBoxSize: Partial<DateBoxSize>) => void;
  };
};

const useMonthCalendarStore = create<CalendarState & CalendarAction>()(
  immer((set) => ({
    calendar: {
      mouseDown: false,
      dragDate: {
        start: new Date(),
        end: new Date(),
      },
      dateBoxSize: {
        width: 0,
        height: 0,
      },
    },
    actions: {
      setMouseDown: (mouseDown) =>
        set((state) => {
          state.calendar.mouseDown = mouseDown;
        }),
      setDragDate: (dragDate) =>
        set((state) => {
          state.calendar.dragDate = { ...state.calendar.dragDate, ...dragDate };
        }),
      setDateBoxSize: (dateBoxSize) =>
        set((state) => {
          state.calendar.dateBoxSize = { ...state.calendar.dateBoxSize, ...dateBoxSize };
        }),
    },
  })),
);

export { useMonthCalendarStore };
