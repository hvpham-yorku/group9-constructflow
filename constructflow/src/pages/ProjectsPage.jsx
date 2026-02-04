/**
 * ProjectsPage.jsx
 *
 * Comprehensive project management page displaying all projects (active, completed, and pending).
 * Managers can view project details, filter by status, create new projects, and access individual
 * project blueprints. Each project card shows completion percentage and current status.
 */

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import "../styles/ProjectsPage.css";

function ProjectsPage() {
  // Placeholder data
  const activeProjects = [
    {
      id: 1,
      name: "Building A - Phase 1",
      status: "In Progress",
      completion: 65,
    },
    {
      id: 2,
      name: "Building B - Electrical",
      status: "Pending",
      completion: 30,
    },
    {
      id: 3,
      name: "Building C - Plumbing",
      status: "In Progress",
      completion: 80,
    },
  ];

  const completedProjects = [
    {
      id: 4,
      name: "Building D - Completed",
      status: "Completed",
      completion: 100,
    },
    {
      id: 5,
      name: "Building E - Completed",
      status: "Completed",
      completion: 100,
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="manager" />
      <div className="dashboard-content">
        <Header title="Projects" role="manager" />

        <div className="projects-page">
          <div className="page-header">
            <h2>All Projects</h2>
            <button className="btn-primary">+ New Project</button>
          </div>

          <div className="projects-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Active</button>
            <button className="filter-btn">Completed</button>
            <button className="filter-btn">Pending</button>
          </div>

          <div className="section">
            <h3>Active Projects</h3>
            <div className="projects-grid">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Completed Projects</h3>
            <div className="projects-grid">
              {completedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
