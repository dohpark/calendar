import { useEffect, useRef } from 'react';
import useModal from '@/hooks/useModal';
import SelectedSchedule from '@/components/SelectedSchedule';
import { useSelectedScheduleStore } from '@/store/selectedSchedule';

/**
 * selectedScheduleModal의 상태 관리 훅
 */
export default function useSelectedScheduleModal() {
  const {
    selectedSchedule: { position, style },
    actions,
  } = useSelectedScheduleStore();

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const selectedScheduleModalRef = useRef<HTMLDivElement>(null);

  const {
    ModalPortal: SelectedSchedulePortal,
    openModal: openSelectedScheduleModal,
    closeModal: closeSelectedScheduleModal,
    modalOpen: selectedScheduleModalOpen,
  } = useModal({ reset: () => actions.setStyle({ opacity: 0 }) });

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

    actions.setStyle({ left, top, opacity: 100 });
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
