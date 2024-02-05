import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DragIndex {
  start: number;
  end: number;
}

interface DateBoxSize {
  width: number;
  height: number;
}

type CalendarState = {
  calendar: {
    mouseDown: boolean;
    dragIndex: DragIndex;
    dateBoxSize: DateBoxSize;
  };
};

type CalendarAction = {
  actions: {
    setMouseDown: (mouseDown: boolean) => void;
    setDragIndex: (dragDate: Partial<DragIndex>) => void;
    setDateBoxSize: (dateBoxSize: Partial<DateBoxSize>) => void;
  };
};

const useMonthCalendarStore = create<CalendarState & CalendarAction>()(
  immer((set) => ({
    calendar: {
      mouseDown: false,
      dragIndex: {
        start: 0,
        end: 0,
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
      setDragIndex: (dragIndex) =>
        set((state) => {
          state.calendar.dragIndex = { ...state.calendar.dragIndex, ...dragIndex };
        }),
      setDateBoxSize: (dateBoxSize) =>
        set((state) => {
          state.calendar.dateBoxSize = { ...state.calendar.dateBoxSize, ...dateBoxSize };
        }),
    },
  })),
);

export { useMonthCalendarStore };
