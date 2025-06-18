import { FC } from "react";
import { useSigma } from "@react-sigma/core";

const ResetLayoutButton: FC = () => {
  const sigma = useSigma();

  const handleReset = () => {
    if (!sigma) return;

    const graph = sigma.getGraph();
    const nodeCount = graph.order;
    const radius = 100;
    const centerX = 0;
    const centerY = 0;

    graph.forEachNode((node, attributes) => {
      const i = graph.nodes().indexOf(node);
      const angle = (2 * Math.PI * i) / nodeCount;
      graph.setNodeAttribute(node, "x", centerX + radius * Math.cos(angle));
      graph.setNodeAttribute(node, "y", centerY + radius * Math.sin(angle));
    });

    sigma.refresh();
  };

  return (
    <button
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        padding: "8px 12px",
        background: "#333",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        zIndex: 1000,
      }}
      onClick={handleReset}
    >
      Reset to Circle Layout
    </button>
  );
};

export default ResetLayoutButton;
