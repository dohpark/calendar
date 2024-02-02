import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DragDate {
  start: Date;
  end: Date;
}

interface DragState {
  start: number;
  end: number;
}

type CalendarState = {
  calendar: {
    mouseDown: boolean;
    dragDate: DragDate;
    dragIndex: DragState;
  };
};

type CalendarAction = {
  actions: {
    setMouseDown: (mouseDown: boolean) => void;
    setDragDate: (dragDate: Partial<DragDate>) => void;
    setDragIndex: (dragDate: Partial<DragState>) => void;
  };
};

const useDayCalendarStore = create<CalendarState & CalendarAction>()(
  immer((set) => ({
    calendar: {
      mouseDown: false,
      dragDate: {
        start: new Date(),
        end: new Date(),
      },
      dragIndex: {
        start: 0,
        end: 0,
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
      setDragIndex: (dragIndex) =>
        set((state) => {
          state.calendar.dragIndex = { ...state.calendar.dragIndex, ...dragIndex };
        }),
    },
  })),
);

export { useDayCalendarStore };
