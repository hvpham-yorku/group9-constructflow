import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BlueprintCanvas from "../components/BlueprintCanvas";
import SectionCard from "../components/SectionCard";
import "../styles/BlueprintViewer.css";

function BlueprintViewer() {
  // Placeholder data for sections
  const sections = [
    {
      id: 1,
      name: "Plumbing - Floor 1",
      status: "completed",
      assignedTo: "John Doe",
    },
    {
      id: 2,
      name: "Electrical - Floor 1",
      status: "in-progress",
      assignedTo: "Jane Smith",
    },
    {
      id: 3,
      name: "HVAC - Floor 1",
      status: "pending",
      assignedTo: "Bob Wilson",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar role="manager" />
      <div className="dashboard-content">
        <Header title="Blueprint Viewer" role="manager" />

        <div className="blueprint-viewer">
          <div className="blueprint-toolbar">
            <button className="btn-secondary">
              <span className="icon">📤</span> Upload New
            </button>
            <button className="btn-secondary">
              <span className="icon">✏️</span> Draw Section
            </button>
            <button className="btn-secondary">
              <span className="icon">💾</span> Save
            </button>
            <button className="btn-secondary">
              <span className="icon">↩️</span> Undo
            </button>
          </div>

          <div className="blueprint-main">
            <div className="blueprint-canvas-container">
              <BlueprintCanvas />
            </div>

            <div className="blueprint-sidebar">
              <h3>Sections</h3>
              <div className="sections-list">
                {sections.map((section) => (
                  <SectionCard key={section.id} section={section} />
                ))}
              </div>
              <button className="btn-primary full-width">
                Add New Section
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlueprintViewer;
