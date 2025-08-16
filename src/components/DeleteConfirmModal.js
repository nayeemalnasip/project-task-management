import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/DeleteConfirmModal.css";

export default function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  fileName,
}) {
  const cancelRef = useRef(null);

  // ESC / ENTER key handle
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  // Focus trap (auto focus cancel button)
  useEffect(() => {
    if (isOpen && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            aria-describedby="modal-description"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h3 id="modal-title" className="modal-title">
              Confirm Delete
            </h3>
            <p id="modal-description" className="modal-text">
              Are you sure you want to delete{" "}
              <strong className="file-name">{fileName}</strong>?
              <br />
              <small className="warning-text">This action cannot be undone.</small>
            </p>
            <div className="modal-buttons">
              <button
                className="btn btn-cancel"
                onClick={onCancel}
                ref={cancelRef}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
