'use client';

import MonthCalendar from '@/components/MonthCalendar';
import DayCalendar from '@/components/DayCalendar';
import { useMainCalendarStore } from '@/store/mainCalendar';

export default function Main() {
  const { calendarUnit } = useMainCalendarStore();
  return (
    <main className="grid grid-rows-auto-start h-main">
      {calendarUnit === 'M' ? <MonthCalendar /> : null}
      {calendarUnit === 'D' ? <DayCalendar /> : null}
    </main>
  );
}
