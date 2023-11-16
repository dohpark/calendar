'use client';

import Layer from '@/components/layouts/Layer';
import { useMainCalendar } from '@/store/mainCalendar';
import MiniCalendar from '@/components//MiniCalendar';

export default function Sidebar() {
  const { isSidebarOpen, selectedDate, actions } = useMainCalendar();
  return (
    <aside className={`ease-in duration-200 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-0 ml-[-256px]'}`}>
      <Layer classExtend={['w-[256px]', 'pl-4', 'pr-6']} gap="0">
        <MiniCalendar selectedDate={selectedDate} selectDate={actions.setSelectedDate} classExtend={['mt-20']} />
      </Layer>
    </aside>
  );
}
