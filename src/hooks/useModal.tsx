import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
}

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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

  return { openModal, closeModal, ModalPortal };
};

export default useModal;
