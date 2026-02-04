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
