import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import "../styles/TaskStatusChart.css";


const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

export default function TaskStatusChart({ tasks }) {
  // Status count calculation
  const statusCount = useMemo(() => {
    const counts = { "To Do": 0, "In Progress": 0, Review: 0, Completed: 0 };
    tasks.forEach((task) => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });
    return counts;
  }, [tasks]);

  // Total tasks
  const totalTasks = Object.values(statusCount).reduce((a, b) => a + b, 0);

  // Average priority (High=3, Medium=2, Low=1)
  const priorityValue = { High: 3, Medium: 2, Low: 1 };
  const averagePriority = useMemo(() => {
    if (tasks.length === 0) return "N/A";
    const sum = tasks.reduce((acc, task) => acc + (priorityValue[task.priority] || 0), 0);
    const avg = sum / tasks.length;
    if (avg >= 2.5) return "High 🔥";
    if (avg >= 1.5) return "Medium ⚡";
    return "Low 🌿";
  }, [tasks]);

  // Upcoming due date
  const upcomingDueDate = useMemo(() => {
    const futureDates = tasks
      .map((t) => t.due)
      .filter(Boolean)
      .filter((date) => new Date(date) >= new Date())
      .sort((a, b) => new Date(a) - new Date(b));
    return futureDates.length > 0 ? futureDates[0] : "None";
  }, [tasks]);

  // Prepare pie chart data, filter empty statuses
  const data = Object.entries(statusCount)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  // State for toggling visibility
  const [hiddenStatuses, setHiddenStatuses] = useState([]);

  const toggleVisibility = (status) => {
    setHiddenStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Filter data for chart based on visibility
  const filteredData = data.filter(({ name }) => !hiddenStatuses.includes(name));

  // Hover highlight state
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  // Custom active slice with bigger radius + label outside the slice
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          fontSize={24}
          fontWeight="700"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={36}
          textAnchor="middle"
          fill="#555"
          fontSize={16}
          fontWeight="600"
        >
          {value} task{value > 1 ? "s" : ""}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#333"
          strokeWidth={2}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
          strokeWidth={2}
        />
        <circle cx={ex} cy={ey} r={5} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          fontSize={16}
          fontWeight="700"
        >
          {(percent * 100).toFixed(1)}%
        </text>
      </g>
    );
  };

  return (
    <div
      className="chart-container"
      role="region"
      aria-label="Detailed Task Status Overview"
    >
      <h3 className="chart-title">Task Status Overview</h3>

      {totalTasks === 0 ? (
        <p className="no-data">No tasks available to display.</p>
      ) : (
        <>
          {/* Info Panel */}
          <div className="info-panel" aria-live="polite">
            <div className="info-card total-tasks" tabIndex="0">
              <h4>Total Tasks</h4>
              <p>{totalTasks}</p>
            </div>

            <div className="info-card avg-priority" tabIndex="0">
              <h4>Average Priority</h4>
              <p>{averagePriority}</p>
            </div>

            <div className="info-card upcoming-due" tabIndex="0">
              <h4>Upcoming Due Date</h4>
              <p>
                {upcomingDueDate === "None"
                  ? "None"
                  : new Date(upcomingDueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="status-cards-container">
            {data.map(({ name, value }, i) => {
              const color = COLORS[i % COLORS.length];
              const percent = ((value / totalTasks) * 100).toFixed(1);
              const isHidden = hiddenStatuses.includes(name);
              return (
                <button
                  key={name}
                  className={`status-card ${isHidden ? "hidden" : ""}`}
                  onClick={() => toggleVisibility(name)}
                  aria-pressed={!isHidden}
                  aria-label={`Toggle ${name} tasks visibility`}
                  style={{ borderColor: color }}
                >
                  <div
                    className="color-indicator"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <div className="status-info">
                    <span className="status-name">{name}</span>
                    <span className="status-count">
                      {value} task{value > 1 ? "s" : ""}
                    </span>
                    <span className="status-percent">{percent}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={filteredData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                fill="#4f46e5"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
                aria-label="Task status distribution pie chart"
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[data.findIndex((d) => d.name === entry.name) % COLORS.length]}
                    cursor="pointer"
                    aria-label={`${entry.name} has ${entry.value} tasks`}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} task${value > 1 ? "s" : ""}`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
                itemStyle={{ color: "#4f46e5", fontWeight: "600" }}
                cursor={{ fill: "rgba(79,70,229,0.1)" }}
                wrapperStyle={{ fontSize: "14px" }}
              />
              <Legend
                verticalAlign="bottom"
                height={56}
                iconType="circle"
                wrapperStyle={{ fontSize: 14, fontWeight: "600", color: "#374151" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
