import { Button } from '@mui/material';
import { useContext } from 'react';
import {
  NodesContext,
  EdgesContext,
  SelectedNodeContext,
  Node,
  Edge,
} from '../../../pages/HomePage';

const DeleteNode = () => {
  const { nodes, setNodes }: any = useContext(NodesContext);
  const { edges, setEdges }: any = useContext(EdgesContext);
  const { selectedNode, setSelectedNode }: any =
    useContext(SelectedNodeContext);

  const handleDeleteNode = () => {
    const temp = selectedNode;
    setSelectedNode('');
    const newNodes = nodes.filter((node: Node) => {
      return node.name != temp;
    });
    setNodes(newNodes);
    const newEdges = edges.filter((edge: Edge) => {
      return !edge.name.includes(temp);
    });
    setEdges(newEdges);
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={() => {
        handleDeleteNode();
      }}
    >
      Delete Node
    </Button>
  );
};

export default DeleteNode;
