import { create } from 'zustand';
import { CalendarUnitEngType } from '@/types/calendar';

type CalendarState = {
  calendarUnit: CalendarUnitEngType;
  selectedDate: Date;
  isSidebarOpen: boolean;
};

type CalendarAction = {
  actions: {
    setCalendarUnit: (unit: CalendarState['calendarUnit']) => void;
    setSelectedDate: (date: CalendarState['selectedDate']) => void;
    toggleSidebar: () => void;
    setNextMonthFirstDay: () => void;
    setPreviousMonthFirstDay: () => void;
    setNextWeek: () => void;
    setPreviousWeek: () => void;
    setNextDay: () => void;
    setPreviousDay: () => void;
  };
};

const useMainCalendarStore = create<CalendarState & CalendarAction>((set) => ({
  calendarUnit: 'D',
  selectedDate: new Date(),
  isSidebarOpen: true,
  actions: {
    setCalendarUnit: (unit) => set(() => ({ calendarUnit: unit })),
    setSelectedDate: (date) => set(() => ({ selectedDate: date })),
    toggleSidebar: () => set(({ isSidebarOpen }) => ({ isSidebarOpen: !isSidebarOpen })),
    setNextMonthFirstDay: () =>
      set(({ selectedDate }) => {
        const targetDate = new Date(selectedDate);
        targetDate.setMonth(targetDate.getMonth() + 1);
        targetDate.setDate(1);

        return { selectedDate: targetDate };
      }),
    setPreviousMonthFirstDay: () =>
      set(({ selectedDate }) => {
        const targetDate = new Date(selectedDate);
        targetDate.setMonth(targetDate.getMonth() - 1);
        targetDate.setDate(1);
        return { selectedDate: targetDate };
      }),
    setNextWeek: () =>
      set(({ selectedDate }) => {
        const targetDate = new Date(selectedDate);
        targetDate.setDate(targetDate.getDate() + 7);
        return { selectedDate: targetDate };
      }),
    setPreviousWeek: () =>
      set(({ selectedDate }) => {
        const targetDate = new Date(selectedDate);
        targetDate.setDate(targetDate.getDate() - 7);
        return { selectedDate: targetDate };
      }),
    setNextDay: () =>
      set(({ selectedDate }) => {
        const targetDate = new Date(selectedDate);
        targetDate.setDate(targetDate.getDate() + 1);
        return { selectedDate: targetDate };
      }),
    setPreviousDay: () =>
      set(({ selectedDate }) => {
        const targetDate = new Date(selectedDate);
        targetDate.setDate(targetDate.getDate() - 1);
        return { selectedDate: targetDate };
      }),
  },
}));

export { useMainCalendarStore };
