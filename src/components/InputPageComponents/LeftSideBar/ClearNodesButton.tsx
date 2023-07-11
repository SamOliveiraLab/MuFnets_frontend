import { Button } from '@mui/material';
import { useContext } from 'react';
import { NodesContext, EdgesContext } from '../../../pages/HomePage';

const ClearNodesButton = () => {
  const { setNodes }: any = useContext(NodesContext);
  const { setEdges }: any = useContext(EdgesContext); // Get setEdges function

  const handleClearNodes = () => {
    setNodes([]);
    setEdges([]); // Clear edges when nodes are cleared
  };

  return (
    <Button variant="contained" onClick={handleClearNodes}>
      Clear Nodes
    </Button>
  );
};

export default ClearNodesButton;
