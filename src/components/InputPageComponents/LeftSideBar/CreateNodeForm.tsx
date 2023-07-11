import { Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { useState, useContext } from 'react';
import { NodesContext, NodeColorsContext } from '../../../pages/HomePage';
import { getMyColor } from '../../../scripts.js';

/* 
  Create Node Form
    This form is on the left sidebar and is used to create nodes
    Currently it uses material ui form elements to allow users to create nodes 
    with a certain name and height
    It will then set the nodes array in the nodes context
*/

const CreateNodeForm = () => {
  const [nodeInfo, setNodeInfo] = useState<any>({
    name: '',
    height: 10,
  });
  const { nodes, setNodes }: any = useContext(NodesContext);
  const { nodeColors, setNodeColors }: any = useContext(NodeColorsContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const color = getMyColor();

    setNodes([
      ...nodes,
      {
        name: nodeInfo.name,
        attributes: {
          x: 0,
          y: 0,
          label: nodeInfo.name,
          color: color,
        },
        settings: {
          height: nodeInfo.height,
        },
      },
    ]);

    setNodeColors({ ...nodeColors, [nodeInfo.name]: color });
    setNodeInfo({
      name: '',
      height: 10,
    });
  };

  return (
    <form className="leftsidebar-form" onSubmit={handleSubmit}>
      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
        Create Node
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Enter Node Name"
        value={nodeInfo.name}
        onChange={(e) => setNodeInfo({ ...nodeInfo, name: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Typography variant="subtitle1">Height:</Typography>
      <Select
        value={nodeInfo.height}
        onChange={(e) => setNodeInfo({ ...nodeInfo, height: e.target.value })}
      >
        <MenuItem value={10}>0</MenuItem>
        <MenuItem value={15}>1</MenuItem>
        <MenuItem value={25}>2</MenuItem>
        <MenuItem value={35}>3</MenuItem>
      </Select>
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        disabled={nodeInfo.name === ''}
        fullWidth
        style={{ borderRadius: 30, marginTop: 16 }}
      >
        Create
      </Button>
    </form>
  );
};

export default CreateNodeForm;
