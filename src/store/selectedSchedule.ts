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

type SelectedScheduleState = {
  selectedSchedule: {
    info: Schedule;
    position: ModalPosition;
    style: ModalStyle;
  };
};

type SelectedScheduleAction = {
  actions: {
    setInfo: (schedule: Schedule) => void;
    setPosition: (position: Partial<ModalPosition>) => void;
    setStyle: (style: Partial<ModalStyle>) => void;
  };
};

const useSelectedScheduleStore = create<SelectedScheduleState & SelectedScheduleAction>()(
  immer((set) => ({
    selectedSchedule: {
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
      setInfo: (info) =>
        set((state) => {
          state.selectedSchedule.info = { ...state.selectedSchedule.info, ...info };
        }),
      setPosition: (position) =>
        set((state) => {
          state.selectedSchedule.position = { ...state.selectedSchedule.position, ...position };
        }),
      setStyle: (style) =>
        set((state) => {
          state.selectedSchedule.style = { ...state.selectedSchedule.style, ...style };
        }),
    },
  })),
);

export { useSelectedScheduleStore };
