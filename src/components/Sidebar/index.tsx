'use client';

import Layer from '@/components/layouts/Layer';
import { useCalendar } from '@/store/calendar';
import MiniCalendar from '@/components//MiniCalendar';

export default function Sidebar() {
  const { isSidebarOpen } = useCalendar();
  return (
    <aside className={`ease-in duration-200 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-0 ml-[-256px]'}`}>
      <Layer classExtend={['w-[256px]', 'pl-4', 'pr-6']} gap="0">
        <MiniCalendar classExtend={['mt-20']} />
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Layer>
    </aside>
  );
}