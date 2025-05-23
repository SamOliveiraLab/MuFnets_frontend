import { FC, useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
  


  const handleSave = async () => {
    try {
      await setDoc(doc(db, "nodes", nodeId), formData); // Save formData under document ID = nodeId
      onSave(nodeId, formData); // Optional callback
      onClose();
    } catch (error) {
      console.error("Error saving node data:", error);
    }
  };

  const [nodeDataSheet, setNodeDataSheet] = useState<any | null>(null);

  

  useEffect(() => {
    const fetchNodeData = async () => {
      const docRef = doc(db, "nodes", nodeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNodeDataSheet(docSnap.data());
      } else {
        setNodeDataSheet(null);
      }
    };
    fetchNodeData();
  }, [nodeId]);


  

  return (
    <div className="node-modal-overlay">
      <div className="node-modal-content">
        <h2>Cell {nodeId} Information</h2>

        {/* //check if details exist */}

        {nodeDataSheet ? (
          <div>
            <p>Specie:{nodeDataSheet.specie}</p>
            <p>Flow Behavior:{nodeDataSheet.flowBehavior}</p>
            <p>Input Connections:{nodeDataSheet.inputConnections}</p>
            <p>Output Connections:{nodeDataSheet.outputConnections}</p>
            <p>Perturbations:{nodeDataSheet.perturbations}</p>
          </div>
        ) : (
          <>
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
                  setFormData({
                    ...formData,
                    outputConnections: e.target.value,
                  })
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
          </>
        )}

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
