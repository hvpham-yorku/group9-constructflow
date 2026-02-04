/**
 * TaskList.jsx
 *
 * Component for displaying a list of tasks assigned to workers. Each task item shows the
 * section name, current status, due date, and a view button. Used primarily on the Worker
 * Dashboard to show assigned work items.
 */

import "../styles/TaskList.css";

function TaskList({ tasks }) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="task-info">
            <h4>{task.section}</h4>
            <span className="task-due-date">Due: {task.dueDate}</span>
          </div>
          <span
            className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}
          >
            {task.status}
          </span>
          <button className="btn-secondary">View</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
