import React, { useEffect, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.querySelector<HTMLElement>('input, button')?.focus();

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const headerId = 'modal-header';

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headerId}
        className="relative bg-white rounded-threads shadow-lg max-w-md w-full mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <h3 id={headerId} className="text-[2rem] font-semibold mb-4">
          {header}
        </h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onConfirm(e);
          }}
        >
          <div className="mb-6">{children}</div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[1.4rem] font-semibold border border-gray-400 rounded-threads hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-[1.4rem] font-semibold text-white bg-black-1000 rounded-threads hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

Modal.displayName = 'Modal';
export default Modal;
