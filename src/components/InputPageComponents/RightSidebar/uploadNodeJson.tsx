import React, { useRef } from "react";
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const UploadNodeJson = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const db = getFirestore();

      for (const node of nodeArray) {
        if (!node.id) {
          console.warn("Skipping node without an 'id':", node);
          continue;
        }

        const nodeRef = doc(db, "nodes", node.id);
        await setDoc(nodeRef, node);
      }

      alert("✅ All nodes uploaded to Firestore!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Invalid JSON structure.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{padding: 10, borderBottom: '1px solid black'}}
    >
      <Typography variant="h6" fontWeight="bold">
        Upload Node JSON File:
      </Typography>

      <button
        onClick={triggerFileInput}
        style={{
          marginTop: 5,
          padding: "10px 20px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3730a3")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
      >
        Choose File
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleJsonUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadNodeJson;
