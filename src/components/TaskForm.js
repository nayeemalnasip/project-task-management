import React, { useState, useEffect, useRef } from "react";
import FileUploader from "./FileUploader";
import "../styles/TaskForm.css";

export default function TaskForm({ onAdd, possibleAssignees = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assigneeInput, setAssigneeInput] = useState("");
  const [assigneeList, setAssigneeList] = useState(possibleAssignees);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [due, setDue] = useState("");
  const [attachments, setAttachments] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = assigneeList.filter(
    (a) =>
      a.name.toLowerCase().includes(assigneeInput.toLowerCase()) ||
      a.email.toLowerCase().includes(assigneeInput.toLowerCase())
  );

  const handleSelectAssignee = (assignee) => {
    setSelectedAssignee(assignee);
    setAssigneeInput(`${assignee.name} <${assignee.email}>`);
    setShowSuggestions(false);
  };

  const handleAddNewAssignee = () => {
    const input = assigneeInput.trim();
    if (!input) return alert("Please type a name or email");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let name = input;
    let email = "";

    if (emailRegex.test(input)) {
      email = input;
      name = input.split("@")[0];
    } else if (input.includes("@")) {
      return alert("Please enter a valid email address");
    } else {
      email = name.toLowerCase().replace(/\s+/g, "") + "@example.com";
    }

    const exists = assigneeList.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      alert("This assignee already exists.");
      setSelectedAssignee(exists);
      setAssigneeInput(`${exists.name} <${exists.email}>`);
      setShowSuggestions(false);
      return;
    }

    const newAssignee = { name, email };
    setAssigneeList((prev) => [...prev, newAssignee]);
    setSelectedAssignee(newAssignee);
    setAssigneeInput(`${newAssignee.name} <${newAssignee.email}>`);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please fill in the Task Title.");
    if (!selectedAssignee) return alert("Please select or add an Assignee.");

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee: selectedAssignee,
      due,
      status: "To Do",
      comments: [],
      attachments,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onAdd(newTask);

    // Reset form fields
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setAssigneeInput("");
    setSelectedAssignee(null);
    setDue("");
    setAttachments([]);
  };

  const handleFilesSelected = (files) => {
    setAttachments(files);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
      <h2 className="form-title">Add New Task</h2>

      <label htmlFor="title" className="form-label">
        Task Title <span aria-hidden="true" className="required-star">*</span>
      </label>
      <input
        id="title"
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        aria-required="true"
      />

      <label htmlFor="description" className="form-label">
        Description
      </label>
      <textarea
        id="description"
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <label htmlFor="priority" className="form-label">
        Priority
      </label>
      <select
        id="priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={`priority-select priority-${priority.toLowerCase()}`}
      >
        <option value="High">High Priority 🔥</option>
        <option value="Medium">Medium Priority ⚡</option>
        <option value="Low">Low Priority 🌿</option>
      </select>

      <label htmlFor="assignee" className="form-label">
        Assignee <span aria-hidden="true" className="required-star">*</span>
      </label>
      <div className="assignee-wrapper" ref={suggestionsRef}>
        <input
          id="assignee"
          type="text"
          placeholder="Type or select assignee (name or email)"
          value={assigneeInput}
          onChange={(e) => {
            setAssigneeInput(e.target.value);
            setSelectedAssignee(null);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls="assignee-listbox"
          aria-haspopup="listbox"
          role="combobox"
          required
          aria-required="true"
          autoComplete="off"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul
            id="assignee-listbox"
            role="listbox"
            className="assignee-suggestions"
            aria-label="Assignee suggestions"
          >
            {filteredSuggestions.map((a) => (
              <li
                key={a.email}
                role="option"
                tabIndex={0}
                onClick={() => handleSelectAssignee(a)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectAssignee(a);
                  }
                }}
                className="assignee-suggestion-item"
                aria-selected={selectedAssignee?.email === a.email}
              >
                {a.name} &lt;{a.email}&gt;
              </li>
            ))}
          </ul>
        )}

        {showSuggestions && filteredSuggestions.length === 0 && (
          <div
            className="add-assignee-option"
            role="button"
            tabIndex={0}
            onClick={handleAddNewAssignee}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAddNewAssignee();
              }
            }}
            aria-label={`Add new assignee ${assigneeInput}`}
          >
            ➕ Add "<strong>{assigneeInput}</strong>"
          </div>
        )}
      </div>

      <label htmlFor="due" className="form-label">
        Due Date
      </label>
      <input
        id="due"
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
        aria-describedby="dueHelp"
      />
      <small id="dueHelp" className="input-helper-text">
        Optional. Select a due date for the task.
      </small>

      <div className="file-uploader-wrapper">
        <FileUploader onFilesSelected={handleFilesSelected} />
      </div>

      <button
        type="submit"
        className="submit-btn"
        aria-label="Submit new task form"
        disabled={!title.trim() || !selectedAssignee}
      >
        Add Task
      </button>
    </form>
  );
}
