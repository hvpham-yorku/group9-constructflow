/**
 * BlueprintViewer.jsx
 *
 * Interactive blueprint planning page. Admins upload a blueprint image, draw SVG paths
 * (pipes / electrical connections) over it, assign each element to a worker, and save
 * everything to Firestore. Workers can view and mark elements complete.
 */

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BlueprintCanvas from "../components/BlueprintCanvas";
import { MdUpload, MdSave, MdExpandMore } from "react-icons/md";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import "../styles/BlueprintViewer.css";

let _nextId = 1;
const makeId = () => `obj-${Date.now()}-${_nextId++}`;

function BlueprintViewer() {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === "admin";

  // ── Blueprint state ──────────────────────────────────────────────────────
  const [blueprintName, setBlueprintName] = useState("");
  const [blueprintImage, setBlueprintImage] = useState(null);
  const [currentBlueprintId, setCurrentBlueprintId] = useState(null);
  const [objects, setObjects] = useState([]);

  // ── Drawing state ────────────────────────────────────────────────────────
  const [activeObjectId, setActiveObjectId] = useState(null);
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  const [workers, setWorkers] = useState({ plumbers: [], electricians: [] });
  const [savedBlueprints, setSavedBlueprints] = useState([]);
  const [showBlueprintDropdown, setShowBlueprintDropdown] = useState(false);

  // ── Fetch workers (all plumbers + electricians) ──────────────────────────
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "users"), where("role", "in", ["plumber", "electrician"]))
        );
        const plumbers = [];
        const electricians = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.role === "plumber") plumbers.push(data);
          else electricians.push(data);
        });
        setWorkers({ plumbers, electricians });
      } catch (err) {
        console.error("Failed to fetch workers:", err);
      }
    };
    fetchWorkers();
  }, []);

  // ── Fetch saved blueprints list ──────────────────────────────────────────
  const fetchBlueprints = async () => {
    try {
      const snap = await getDocs(collection(db, "blueprints"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setSavedBlueprints(list);
    } catch (err) {
      console.error("Failed to fetch blueprints:", err);
    }
  };

  useEffect(() => { fetchBlueprints(); }, []);

  // ── Load a saved blueprint ───────────────────────────────────────────────
  const loadBlueprint = (bp) => {
    setShowBlueprintDropdown(false);
    setActiveObjectId(null);
    setSelectedObjectId(null);
    setBlueprintName(bp.name || "");
    setBlueprintImage(bp.imageUrl || null);
    setCurrentBlueprintId(bp.id);

    // Convert stored objects map → array
    const objs = Object.entries(bp.objects || {}).map(([id, obj]) => ({
      id,
      ...obj,
      drawing: false,
    }));
    setObjects(objs);
  };

  // ── Delete a saved blueprint ─────────────────────────────────────────────
  const deleteBlueprint = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this blueprint?")) return;
    try {
      await deleteDoc(doc(db, "blueprints", id));
      setSavedBlueprints((prev) => prev.filter((b) => b.id !== id));
      if (currentBlueprintId === id) {
        setCurrentBlueprintId(null);
        setBlueprintName("");
        setBlueprintImage(null);
        setObjects([]);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete blueprint.");
    }
  };

  // ── Image upload ─────────────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const storageRef = ref(storage, `blueprints/${file.name}-${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setBlueprintImage(url);
      setCurrentBlueprintId(null); // new blueprint
      setObjects([]);
      if (!blueprintName) setBlueprintName(file.name.replace(/\.[^.]+$/, ""));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    }
    setLoading(false);
  };

  // ── Start drawing a new element ──────────────────────────────────────────
  const startDrawing = (type) => {
    if (!blueprintImage) {
      alert("Please upload a blueprint image first.");
      return;
    }
    if (activeObjectId) cancelActiveDrawing();

    const id = makeId();
    setObjects((prev) => [
      ...prev,
      { id, type, pathPoints: [], assignedTo: null, assignedToName: null, completed: false, drawing: true },
    ]);
    setActiveObjectId(id);
    setSelectedObjectId(id);
  };

  const cancelActiveDrawing = () => {
    setObjects((prev) => {
      const active = prev.find((o) => o.id === activeObjectId);
      if (!active) return prev;
      if (active.pathPoints.length === 0) return prev.filter((o) => o.id !== activeObjectId);
      return prev.map((o) => o.id === activeObjectId ? { ...o, drawing: false } : o);
    });
    setActiveObjectId(null);
  };

  // ── Canvas callbacks ─────────────────────────────────────────────────────
  const handlePathUpdate = (id, points) => {
    setObjects((prev) => prev.map((o) => o.id === id ? { ...o, pathPoints: points } : o));
  };

  const handleFinishDrawing = (id) => {
    setObjects((prev) => prev.map((o) => o.id === id ? { ...o, drawing: false } : o));
    setActiveObjectId(null);
  };

  // ── Delete element ───────────────────────────────────────────────────────
  const deleteObject = (id) => {
    if (id === activeObjectId) setActiveObjectId(null);
    if (id === selectedObjectId) setSelectedObjectId(null);
    setObjects((prev) => prev.filter((o) => o.id !== id));
  };

  // ── Assign worker (admin only) ───────────────────────────────────────────
  const assignWorker = (workerId) => {
    const all = [...workers.plumbers, ...workers.electricians];
    const worker = all.find((w) => w.uid === workerId);
    if (!worker) return;
    setObjects((prev) =>
      prev.map((o) =>
        o.id === selectedObjectId
          ? { ...o, assignedTo: worker.uid, assignedToName: worker.name }
          : o
      )
    );
  };

  // ── Save / update blueprint ──────────────────────────────────────────────
  const saveBlueprint = async () => {
    if (!blueprintImage || !blueprintName.trim()) {
      alert("Please upload an image and provide a name.");
      return;
    }
    setSaving(true);
    try {
      const objectsMap = {};
      objects.forEach((obj) => {
        objectsMap[obj.id] = {
          type: obj.type,
          pathPoints: obj.pathPoints,
          assignedTo: obj.assignedTo || null,
          assignedToName: obj.assignedToName || null,
          completed: obj.completed,
        };
      });

      const data = {
        name: blueprintName.trim(),
        imageUrl: blueprintImage,
        objects: objectsMap,
        updatedAt: new Date(),
      };

      if (currentBlueprintId) {
        await updateDoc(doc(db, "blueprints", currentBlueprintId), data);
      } else {
        const ref = await addDoc(collection(db, "blueprints"), { ...data, createdAt: new Date() });
        setCurrentBlueprintId(ref.id);
      }

      await fetchBlueprints();
      alert("Blueprint saved!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save blueprint.");
    }
    setSaving(false);
  };

  const selectedObject = objects.find((o) => o.id === selectedObjectId) || null;
  const isDrawingPipe = activeObjectId && objects.find((o) => o.id === activeObjectId)?.type === "pipe";
  const isDrawingConnection = activeObjectId && objects.find((o) => o.id === activeObjectId)?.type === "connection";

  return (
    <div className="dashboard">
      <Sidebar role="manager" />
      <div className="dashboard-content">
        <Header title="Blueprint Planner" role="manager" />

        <div className="blueprint-viewer">
          {/* ── Toolbar ── */}
          <div className="blueprint-toolbar">
            <input
              type="text"
              placeholder="Blueprint Name"
              value={blueprintName}
              onChange={(e) => setBlueprintName(e.target.value)}
              className="blueprint-name-input"
            />

            <label className={`btn-secondary${loading ? " disabled" : ""}`}>
              <MdUpload className="icon" /> Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload}
                style={{ display: "none" }} disabled={loading} />
            </label>

            <button
              className={`btn-secondary draw-btn pipe-btn${isDrawingPipe ? " active" : ""}`}
              onClick={() => isDrawingPipe ? cancelActiveDrawing() : startDrawing("pipe")}
              disabled={!blueprintImage}
              title="Click to start drawing a pipe. Double-click to finish."
            >
              <span className="draw-icon pipe-icon" /> {isDrawingPipe ? "Cancel Pipe" : "Draw Pipe"}
            </button>

            <button
              className={`btn-secondary draw-btn connection-btn${isDrawingConnection ? " active" : ""}`}
              onClick={() => isDrawingConnection ? cancelActiveDrawing() : startDrawing("connection")}
              disabled={!blueprintImage}
              title="Click to start drawing a connection. Double-click to finish."
            >
              <span className="draw-icon connection-icon" /> {isDrawingConnection ? "Cancel Connection" : "Draw Connection"}
            </button>

            <button
              className="btn-secondary save-btn"
              onClick={saveBlueprint}
              disabled={saving || !blueprintImage}
            >
              <MdSave className="icon" /> {saving ? "Saving…" : currentBlueprintId ? "Update" : "Save"}
            </button>

            {/* ── Blueprint selector dropdown ── */}
            <div className="blueprint-selector">
              <button
                className="btn-secondary selector-btn"
                onClick={() => setShowBlueprintDropdown((v) => !v)}
              >
                <MdExpandMore className="icon" />
                {savedBlueprints.length > 0 ? "Blueprints" : "No saved blueprints"}
              </button>

              {showBlueprintDropdown && (
                <div className="blueprint-dropdown">
                  <div className="dropdown-header">Saved Blueprints</div>
                  {savedBlueprints.length === 0 && (
                    <div className="dropdown-empty">No blueprints saved yet.</div>
                  )}
                  {savedBlueprints.map((bp) => (
                    <div
                      key={bp.id}
                      className={`dropdown-item${currentBlueprintId === bp.id ? " current" : ""}`}
                      onClick={() => loadBlueprint(bp)}
                    >
                      <span className="dropdown-item-name">{bp.name}</span>
                      <span className="dropdown-item-count">
                        {Object.keys(bp.objects || {}).length} elements
                      </span>
                      {isAdmin && (
                        <button
                          className="dropdown-delete"
                          onClick={(e) => deleteBlueprint(bp.id, e)}
                          title="Delete blueprint"
                        >✕</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeObjectId && (
              <div className="drawing-hint">
                ✏️ Click to add points · Double-click to finish · Ctrl+Z undo · Ctrl+Shift+Z redo
              </div>
            )}
          </div>

          {/* ── Main area ── */}
          <div className="blueprint-main">
            {/* Canvas */}
            <div className="blueprint-canvas-container">
              <BlueprintCanvas
                imageUrl={blueprintImage}
                objects={objects}
                activeObjectId={activeObjectId}
                selectedObjectId={selectedObjectId}
                onPathUpdate={handlePathUpdate}
                onFinishDrawing={handleFinishDrawing}
                onObjectSelected={(obj) => {
                  if (!activeObjectId) setSelectedObjectId(obj.id);
                }}
              />
            </div>

            {/* Right sidebar */}
            <div className="blueprint-sidebar">
              <h3>Elements <span className="element-count">({objects.length})</span></h3>

              <div className="sections-list">
                {objects.length === 0 && (
                  <p className="no-sections">
                    No elements yet.<br />
                    Upload an image then click "Draw Pipe" or "Draw Connection".
                  </p>
                )}

                {objects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`section-card ${obj.type}${selectedObjectId === obj.id ? " active" : ""}${obj.drawing ? " drawing-active" : ""}`}
                    onClick={() => { if (!activeObjectId) setSelectedObjectId(obj.id); }}
                  >
                    <div className="section-header">
                      <div className="section-title">
                        <span className={`type-dot ${obj.type}${obj.completed ? " completed" : ""}`} />
                        <span className="section-type-label">
                          {obj.type === "pipe" ? "Pipe" : "Connection"}
                          {obj.drawing && <span className="drawing-badge"> ✏️</span>}
                        </span>
                      </div>
                      <div className="section-actions-inline">
                        <span className={`section-status${obj.completed ? " completed" : ""}`}>
                          {obj.completed ? "Done" : "Pending"}
                        </span>
                        <button
                          className="btn-icon-sm delete-btn"
                          onClick={(e) => { e.stopPropagation(); deleteObject(obj.id); }}
                          title="Delete"
                        >✕</button>
                      </div>
                    </div>
                    <div className="section-meta">
                      {obj.assignedTo
                        ? <span className="assigned-worker">👷 {obj.assignedToName}</span>
                        : <span className="unassigned">Unassigned</span>
                      }
                      {obj.pathPoints.length > 0 && (
                        <span className="point-count">{obj.pathPoints.length} pts</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Assignment panel — admin only, finished elements only */}
              {selectedObject && !selectedObject.drawing && isAdmin && (
                <div className="assignment-panel">
                  <h4>
                    Assign {selectedObject.type === "pipe" ? "Pipe" : "Connection"}
                    {selectedObject.type === "pipe"
                      ? <span className="worker-type-hint"> (Plumbers)</span>
                      : <span className="worker-type-hint"> (Electricians)</span>
                    }
                  </h4>
                  <select
                    value={selectedObject.assignedTo || ""}
                    onChange={(e) => assignWorker(e.target.value)}
                  >
                    <option value="">— Select Worker —</option>
                    {selectedObject.type === "pipe" &&
                      workers.plumbers.map((w) => (
                        <option key={w.uid} value={w.uid}>{w.name}</option>
                      ))}
                    {selectedObject.type === "connection" &&
                      workers.electricians.map((w) => (
                        <option key={w.uid} value={w.uid}>{w.name}</option>
                      ))}
                  </select>
                  {selectedObject.type === "pipe" && workers.plumbers.length === 0 && (
                    <p className="no-workers-hint">No plumbers found in the system.</p>
                  )}
                  {selectedObject.type === "connection" && workers.electricians.length === 0 && (
                    <p className="no-workers-hint">No electricians found in the system.</p>
                  )}
                </div>
              )}

              {selectedObject && !selectedObject.drawing && !isAdmin && (
                <div className="assignment-panel readonly">
                  <p className="readonly-hint">Only admins can assign workers.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlueprintViewer;
