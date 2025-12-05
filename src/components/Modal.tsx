import type { ReactNode } from 'react';

type Props = {
  title: string;
  message: ReactNode;
  note?: string;
  onClose: () => void;
  open: boolean;
};

const Modal = ({ title, message, note, onClose, open }: Props) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>
        <p className="modal-message">{message}</p>
        {note && <p className="modal-note">“{note}”</p>}
        <button type="button" className="primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
