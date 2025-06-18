import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState, useContext } from "react";
import { NodesContext, NodeColorsContext } from "../../../pages/HomePage";
import { getMyColor } from "../../../scripts.js";

const CreateNodeForm = () => {
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [singleNode, setSingleNode] = useState({ name: "", height: 10 });
  const [batchInfo, setBatchInfo] = useState({
    baseName: "",
    count: 3,
    height: 10,
  });

  const { nodes, setNodes }: any = useContext(NodesContext);
  const { nodeColors, setNodeColors }: any = useContext(NodeColorsContext);

  const handleModeChange = (_: any, newMode: "single" | "batch") => {
    if (newMode) setMode(newMode);
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const color = getMyColor();

    setNodes([
      ...nodes,
      {
        name: singleNode.name,
        attributes: {
          x: Math.random(),
          y: Math.random(),
          label: singleNode.name,
          color,
        },
        settings: { height: singleNode.height },
      },
    ]);

    setNodeColors({ ...nodeColors, [singleNode.name]: color });
    setSingleNode({ name: "", height: 10 });
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { baseName, count, height } = batchInfo;
    const newNodes = [];
    const newColors = { ...nodeColors };

    const baseY = Math.random() * 100;
    const spacing = 10;

    for (let i = 0; i < count; i++) {
      const name = `${baseName}${i + 1}`;

      // Ensure uniqueness
      if (nodes.find((n: any) => n.name === name)) continue;

      const color = getMyColor();
      newNodes.push({
        name,
        attributes: {
          x: Math.random(),
          y: baseY + i * spacing,
          label: name,
          color,
        },
        settings: { height },
      });

      newColors[name] = color;
    }

    setNodes([...nodes, ...newNodes]);
    setNodeColors(newColors);
    setBatchInfo({ baseName: "", count: 3, height: 10 });
  };

  return (
    <form
      className="leftsidebar-form"
      onSubmit={mode === "single" ? handleSingleSubmit : handleBatchSubmit}
    >
      <Typography variant="h6" fontWeight="bold">
        Create Node
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        size="small"
        sx={{ my: 1 }}
      >
        <ToggleButton value="single">Single</ToggleButton>
        <ToggleButton value="batch">Batch</ToggleButton>
      </ToggleButtonGroup>

      {mode === "single" ? (
        <>
          <TextField
            variant="outlined"
            placeholder="Enter Node Name"
            value={singleNode.name}
            onChange={(e) =>
              setSingleNode({ ...singleNode, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <Typography variant="subtitle1">Height:</Typography>
          <Select
            value={singleNode.height}
            onChange={(e) =>
              setSingleNode({ ...singleNode, height: Number(e.target.value) })
            }
            fullWidth
          >
            <MenuItem value={10}>0</MenuItem>
            <MenuItem value={15}>1</MenuItem>
            <MenuItem value={25}>2</MenuItem>
            <MenuItem value={35}>3</MenuItem>
          </Select>
        </>
      ) : (
        <>
          <TextField
            variant="outlined"
            placeholder="Base Name"
            value={batchInfo.baseName}
            onChange={(e) =>
              setBatchInfo({ ...batchInfo, baseName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            type="number"
            variant="outlined"
            placeholder="Number of Nodes"
            value={batchInfo.count}
            onChange={(e) =>
              setBatchInfo({
                ...batchInfo,
                count: parseInt(e.target.value) || 0,
              })
            }
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <Typography variant="subtitle1">Height:</Typography>
          <Select
            value={batchInfo.height}
            onChange={(e) =>
              setBatchInfo({ ...batchInfo, height: Number(e.target.value) })
            }
            fullWidth
          >
            <MenuItem value={10}>0</MenuItem>
            <MenuItem value={15}>1</MenuItem>
            <MenuItem value={25}>2</MenuItem>
            <MenuItem value={35}>3</MenuItem>
          </Select>
        </>
      )}

      <Button
        variant="contained"
        color="secondary"
        type="submit"
        fullWidth
        disabled={
          mode === "single"
            ? singleNode.name.trim() === ""
            : batchInfo.baseName.trim() === "" || batchInfo.count <= 0
        }
        style={{ borderRadius: 30, marginTop: 16, marginBottom: 10 }}
      >
        Create
      </Button>
    </form>
  );
};

export default CreateNodeForm;
