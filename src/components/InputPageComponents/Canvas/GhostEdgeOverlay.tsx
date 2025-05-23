// components/GhostEdgeOverlay.tsx
import { FC } from "react";

interface GhostEdgeOverlayProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

const GhostEdgeOverlay: FC<GhostEdgeOverlayProps> = ({ from, to }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // 🛠️ Important fix
        zIndex: 10, // Make sure it’s above canvas but not blocking input
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="gray"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  );
};

export default GhostEdgeOverlay;
