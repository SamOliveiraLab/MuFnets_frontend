import React from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const UploadNodeJson = () => {
  const handleJsonUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const nodeArray = JSON.parse(text);

      if (!Array.isArray(nodeArray)) {
        throw new Error("JSON should be an array of node objects.");
      }

      const db = getFirestore(); // ✅ Firestore instance

      for (const node of nodeArray) {
        if (!node.id) {
          console.warn("Skipping node without an 'id':", node);
          continue;
        }

        const nodeRef = doc(db, "nodes", node.id); // ✅ Firestore document
        await setDoc(nodeRef, node); // ✅ Save to Firestore
      }

      alert("✅ All nodes uploaded to Firestore!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Invalid JSON structure.");
    }
  };

  return (
    <div>
      <label>Upload Node JSON File:</label>
      <input type="file" accept=".json" onChange={handleJsonUpload} />
    </div>
  );
};

export default UploadNodeJson;
