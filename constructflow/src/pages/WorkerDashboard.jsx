import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import "../styles/Dashboard.css";

function WorkerDashboard() {
  // Placeholder data for demonstration
  const tasks = [
    {
      id: 1,
      section: "Plumbing - Floor 1",
      status: "In Progress",
      dueDate: "2026-02-10",
    },
    {
      id: 2,
      section: "Electrical - Floor 2",
      status: "Pending",
      dueDate: "2026-02-15",
    },
    {
      id: 3,
      section: "HVAC - Floor 1",
      status: "Pending",
      dueDate: "2026-02-18",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="worker" />
      <div className="dashboard-content">
        <Header title="Worker Dashboard" role="worker" />

        <div className="dashboard-main">
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Assigned Tasks</h3>
              <p className="stat-number">8</p>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <p className="stat-number">3</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-number">15</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p className="stat-number">5</p>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <h2>My Tasks</h2>
              <button className="btn-secondary">Filter</button>
            </div>
            <TaskList tasks={tasks} />
          </div>

          <div className="section">
            <div className="section-header">
              <h2>Current Project</h2>
            </div>
            <div className="current-project-card">
              <h3>Building A - Phase 1</h3>
              <p>Working on plumbing installation for Floor 1</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
              <button className="btn-primary">View Blueprint</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;
