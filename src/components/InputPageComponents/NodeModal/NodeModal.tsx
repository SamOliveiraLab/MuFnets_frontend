import { FC, useState, useEffect, useContext } from "react";
import { db } from "../../../firebase";
import { allNodesContext } from "../../../pages/HomePage";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
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
    species: nodeData.species || "",
    flow_behavior: nodeData.flow_behavior || "",
    inputs: nodeData.inputs || [],
    outputs: nodeData.outputs || [],
    perturbation: nodeData.perturbation || [],
    flow_rate: nodeData.flow_rate,
    volume: nodeData.volume,
    mu_max: nodeData.mu_max,
    Ks: nodeData.Ks,
    Y_x_s: nodeData.Y_x_s,
    mu_death: nodeData.mu_death,
    OD_desired: nodeData.OD_desired,
    K: nodeData.K,
    S_in: nodeData.S_in,
  });
  const { setAllNodesData }: any = useContext(allNodesContext);
  // const [allNodesData, setAllNodesData] = useState<any[]>([]);

  const handleSave = async () => {
    try {
      const cleanedData = {
        species: formData.species ,
        flow_behavior: formData.flow_behavior ,
        inputs: formData.inputs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        outputs: formData.outputs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        perturbation: formData.perturbation
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        flow_rate: parseInt(formData.flow_rate),
        volume: parseFloat(formData.volume),
        mu_max: parseFloat(formData.mu_max),
        Ks: parseFloat(formData.Ks),
        Y_x_s: parseInt(formData.Y_x_s),
        mu_death: parseFloat(formData.mu_death),
        OD_desired: parseFloat(formData.OD_desired),
        K: parseFloat(formData.K),
        S_in: parseFloat(formData.S_in),
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
          species: data.species || "",
          flow_behavior: data.flow_behavior || "",
          inputs: (data.inputs || []).join(", "),
          outputs: (data.outputs || []).join(", "),
          flow_rate: data.flow_rate,
          perturbation: (data.perturbation || []).join(", "),
          volume: data.volume,
          mu_max: data.mu_max,
          Ks: data.Ks,
          Y_x_s: data.Y_x_s,
          mu_death: data.mu_death,
          OD_desired: data.OD_desired,
          K: data.K,
          S_in: data.S_in,
        });
        setIsEditing(false); // Start in view mode
      } else {
        setNodeDataSheet(null);
        setIsEditing(true); // No data yet, go to edit mode
      }
    };
    fetchNodeData();
  }, [nodeId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "nodes"), (snapshot) => {
      const updatedDocs: any[] = [];
      snapshot.forEach((doc) => {
        updatedDocs.push({ id: doc.id, ...doc.data() });
      });
      setAllNodesData(updatedDocs);
      // console.log("Live update: All nodes", updatedDocs);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

   

  return (
    <div className="node-modal-overlay">
      <div className="node-modal-content">
        <h2>Cell {nodeId} Settings </h2>

        {/* //check if details exist */}

        {isEditing ? (
          <>
            <div className="form-section">
              <label>Specie:</label>
              <input
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Flow Behavior:</label>
              <input
                value={formData.flow_behavior}
                onChange={(e) =>
                  setFormData({ ...formData, flow_behavior: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Input Connections:</label>
              <input
                value={formData.inputs}
                onChange={(e) =>
                  setFormData({ ...formData, inputs: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Output Connections:</label>
              <input
                value={formData.outputs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    outputs: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-section">
              <label>Flow Rate:</label>
              <input
                value={formData.flow_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    flow_rate: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-section">
              <label>Perturbations:</label>
              <input
                value={formData.perturbation}
                onChange={(e) =>
                  setFormData({ ...formData, perturbation: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Volume:</label>
              <input
                value={formData.volume}
                onChange={(e) =>
                  setFormData({ ...formData, volume: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Mu_max:</label>
              <input
                value={formData.mu_max}
                onChange={(e) =>
                  setFormData({ ...formData, mu_max: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Ks:</label>
              <input
                value={formData.Ks}
                onChange={(e) =>
                  setFormData({ ...formData, Ks: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Y_x_s:</label>
              <input
                value={formData.Y_x_s}
                onChange={(e) =>
                  setFormData({ ...formData, Y_x_s: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>Mu_death:</label>
              <input
                value={formData.mu_death}
                onChange={(e) =>
                  setFormData({ ...formData, mu_death: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>OD_desired:</label>
              <input
                value={formData.OD_desired}
                onChange={(e) =>
                  setFormData({ ...formData, OD_desired: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>K:</label>
              <input
                value={formData.K}
                onChange={(e) =>
                  setFormData({ ...formData, K: e.target.value })
                }
              />
            </div>

            <div className="form-section">
              <label>S_in:</label>
              <input
                value={formData.S_in}
                onChange={(e) =>
                  setFormData({ ...formData, S_in: e.target.value })
                }
              />
            </div>
          </>
        ) : (
          <div>
            <p>Species: {nodeDataSheet?.species}</p>
            <p>Flow_behavior: {nodeDataSheet?.flow_behavior}</p>
            <p>Inputs: {nodeDataSheet?.inputs}</p>
            <p>Outputs: {nodeDataSheet?.outputs}</p>
            <p>Perturbation: {nodeDataSheet?.perturbation}</p>
            <p>Flow Rate: {nodeDataSheet?.flow_rate}</p>
            <p>Volume: {nodeDataSheet?.volume}</p>
            <p>Mu_max: {nodeDataSheet?.mu_max}</p>
            <p>Ks: {nodeDataSheet?.Ks}</p>
            <p>Y_x_s: {nodeDataSheet?.Y_x_s}</p>
            <p>mu_death: {nodeDataSheet?.mu_death}</p>
            <p>OD_desired: {nodeDataSheet?.OD_desired}</p>
            <p>K: {nodeDataSheet?.K}</p>
            <p>S_in: {nodeDataSheet?.S_in}</p>
          </div>
        )}

        {/* Add other form fields as needed */}

        <div className="modal-actions">
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
          {isEditing ? (
            <button onClick={handleSave} className="save">
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
