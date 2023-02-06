import React, { useContext } from 'react';
import {
  SelectedNodeContext,
  NodesContext,
  EdgesContext,
  Node,
  Edge,
} from '../../pages/HomePage';
import { Button, Typography } from '@mui/material';
import NodeInformation from './NodeInformation';
import EdgeList from './EdgeList';
import './RightSidebar.css';

const RightSidebar = () => {
  const { selectedNode, setSelectedNode }: any =
    useContext(SelectedNodeContext);
  const { nodes, setNodes }: any = useContext(NodesContext);
  const { edges, setEdges }: any = useContext(EdgesContext);

  const handleDeleteNode = () => {
    const newNodes = nodes.filter((node: Node) => {
      return node.name != selectedNode;
    });
    setNodes(newNodes);
    const newEdges = edges.filter((edge: Edge) => {
      return !edge.name.includes(selectedNode);
    });
    setEdges(newEdges);
    setSelectedNode('');
  };

  return (
    <div className="rightsidebar-container">
      {selectedNode != '' ? (
        <div>
          <Typography>Selected Node: {selectedNode}</Typography>
          <NodeInformation />
          <EdgeList />
          <Button variant="contained" color="error" onClick={handleDeleteNode}>
            Delete Node
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default RightSidebar;
