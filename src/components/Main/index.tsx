'use client';

import MonthCalendar from '@/components/MonthCalendar';
import DayCalendar from '@/components/DayCalendar';
import { useMainCalendarStore } from '@/store/mainCalendar';
import useCreateFormModal from '@/components/CreateForm/hooks/useCreateFormModal';
import useSelectedScheduleModal from '@/components/SelectedSchedule/hooks/useSelectedScheduleModal';

export default function Main() {
  const { calendarUnit } = useMainCalendarStore();
  const { CreateFormModal, openCreateFormModal, createFormModalOpen } = useCreateFormModal();
  const { SelectedScheduleModal, openSelectedScheduleModal } = useSelectedScheduleModal();
  return (
    <>
      <main className="grid grid-rows-auto-start h-main">
        {calendarUnit === 'M' ? (
          <MonthCalendar
            openCreateFormModal={openCreateFormModal}
            createFormModalOpen={createFormModalOpen}
            openSelectedScheduleModal={openSelectedScheduleModal}
          />
        ) : null}
        {calendarUnit === 'D' ? (
          <DayCalendar
            openCreateFormModal={openCreateFormModal}
            createFormModalOpen={createFormModalOpen}
            openSelectedScheduleModal={openSelectedScheduleModal}
          />
        ) : null}
      </main>
      {CreateFormModal}
      {SelectedScheduleModal}
    </>
  );
}
