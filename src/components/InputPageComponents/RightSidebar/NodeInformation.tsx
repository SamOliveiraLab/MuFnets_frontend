import { useContext, useEffect, useState } from 'react';
import { Typography, Select, MenuItem, Button } from '@mui/material';
import {
  SelectedNodeContext,
  NodesContext,
  Node,
} from '../../../pages/HomePage';
import { UpdateContext } from '../../../pages/HomePage';

const NodeInformation = () => {
  const { selectedNode }: any = useContext(SelectedNodeContext);
  const { nodes, setNodes }: any = useContext(NodesContext);
  const { update, setUpdate }: any = useContext(UpdateContext);
  const [nodeInfo, setNodeInfo]: any = useState({
    height: 10,
  });

  useEffect(() => {
    if (selectedNode != '') {
      const node = nodes.filter((node: Node) => {
        return node.name === selectedNode;
      });
      setNodeInfo(node[0].settings);
    }
  }, [selectedNode]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const tempNodes = nodes;
        const oldNode = nodes.filter((node: Node) => {
          return node.name === selectedNode;
        });
        const oldNodeIndex = nodes.findIndex((node: Node) => {
          return node.name === selectedNode;
        });
        const newNode = { ...oldNode[0], settings: nodeInfo };
        tempNodes.splice(oldNodeIndex, 1, newNode);
        setNodes(tempNodes);
        setUpdate(!update);
      }}
    >
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
      <Button variant="contained" type="submit">
        Save Changes
      </Button>
    </form>
  );
};

export default NodeInformation;
