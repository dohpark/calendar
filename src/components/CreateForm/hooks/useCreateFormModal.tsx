import { useEffect, useMemo, useRef } from 'react';
import useModal from '@/hooks/useModal';
import CreateForm from '@/components/CreateForm';
import { useCreateFormStore } from '@/store/createForm';
import { useMainCalendarStore } from '@/store/mainCalendar';

/**
 * createFormModal 상태관리 훅
 */
export default function useCreateFormModal() {
  const { isSidebarOpen } = useMainCalendarStore();
  const { createForm, actions: createFormActions } = useCreateFormStore();

  const createFormModalRef = useRef<HTMLFormElement>(null);

  // 모달 닫을 시 reset
  const resetDrag = () => {
    createFormActions.setMount(false);
    createFormActions.setStyle({ opacity: 0 });
  };

  const { openModal, ModalPortal, modalOpen, closeModal } = useModal({ reset: resetDrag });

  // 스케줄 생성 모달 생성 위치 계산
  useEffect(() => {
    if (!modalOpen) return;
    if (createForm.mounted) return;
    if (!createFormModalRef.current) return;

    const modalWidth = createFormModalRef.current.offsetWidth;
    const modalHeight = createFormModalRef.current.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let left = createForm.position.left - modalWidth / 2;
    if (isSidebarOpen && left < 256) left = 256 + 24;
    else if (!isSidebarOpen && left < 24) left = 24;
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

  return { CreateFormModal: modal, openCreateFormModal: openModal, createFormModalOpen: modalOpen };
}
