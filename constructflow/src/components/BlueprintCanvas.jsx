import "../styles/BlueprintCanvas.css";

function BlueprintCanvas() {
  return (
    <div className="blueprint-canvas">
      <div className="blueprint-placeholder">
        <div className="placeholder-content">
          <span className="placeholder-icon">📐</span>
          <p>No blueprint uploaded</p>
          <p className="placeholder-hint">Upload a blueprint to get started</p>
          <button className="btn-primary">Upload Blueprint</button>
        </div>
      </div>
    </div>
  );
}

export default BlueprintCanvas;
