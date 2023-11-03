import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
}

interface UseModalProps {
  reset?: () => void;
}

const useModal = ({ reset }: UseModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (reset) reset();
  }, []);

  function ModalPortal({ children }: ModalPortalProps) {
    if (modalOpen)
      return createPortal(
        <div className="w-full h-full fixed top-0 left-0 z-10 m-0">
          {children}
          <div className="absolute w-full h-full" onClick={closeModal} role="presentation" />
        </div>,
        document.getElementById('modal-root') as HTMLElement,
      );
    return null;
  }

  return { openModal, closeModal, ModalPortal, modalOpen };
};

export default useModal;
