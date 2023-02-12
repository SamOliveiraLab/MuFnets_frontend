import { useContext, useEffect, useState } from 'react';
import { EdgesContext, SelectedNodeContext, Edge } from '../../pages/HomePage';
import Connection from './Connection';
import AddEdge from './AddEdge';
import { Typography } from '@mui/material';

const EdgeList = () => {
  const { edges }: any = useContext(EdgesContext);
  const { selectedNode }: any = useContext(SelectedNodeContext);

  const [currentEdges, setCurrentEdges]: any = useState([]);
  useEffect(() => {
    console.log(edges);
    const connections = edges.filter((edge: Edge) => {
      return edge.source === selectedNode;
    });
    setCurrentEdges(connections);
  }, [selectedNode, edges]);

  return (
    <div>
      <Typography variant="h6">Connected Nodes</Typography>
      <div>
        {currentEdges.map(({ target }: any) => {
          return <Connection edgeName={target} />;
        })}
        <AddEdge />
      </div>
    </div>
  );
};

export default EdgeList;
