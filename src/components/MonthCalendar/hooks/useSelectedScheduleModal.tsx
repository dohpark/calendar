import { useEffect, useRef } from 'react';
import { countWeeksInMonthCalendar } from '@/utils/calendar';
import useModal from '@/hooks/useModal';
import { useMonthCalendar } from '@/store/monthCalendar';
import SelectedSchedule from '@/components/MonthCalendar/modals/SelectedSchedule';

/**
 * selectedScheduleModal의 상태 관리 훅
 */
export default function useSelectedScheduleModal({ selectedDate }: { selectedDate: Date }) {
  const {
    calendar: { dateBoxSize },
    selectedScheduleModal: { position, style },
    actions,
  } = useMonthCalendar();

  const screenWidth = dateBoxSize.width * 7 + 256;
  const screenHeight = dateBoxSize.height * countWeeksInMonthCalendar(selectedDate) + 88;

  const selectedScheduleModalRef = useRef<HTMLDivElement>(null);

  const {
    ModalPortal: SelectedSchedulePortal,
    openModal: openSelectedScheduleModal,
    closeModal: closeSelectedScheduleModal,
    modalOpen: selectedScheduleModalOpen,
  } = useModal({ reset: () => actions.selectedScheduleModal.setStyle({ opacity: 0 }) });

  // 선택한 스케줄 모달 생성 위치 계산
  useEffect(() => {
    if (!selectedScheduleModalOpen) return;
    if (!selectedScheduleModalRef.current) return;

    const modalWidth = selectedScheduleModalRef.current.offsetWidth;
    const modalHeight = selectedScheduleModalRef.current.offsetHeight;

    const itemWidth = position.width;

    let left = position.left + itemWidth + 20;
    let { top } = position;

    if (left + modalWidth > screenWidth) {
      left = position.left - (modalWidth + 20);
    }
    if (left < 0) {
      left = position.left + 24;
      top += 24;
    }

    if (top + modalHeight > screenHeight) top -= modalHeight - 24;

    actions.selectedScheduleModal.setStyle({ left, top, opacity: 100 });
  }, [position, selectedScheduleModalOpen]);

  const modal = (
    <SelectedSchedulePortal>
      <SelectedSchedule ref={selectedScheduleModalRef} style={{ ...style }} close={closeSelectedScheduleModal} />
    </SelectedSchedulePortal>
  );

  return {
    SelectedScheduleModal: modal,
    openSelectedScheduleModal,
  };
}
