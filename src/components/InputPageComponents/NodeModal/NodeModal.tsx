import { FC, useState } from "react";
import "./NodeModal.css"; // We'll create this CSS file next

interface NodeModalProps {
  nodeId: string;
  nodeData: any;
  onClose: () => void;
  onSave: (nodeId: string, data: any) => void;
}

const NodeModal: FC<NodeModalProps> = ({
  nodeId,
  nodeData,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    specie: nodeData.specie || "",
    flowBehavior: nodeData.flowBehavior || "",
    inputConnections: nodeData.inputConnections || [],
    outputConnections: nodeData.outputConnections || [],
    perturbations: nodeData.perturbations || [],
  });

  const handleSave = () => {
    onSave(nodeId, formData);
    onClose();
  };

  return (
    <div className="node-modal-overlay">
      <div className="node-modal-content">
        <h2>Cell {nodeId} Information</h2>

        <div className="form-section">
          <label>Specie:</label>
          <input
            value={formData.specie}
            onChange={(e) =>
              setFormData({ ...formData, specie: e.target.value })
            }
          />
        </div>

        <div className="form-section">
          <label>Flow Behavior:</label>
          <input
            value={formData.flowBehavior}
            onChange={(e) =>
              setFormData({ ...formData, flowBehavior: e.target.value })
            }
          />
        </div>

        <div className="form-section">
          <label>Input Connections:</label>
          <input
            value={formData.inputConnections}
            onChange={(e) =>
              setFormData({ ...formData, inputConnections: e.target.value })
            }
          />
        </div>

        <div className="form-section">
          <label>Output Connections:</label>
          <input
            value={formData.outputConnections}
            onChange={(e) =>
              setFormData({ ...formData, outputConnections: e.target.value })
            }
          />
        </div>

        <div className="form-section">
          <label>Perturbations:</label>
          <input
            value={formData.perturbations}
            onChange={(e) =>
              setFormData({ ...formData, perturbations: e.target.value })
            }
          />
        </div>

        {/* Add other form fields as needed */}

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
