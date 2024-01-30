import { RefObject, useEffect, useMemo, useRef } from 'react';

import useModal from '@/hooks/useModal';
import CreateForm from '@/components/CreateForm';
import { countWeeksInMonthCalendar } from '@/utils/calendar';
import { useMonthCalendarStore } from '@/store/monthCalendar';
import { useCreateFormStore } from '@/store/createForm';

/**
 * createFormModal 상태관리 훅
 */
export default function useCreateFormModal({
  selectedDate,
  dateContainerRef,
}: {
  selectedDate: Date;
  dateContainerRef: RefObject<HTMLDivElement>;
}) {
  const { calendar, actions: monthCalendarActions } = useMonthCalendarStore();
  const { createForm, actions: createFormActions } = useCreateFormStore();

  const createFormModalRef = useRef<HTMLFormElement>(null);

  // 모달 닫을 시 reset
  const resetDrag = () => {
    if (!dateContainerRef.current) return;
    Array.from(dateContainerRef.current.children).forEach((target) => {
      target.classList.remove('bg-blue-50');
    });
    monthCalendarActions.setMouseDown(false);
    createFormActions.setMount(false);
    createFormActions.setStyle({ opacity: 0 });
  };

  const { openModal, ModalPortal, modalOpen, closeModal } = useModal({ reset: resetDrag });

  // 스케줄 생성 모달 생성 위치 계산
  useEffect(() => {
    if (!modalOpen) return;
    if (createForm.mounted) return;
    if (!dateContainerRef.current) return;
    if (!createFormModalRef.current) return;

    const modalWidth = createFormModalRef.current.offsetWidth;
    const modalHeight = createFormModalRef.current.offsetHeight;
    const screenWidth = calendar.dateBoxSize.width * 7 + 256;
    const screenHeight = calendar.dateBoxSize.height * countWeeksInMonthCalendar(selectedDate) + 88;

    let left = createForm.position.left - modalWidth / 2;
    if (left < 256) left = 256 + 24;
    else if (left + modalWidth > screenWidth) left = screenWidth - modalWidth - 24;

    let { top } = createForm.position;
    if (top + modalHeight > screenHeight) top -= modalHeight;

    createFormActions.setStyle({ left, top, opacity: 100 });

    createFormActions.setMount(true);
  }, [modalOpen]);

  /**
   * 상태변화에 따른 모달 컨테이너의 리렌더링 방지
   */
  const modal = useMemo(
    () => (
      <ModalPortal>
        <CreateForm ref={createFormModalRef} style={{ ...createForm.style }} closeModal={closeModal} />
      </ModalPortal>
    ),
    [modalOpen, closeModal, createForm.style],
  );

  return { CreateFormModal: modal, openCreateFormModal: openModal };
}
