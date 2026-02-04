/**
 * WorkersPage.jsx
 *
 * Worker management page for viewing and managing all construction workers in the system.
 * Displays worker profiles with their roles (electrician, plumber, etc.), current status
 * (active/on leave), and assigned task counts. Managers can add new workers, view worker
 * details, and assign tasks from this page.
 */

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function WorkersPage() {
  // Placeholder data for workers
  const workers = [
    {
      id: 1,
      name: "John Doe",
      role: "Electrician",
      status: "Active",
      tasks: 5,
    },
    { id: 2, name: "Jane Smith", role: "Plumber", status: "Active", tasks: 3 },
    {
      id: 3,
      name: "Bob Wilson",
      role: "HVAC Technician",
      status: "On Leave",
      tasks: 0,
    },
    {
      id: 4,
      name: "Alice Johnson",
      role: "Carpenter",
      status: "Active",
      tasks: 7,
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="manager" />
      <div className="dashboard-content">
        <Header title="Workers Management" role="manager" />

        <div className="dashboard-main">
          <div className="section">
            <div className="section-header">
              <h2>All Workers</h2>
              <button className="btn-primary">+ Add Worker</button>
            </div>

            <div className="workers-grid">
              {workers.map((worker) => (
                <div key={worker.id} className="worker-card">
                  <div className="worker-header">
                    <div className="worker-avatar">{worker.name[0]}</div>
                    <div className="worker-info">
                      <h3>{worker.name}</h3>
                      <p>{worker.role}</p>
                    </div>
                  </div>
                  <div className="worker-stats">
                    <div className="stat">
                      <span className="stat-label">Status</span>
                      <span
                        className={`status-badge ${worker.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {worker.status}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Active Tasks</span>
                      <span className="stat-value">{worker.tasks}</span>
                    </div>
                  </div>
                  <div className="worker-actions">
                    <button className="btn-secondary">View Details</button>
                    <button className="btn-secondary">Assign Task</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkersPage;
