import React, { useState } from "react";
import "../styles/TaskCard.css";

const priorityColors = {
  High: "#e74c3c",
  Medium: "#f39c12",
  Low: "#27ae60",
};

const statusOptions = ["To Do", "In Progress", "Completed", "Blocked"];

export default function TaskCard({ task, handlers }) {
  const {
    id,
    title,
    description,
    priority,
    assignee,
    due,
    status,
    attachments = [],
    comments = [],
    createdAt,
  } = task;

  const {
    onStatusChange,
    onPriorityChange,
    onDueChange,
    onAttachmentDelete,
    onAddComment,
  } = handlers || {};

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleStatusChange = (e) => onStatusChange && onStatusChange(id, e.target.value);
  const handlePriorityChange = (e) => onPriorityChange && onPriorityChange(id, e.target.value);
  const handleDueChange = (e) => onDueChange && onDueChange(id, e.target.value);
  const handleAttachmentDelete = (filename) => onAttachmentDelete && onAttachmentDelete(id, filename);

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return alert("Comment cannot be empty.");
    onAddComment && onAddComment(id, trimmed);
    setCommentText("");
    setShowCommentBox(false);
  };

  return (
    <article className="task-card" aria-label={`Task: ${title}`} tabIndex={0}>
      <header className="task-card-header">
        <h3 className="task-title">{title}</h3>
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[priority] || "#888" }}
          title={`Priority: ${priority}`}
          aria-label={`Priority level is ${priority}`}
        >
          {priority}
        </span>
      </header>

      <section className="task-description" aria-live="polite">
        {description ? description : <em>No description provided.</em>}
      </section>

      <section className="task-meta">
        <div className="assignee-info" title={`${assignee.name} (${assignee.email})`}>
          <strong>Assignee:</strong>{" "}
          <span aria-label={`Assigned to ${assignee.name} (${assignee.email})`}>
            {assignee.name}
          </span>
        </div>

        <div className="due-date">
          <label htmlFor={`due-${id}`}>Due:</label>
          <input
            type="date"
            id={`due-${id}`}
            value={due || ""}
            onChange={handleDueChange}
            aria-label={`Change due date for task: ${title}`}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="status-select">
          <label htmlFor={`status-${id}`}>Status:</label>
          <select
            id={`status-${id}`}
            value={status}
            onChange={handleStatusChange}
            aria-label={`Change status for task: ${title}`}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="priority-select">
          <label htmlFor={`priority-${id}`}>Priority:</label>
          <select
            id={`priority-${id}`}
            value={priority}
            onChange={handlePriorityChange}
            aria-label={`Change priority for task: ${title}`}
          >
            {Object.keys(priorityColors).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="attachments-section" aria-label="Attachments">
        <strong>Attachments:</strong>
        {attachments.length === 0 && <p className="no-attachments">No attachments.</p>}
        <ul className="attachments-list">
          {attachments.map((file) => (
            <li key={file.name} className="attachment-item">
              <a
                href={file.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment-link"
                title={`Download ${file.name}`}
                download={file.name}
                aria-label={`Download attachment: ${file.name}`}
              >
                📎 {file.name}
              </a>
              <button
                type="button"
                className="attachment-delete-btn"
                aria-label={`Delete attachment ${file.name}`}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete attachment "${file.name}"?`
                    )
                  ) {
                    handleAttachmentDelete(file.name);
                  }
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="comments-section" aria-live="polite">
        <strong>Comments ({comments.length}):</strong>
        <ul className="comments-list" aria-label={`Comments for task: ${title}`}>
          {comments.length === 0 && <li>No comments yet.</li>}
          {comments.map((c, idx) => (
            <li key={idx} className="comment-item">
              {/* এখানে তুমি যদি comment অবজেক্ট হয় তাহলে এরকম করো */}
              {typeof c === "string" ? c : `${c.author}: ${c.text}`}
            </li>
          ))}
        </ul>

        {showCommentBox ? (
          <div className="comment-box">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
              aria-label="Write a comment"
            />
            <div className="comment-buttons">
              <button
                type="button"
                className="btn cancel"
                onClick={() => {
                  setCommentText("");
                  setShowCommentBox(false);
                }}
              >
                Cancel
              </button>
              <button type="button" className="btn submit" onClick={handleAddComment}>
                Add Comment
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn show-comment-btn"
            onClick={() => setShowCommentBox(true)}
            aria-label="Add a comment"
          >
            + Add Comment
          </button>
        )}
      </section>

      <footer className="task-created">
        Created on:{" "}
        {createdAt
          ? new Date(createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-"}
      </footer>
    </article>
  );
}
