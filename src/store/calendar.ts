import { create } from 'zustand';
import { CalendarUnitEngType } from '@/types/calendar';

type CalendarState = {
  calendarUnit: CalendarUnitEngType;
  selectedDate: Date;
};

type CalendarAction = {
  actions: {
    setCalendarUnit: (unit: CalendarState['calendarUnit']) => void;
    setSelectedDate: (date: CalendarState['selectedDate']) => void;
    setNextMonthFirstDay: () => void;
    setPreviousMonthFirstDay: () => void;
    setNextWeek: () => void;
    setPreviousWeek: () => void;
    setNextDay: () => void;
    setPreviousDay: () => void;
  };
};

const useCalendar = create<CalendarState & CalendarAction>((set) => ({
  calendarUnit: 'M',
  selectedDate: new Date(),
  actions: {
    setCalendarUnit: (unit) => set(() => ({ calendarUnit: unit })),
    setSelectedDate: (date) => set(() => ({ selectedDate: date })),
    setNextMonthFirstDay: () =>
      set(({ selectedDate }) => {
        selectedDate.setMonth(selectedDate.getMonth() + 1);
        selectedDate.setDate(0);
        const nextMonth = selectedDate;
        return { selectedDate: nextMonth };
      }),
    setPreviousMonthFirstDay: () =>
      set(({ selectedDate }) => {
        selectedDate.setMonth(selectedDate.getMonth() - 1);
        selectedDate.setDate(0);
        const previousMonth = selectedDate;
        return { selectedDate: previousMonth };
      }),
    setNextWeek: () => set(() => ({})),
    setPreviousWeek: () => set(() => ({})),
    setNextDay: () => set(() => ({})),
    setPreviousDay: () => set(() => ({})),
  },
}));

export { useCalendar };
