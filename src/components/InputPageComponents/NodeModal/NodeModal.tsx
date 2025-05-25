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
      const cleanedData = {
        ...formData,
        inputConnections: formData.inputConnections
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        outputConnections: formData.outputConnections
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        perturbations: formData.perturbations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await setDoc(doc(db, "nodes", nodeId), cleanedData);
      onSave(nodeId, cleanedData);
      setNodeDataSheet(cleanedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving node data:", error);
    }
  };

  const [nodeDataSheet, setNodeDataSheet] = useState<any | null>(null);

  const [isEditing, setIsEditing] = useState(nodeDataSheet ? false : true);


  useEffect(() => {
    const fetchNodeData = async () => {
      const docRef = doc(db, "nodes", nodeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNodeDataSheet(data);
        setFormData({
          specie: data.specie || "",
          flowBehavior: data.flowBehavior || "",
          inputConnections: (data.inputConnections || []).join(", "),
          outputConnections: (data.outputConnections || []).join(", "),
          perturbations: (data.perturbations || []).join(", "),
        });
        setIsEditing(false); // Start in view mode
      } else {
        setNodeDataSheet(null);
        setIsEditing(true); // No data yet, go to edit mode
      }
    };
    fetchNodeData();
  }, [nodeId]);



  

  return (
    <div className="node-modal-overlay">
      <div className="node-modal-content">
        <h2>Cell {nodeId} Information</h2>

        {/* //check if details exist */}

        {isEditing ? (
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
        ) : (
          <div>
            <p>Specie: {nodeDataSheet?.specie}</p>
            <p>Flow Behavior: {nodeDataSheet?.flowBehavior}</p>
            <p>Input Connections: {nodeDataSheet?.inputConnections}</p>
            <p>Output Connections: {nodeDataSheet?.outputConnections}</p>
            <p>Perturbations: {nodeDataSheet?.perturbations}</p>
          </div>
        )}

        {/* Add other form fields as needed */}

        <div className="modal-actions">
          <button onClick={onClose} className="cancel">Cancel</button>
          {isEditing ? (
            <button onClick={handleSave} className="save">Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
