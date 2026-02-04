/**
 * ProjectCard.jsx
 *
 * Reusable card component for displaying individual project information. Shows project name,
 * status badge (In Progress, Pending, Completed), completion percentage with visual progress bar,
 * and action buttons for viewing details and opening blueprints. Used on Dashboard and Projects pages.
 */

import "../styles/ProjectCard.css";

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>{project.name}</h3>
        <span
          className={`status-badge ${project.status.toLowerCase().replace(" ", "-")}`}
        >
          {project.status}
        </span>
      </div>

      <div className="project-card-body">
        <div className="progress-section">
          <div className="progress-info">
            <span>Progress</span>
            <span className="progress-percentage">{project.completion}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${project.completion}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="project-card-footer">
        <button className="btn-secondary">View Details</button>
        <button className="btn-secondary">Open Blueprint</button>
      </div>
    </div>
  );
}

export default ProjectCard;
