import React, { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import '../styles/FileUploader.css';

export default function FileUploader({ onFilesSelected }) {
  const [files, setFiles] = useState([]);
  const [deleteFileIndex, setDeleteFileIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Duplicate file filter by name+size
    const uniqueNewFiles = selectedFiles.filter(
      (newFile) =>
        !files.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size
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

  return (
    <>
      <label
        className={`file-uploader-label ${isFocused ? 'focused' : ''}`}
        htmlFor="file-upload"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="upload-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
          focusable="false"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-3-3m3 3l3-3M12 4v8"
          />
        </svg>
        {files.length === 0 ? (
          <span className="upload-text">Attach Files</span>
        ) : (
          <span className="upload-text">
            {files.length} file{files.length > 1 ? 's' : ''} selected
          </span>
        )}
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-describedby="upload-instructions"
        />
      </label>

      <small id="upload-instructions" className="upload-instructions">
        You can attach multiple files. Click the × to remove any file.
      </small>

      {files.length > 0 && (
        <ul className="file-list" role="list" aria-label="Attached files">
          {files.map((file, idx) => (
            <li
              key={file.name + idx}
              className="file-list-item"
              tabIndex={0}
              aria-label={`File: ${file.name}, size: ${(file.size / 1024).toFixed(
                1
              )} KB`}
            >
              <span className="file-name" title={file.name}>
                📎 {file.name}
              </span>
              <button
                type="button"
                className="delete-btn"
                aria-label={`Delete file ${file.name}`}
                onClick={() => requestDeleteFile(idx)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <DeleteConfirmModal
        isOpen={modalOpen}
        fileName={deleteFileIndex !== null ? files[deleteFileIndex]?.name : ''}
        onConfirm={confirmDeleteFile}
        onCancel={cancelDeleteFile}
      />
    </>
  );
}
