import React, { useState, useMemo } from "react";
import TaskCard from "./TaskCard";
import "../styles/TaskBoard.css";

export default function TaskBoard({ tasks = [], handlers }) {
  const {
    onStatusChange,
    onPriorityChange,
    onDueChange,
    onAttachmentDelete,
    onAddComment,
  } = handlers || {};

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  // Filter & sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search
    if (search.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.assignee?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status.toLowerCase() === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority.toLowerCase() === priorityFilter);
    }

    // Sort
    if (sortBy === "dueDate") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.due) - new Date(b.due)
      );
    } else if (sortBy === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      filtered = [...filtered].sort(
        (a, b) => order[a.priority.toLowerCase()] - order[b.priority.toLowerCase()]
      );
    }

    return filtered;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  return (
    <section className="taskboard-container">
      {/* Controls */}
      <div className="taskboard-controls premium-controls">
        <input
          type="text"
          placeholder="Search tasks or assignees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="none">No Sort</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* Task grid */}
      {filteredTasks.length === 0 ? (
        <div className="taskboard-empty">
          <p>No tasks found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="taskboard-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handlers={{
                onStatusChange,
                onPriorityChange,
                onDueChange,
                onAttachmentDelete,
                onAddComment,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
