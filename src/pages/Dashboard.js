import React, { useState, useEffect, useMemo } from "react";
import TaskBoard from "../components/TaskBoard";
import TaskStatusChart from "../components/TaskStatusChart";
import TaskForm from "../components/TaskForm";
import { useNotification } from "../context/NotificationContext";
import "./Dashboard.css";

const initialTasks = [
  {
    id: 1,
    title: "Finalize Corporate Website Design",
    description: "Complete UI/UX design with mobile responsiveness",
    priority: "High",
    assignee: { name: "John Doe", email: "john@example.com" },
    due: "2025-09-01",
    status: "To Do",
    comments: [
      { id: 1, author: "Anna", text: "Focus on accessibility." },
      { id: 2, author: "John Doe", text: "Working on the wireframes." },
    ],
    attachments: [{ name: "design-mockup.png", url: "#" }],
    createdAt: "2025-07-20",
  },
  {
    id: 2,
    title: "Setup Authentication API",
    description: "Implement JWT based login and signup API",
    priority: "Medium",
    assignee: { name: "Michael Smith", email: "michael@example.com" },
    due: "2025-08-25",
    status: "In Progress",
    comments: [{ id: 3, author: "Anna", text: "Check token refresh flow." }],
    attachments: [],
    createdAt: "2025-07-22",
  },
];

// Debounce hook for search input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { addNotification } = useNotification();

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Add new task
  const addTask = (task) => {
    setTasks((prev) => [task, ...prev]);
    addNotification({ message: `New task "${task.title}" added!`, type: "success" });
  };

  // Update task status
  const updateTaskStatus = (id, newStatus) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    addNotification({
      message: `Task "${task.title}" status changed to "${newStatus}"`,
      type: "info",
    });
  };

  // Filtered tasks based on search and status
  const filteredTasks = useMemo(() => {
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(lowerSearch) ||
        task.assignee.name.toLowerCase().includes(lowerSearch) ||
        task.assignee.email.toLowerCase().includes(lowerSearch);

      const matchesStatus = filterStatus === "All" || task.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, debouncedSearchTerm, filterStatus]);

  // Unique assignees for dropdowns
  const possibleAssignees = useMemo(() => {
    return tasks
      .map((t) => t.assignee)
      .filter(
        (v, i, a) =>
          a.findIndex((t) => t.email === v.email && t.name === v.name) === i
      );
  }, [tasks]);

  return (
    <div className="dashboard-shell">
      <main className="main-area" aria-label="Dashboard main content">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Corporate Task Manager</h1>
          <p className="dashboard-subtitle">
            Manage your tasks efficiently and keep track of progress with ease.
          </p>
        </header>

        {/* Search & Filter */}
        <section className="task-controls" aria-label="Task search and filter">
          <div className="search-wrapper">
            <input
              className="search-input"
              type="search"
              placeholder="Search tasks or assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search tasks or assignees"
              autoComplete="off"
            />
            <span className="search-icon" aria-hidden="true">🔍</span>
          </div>

          <select
            className="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter tasks by status"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </section>

        {/* Task Form */}
        <section className="task-form-section" aria-label="Add new task form section" tabIndex={-1}>
          <TaskForm onAdd={addTask} possibleAssignees={possibleAssignees} />
        </section>

        {/* Task Board */}
        <section className="taskboard-section" aria-label="Task board section showing filtered tasks">
          {filteredTasks.length === 0 ? (
            <div className="empty-state" role="alert" aria-live="polite">
              No tasks found. Try adjusting your search or filter.
            </div>
          ) : (
            <TaskBoard tasks={filteredTasks} handlers={{ onStatusChange: updateTaskStatus }} />
          )}
        </section>

        {/* Status Chart */}
        <section className="chart-section" aria-label="Task status overview chart" role="region">
          <TaskStatusChart tasks={tasks} />
        </section>
      </main>
    </div>
  );
}
