import { useState, useRef, useEffect, useCallback } from "react";
import { MdArchitecture } from "react-icons/md";
import "../styles/BlueprintCanvas.css";

/**
 * BlueprintCanvas
 *
 * Renders a blueprint image with a perfectly-aligned SVG overlay.
 * The SVG coordinate space is locked to the natural pixel dimensions of the image,
 * so paths are always positioned correctly regardless of zoom, window size, or
 * whether the image is loading/loaded.
 *
 * Key technique:
 *   - We wait for the <img> to load and read its naturalWidth/naturalHeight.
 *   - We set the SVG viewBox to "0 0 naturalWidth naturalHeight".
 *   - The SVG is absolutely positioned to cover exactly the rendered image rect
 *     (which may be smaller than the container due to object-fit: contain).
 *   - A ResizeObserver watches the container so the overlay stays in sync on resize.
 */
function BlueprintCanvas({
  imageUrl,
  objects = [],
  activeObjectId,
  onPathUpdate,
  onFinishDrawing,
  onObjectSelected,
  selectedObjectId,
}) {
  const [currentPoints, setCurrentPoints] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [mousePos, setMousePos] = useState(null);

  // SVG overlay geometry — updated whenever the image renders or container resizes
  const [imgRect, setImgRect] = useState(null); // { left, top, width, height }
  const [naturalSize, setNaturalSize] = useState(null); // { w, h }

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const svgRef = useRef(null);

  // ── Measure the rendered image rect inside the container ──────────────────
  const measureImage = useCallback(() => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container || !img.naturalWidth) return;

    const containerRect = container.getBoundingClientRect();
    const imgRenderedRect = img.getBoundingClientRect();

    setImgRect({
      left: imgRenderedRect.left - containerRect.left,
      top: imgRenderedRect.top - containerRect.top,
      width: imgRenderedRect.width,
      height: imgRenderedRect.height,
    });
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  }, []);

  // Re-measure on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(measureImage);
    ro.observe(container);
    return () => ro.disconnect();
  }, [measureImage, imageUrl]);

  // Re-measure when imageUrl changes (new image loaded)
  useEffect(() => {
    setImgRect(null);
    setNaturalSize(null);
  }, [imageUrl]);

  // ── Reset drawing state when active element changes ───────────────────────
  useEffect(() => {
    setCurrentPoints([]);
    setRedoStack([]);
    setMousePos(null);
  }, [activeObjectId]);

  // Notify parent of live path changes
  useEffect(() => {
    if (activeObjectId && onPathUpdate) {
      onPathUpdate(activeObjectId, currentPoints);
    }
  }, [currentPoints, activeObjectId]);

  // ── Keyboard undo / redo ──────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (!activeObjectId) return;
    if (e.ctrlKey && e.shiftKey && e.key === "Z") {
      e.preventDefault();
      setRedoStack((prev) => {
        if (prev.length === 0) return prev;
        const point = prev[prev.length - 1];
        setCurrentPoints((pts) => [...pts, point]);
        return prev.slice(0, -1);
      });
    } else if (e.ctrlKey && (e.key === "z" || e.key === "Z") && !e.shiftKey) {
      e.preventDefault();
      setCurrentPoints((prev) => {
        if (prev.length === 0) return prev;
        const removed = prev[prev.length - 1];
        setRedoStack((r) => [...r, removed]);
        return prev.slice(0, -1);
      });
    }
  }, [activeObjectId]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Convert client coords → SVG (natural image) coords ───────────────────
  const clientToSvg = useCallback((clientX, clientY) => {
    if (!imgRect || !naturalSize) return { x: 0, y: 0 };
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const containerRect = container.getBoundingClientRect();

    // Position relative to the rendered image
    const relX = clientX - containerRect.left - imgRect.left;
    const relY = clientY - containerRect.top - imgRect.top;

    // Scale to natural image pixels
    const x = (relX / imgRect.width) * naturalSize.w;
    const y = (relY / imgRect.height) * naturalSize.h;
    return { x, y };
  }, [imgRect, naturalSize]);

  // ── SVG event handlers ────────────────────────────────────────────────────
  const handleSvgMouseMove = (e) => {
    if (!activeObjectId) return;
    setMousePos(clientToSvg(e.clientX, e.clientY));
  };

  const handleSvgClick = (e) => {
    if (!activeObjectId) return;
    const pos = clientToSvg(e.clientX, e.clientY);
    setCurrentPoints((prev) => [...prev, pos]);
    setRedoStack([]);
  };

  const handleSvgDoubleClick = (e) => {
    if (!activeObjectId || currentPoints.length < 2) return;
    e.preventDefault();
    // The double-click fires click twice then dblclick — remove the extra point
    setCurrentPoints((prev) => {
      const trimmed = prev.slice(0, -1);
      if (onPathUpdate) onPathUpdate(activeObjectId, trimmed);
      if (onFinishDrawing) onFinishDrawing(activeObjectId);
      return [];
    });
    setRedoStack([]);
    setMousePos(null);
  };

  // ── Path helpers ──────────────────────────────────────────────────────────
  const pointsToPath = (points) => {
    if (!points || points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");
  };

  const previewPath = () => {
    if (currentPoints.length === 0 || !mousePos) return "";
    const last = currentPoints[currentPoints.length - 1];
    return `M ${last.x.toFixed(2)} ${last.y.toFixed(2)} L ${mousePos.x.toFixed(2)} ${mousePos.y.toFixed(2)}`;
  };

  const activeType = objects.find((o) => o.id === activeObjectId)?.type || "";

  // ── Placeholder ───────────────────────────────────────────────────────────
  if (!imageUrl) {
    return (
      <div className="blueprint-canvas">
        <div className="blueprint-placeholder">
          <div className="placeholder-content">
            <MdArchitecture className="placeholder-icon" />
            <p>No blueprint uploaded</p>
            <p className="placeholder-hint">Upload a blueprint image to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blueprint-canvas active" ref={containerRef}>
      {/* The image — we measure its rendered rect after load */}
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Blueprint"
        className="blueprint-image"
        onLoad={measureImage}
        draggable={false}
      />

      {/* SVG overlay — positioned and sized to match the rendered image exactly */}
      {imgRect && naturalSize && (
        <svg
          ref={svgRef}
          className={`drawing-layer${activeObjectId ? " drawing" : ""}`}
          style={{
            position: "absolute",
            left: imgRect.left,
            top: imgRect.top,
            width: imgRect.width,
            height: imgRect.height,
            pointerEvents: "all",
          }}
          viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}
          preserveAspectRatio="none"
          onClick={handleSvgClick}
          onDoubleClick={handleSvgDoubleClick}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setMousePos(null)}
        >
          {/* Finished objects */}
          {objects.map((obj) => {
            const isSelected = obj.id === selectedObjectId;
            return (
              <path
                key={obj.id}
                d={pointsToPath(obj.pathPoints)}
                className={`blueprint-object ${obj.type}${obj.completed ? " completed" : ""}${isSelected ? " selected" : ""}`}
                strokeWidth={isSelected ? 7 : 5}
                fill="none"
                style={{ cursor: activeObjectId ? "crosshair" : "pointer" }}
                onClick={(e) => {
                  if (activeObjectId) return;
                  e.stopPropagation();
                  onObjectSelected && onObjectSelected(obj);
                }}
              />
            );
          })}

          {/* Live preview while drawing */}
          {activeObjectId && currentPoints.length > 0 && (
            <>
              <path
                d={pointsToPath(currentPoints)}
                className={`blueprint-object preview ${activeType}`}
                strokeWidth="5"
                fill="none"
              />
              {mousePos && (
                <path
                  d={previewPath()}
                  className="rubber-band"
                  strokeWidth="3"
                  fill="none"
                />
              )}
              {currentPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="6" className="path-point" />
              ))}
            </>
          )}
        </svg>
      )}
    </div>
  );
}

export default BlueprintCanvas;
