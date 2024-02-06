import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DragState {
  start: number;
  end: number;
}

type CalendarState = {
  calendar: {
    mouseDown: boolean;
    dragIndex: DragState;
  };
};

type CalendarAction = {
  actions: {
    setMouseDown: (mouseDown: boolean) => void;
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
      setDragIndex: (dragIndex) =>
        set((state) => {
          state.calendar.dragIndex = { ...state.calendar.dragIndex, ...dragIndex };
        }),
    },
  })),
);

export { useDayCalendarStore };
