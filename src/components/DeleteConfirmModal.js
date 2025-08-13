import React, { useEffect } from 'react';
import '../styles/DeleteConfirmModal.css';

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel, fileName }) {
  // ESC key দিয়ে modal বন্ধ করার জন্য
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onCancel}
    >
      <div
        className="modal-container"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
        aria-describedby="modal-description"
      >
        <h3 id="modal-title" className="modal-title">Confirm Delete</h3>
        <p id="modal-description" className="modal-text">
          Are you sure you want to delete <strong className="file-name">{fileName}</strong>?
          <br />
          <small className="warning-text">This action cannot be undone.</small>
        </p>
        <div className="modal-buttons">
          <button
            className="btn btn-cancel"
            onClick={onCancel}
            autoFocus
            aria-label="Cancel delete"
          >
            Cancel
          </button>
          <button
            className="btn btn-delete"
            onClick={onConfirm}
            aria-label={`Delete ${fileName}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
