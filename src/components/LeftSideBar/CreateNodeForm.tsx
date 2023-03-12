import { Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { useState, useContext } from 'react';
import { NodesContext, NodeColorsContext } from '../../pages/HomePage';
import { getMyColor } from '../../scripts.js';

const CreateNodeForm = () => {
  const [nodeInfo, setNodeInfo] = useState<any>({
    name: '',
    height: 10,
  });
  const { nodes, setNodes }: any = useContext(NodesContext);
  const { nodeColors, setNodeColors }: any = useContext(NodeColorsContext);

  return (
    <form
      className="leftsidebar-form"
      onSubmit={(e) => {
        e.preventDefault();
        const color = getMyColor();

        setNodes([
          ...nodes,
          {
            name: nodeInfo.name,
            attributes: {
              x: 0,
              y: 0,
              label: `${nodeInfo.name}`,
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
      }}
    >
      <Typography style={{ fontSize: 25, fontWeight: 'bold' }}>
        Create Node
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Enter Node Name:"
        value={nodeInfo.name}
        onChange={(e) => {
          setNodeInfo((prev: any) => {
            return { ...prev, name: e.target.value };
          });
        }}
      />
      <Typography variant="h6">Height:</Typography>
      <Select
        value={nodeInfo.height}
        onChange={(e) => {
          setNodeInfo((prev: any) => {
            return { ...prev, height: e.target.value };
          });
        }}
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
        disabled={nodeInfo.name === '' ? true : false}
        className="create-button"
        style={{ width: '100%', borderRadius: 30, fontSize: '.85rem' }}
      >
        Create
      </Button>
    </form>
  );
};

export default CreateNodeForm;
