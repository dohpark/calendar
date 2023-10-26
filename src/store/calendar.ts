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
  };
};

const useCalendar = create<CalendarState & CalendarAction>((set) => ({
  calendarUnit: 'M',
  selectedDate: new Date(),
  actions: {
    setCalendarUnit: (unit) => set(() => ({ calendarUnit: unit })),
    setSelectedDate: (date) => set(() => ({ selectedDate: date })),
  },
}));

export { useCalendar };
