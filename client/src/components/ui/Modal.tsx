import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  onConfirm: (e: any) => void;
  confirmText: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  header,
  onConfirm,
  confirmText,
  isLoading,
  children,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-threads shadow-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-[2rem] font-semibold mb-4">{header}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[1.4rem] font-semibold border border-gray-400 rounded-threads hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-[1.4rem] font-semibold text-white bg-black-1000 rounded-threads hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';
export default Modal;
