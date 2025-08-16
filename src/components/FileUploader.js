import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "../styles/FileUploader.css";

export default function FileUploader({ onFilesSelected }) {
  const [files, setFiles] = useState([]);
  const [deleteFileIndex, setDeleteFileIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const uniqueNewFiles = newFiles.filter(
      (newFile) =>
        !files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size
        )
    );
    const updatedFiles = [...files, ...uniqueNewFiles];
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const requestDeleteFile = (index) => {
    setDeleteFileIndex(index);
    setModalOpen(true);
  };

  const confirmDeleteFile = () => {
    if (deleteFileIndex !== null) {
      const updatedFiles = files.filter((_, idx) => idx !== deleteFileIndex);
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
      setDeleteFileIndex(null);
      setModalOpen(false);
    }
  };

  const cancelDeleteFile = () => {
    setDeleteFileIndex(null);
    setModalOpen(false);
  };

  // 🔹 Drag & Drop handlers
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    [files]
  );

  return (
    <>
      <div
        className={`file-dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <label htmlFor="file-upload" className="file-uploader-label">
          <Upload size={28} className="upload-icon" />
          <span className="upload-text">
            {files.length === 0
              ? "Drag & Drop or Click to Attach Files"
              : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
          </span>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {files.length > 0 && (
        <ul className="file-list" role="list" aria-label="Attached files">
          <AnimatePresence>
            {files.map((file, idx) => (
              <motion.li
                key={file.name + idx}
                className="file-list-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FileText size={18} className="file-icon" />
                <span className="file-name" title={file.name}>
                  {file.name}
                </span>
                <button
                  type="button"
                  className="delete-btn"
                  aria-label={`Delete file ${file.name}`}
                  onClick={() => requestDeleteFile(idx)}
                >
                  <X size={18} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <DeleteConfirmModal
        isOpen={modalOpen}
        fileName={deleteFileIndex !== null ? files[deleteFileIndex]?.name : ""}
        onConfirm={confirmDeleteFile}
        onCancel={cancelDeleteFile}
      />
    </>
  );
}
