import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Schedule } from '@/types/schedule';
import { InitialScheduleInfo } from '@/constants/schedule';

interface ModalPosition {
  top: number;
  left: number;
  width: number;
}

interface ModalStyle {
  left: number;
  top: number;
  opacity: number;
}

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
  createFormModal: {
    position: Omit<ModalPosition, 'width'>;
    style: ModalStyle;
    mounted: boolean;
  };
  selectedScheduleModal: {
    info: Schedule;
    position: ModalPosition;
    style: ModalStyle;
  };
};

type CalendarAction = {
  actions: {
    calendar: {
      setMouseDown: (mouseDown: boolean) => void;
      setDragDate: (dragDate: Partial<DragState>) => void;
      setDateBoxSize: (dateBoxSize: Partial<DateBoxSize>) => void;
    };
    createFormModal: {
      setMount: (mounted: boolean) => void;
      setPosition: (position: Partial<ModalPosition>) => void;
      setStyle: (style: Partial<ModalStyle>) => void;
    };
    selectedScheduleModal: {
      setInfo: (schedule: Schedule) => void;
      setPosition: (position: Partial<ModalPosition>) => void;
      setStyle: (style: Partial<ModalStyle>) => void;
    };
  };
};

const useMonthCalendar = create<CalendarState & CalendarAction>()(
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
    createFormModal: {
      position: {
        top: 0,
        left: 0,
      },
      style: {
        left: 0,
        top: 0,
        opacity: 0,
      },
      mounted: false,
    },
    selectedScheduleModal: {
      info: InitialScheduleInfo,
      position: {
        top: 0,
        left: 0,
        width: 0,
      },
      style: {
        left: 0,
        top: 0,
        opacity: 0,
      },
    },
    actions: {
      calendar: {
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
      createFormModal: {
        setMount: (mount) =>
          set((state) => {
            state.createFormModal.mounted = mount;
          }),
        setPosition: (position) =>
          set((state) => {
            state.createFormModal.position = { ...state.createFormModal.position, ...position };
          }),
        setStyle: (style) =>
          set((state) => {
            state.createFormModal.style = { ...state.createFormModal.style, ...style };
          }),
      },
      selectedScheduleModal: {
        setInfo: (info) =>
          set((state) => {
            state.selectedScheduleModal.info = { ...state.selectedScheduleModal.info, ...info };
          }),
        setPosition: (position) =>
          set((state) => {
            state.selectedScheduleModal.position = { ...state.selectedScheduleModal.position, ...position };
          }),
        setStyle: (style) =>
          set((state) => {
            state.selectedScheduleModal.style = { ...state.selectedScheduleModal.style, ...style };
          }),
      },
    },
  })),
);

export { useMonthCalendar };
