'use client';

import Layer from '@/components/layouts/Layer';
import { useCalendar } from '@/store/calendar';

export default function Sidebar() {
  const { isSidebarOpen } = useCalendar();
  return (
    <aside className={`ease-in duration-200 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-0 ml-[-256px]'}`}>
      <Layer classExtend={['w-[256px]']} gap="0">
        <div className="bg-red-200">1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Layer>
    </aside>
  );
}
