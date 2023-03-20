import React, { useContext } from 'react';
import {
  EdgesContext,
  SelectedEdgeContext,
  SelectedNodeContext,
} from '../../../pages/HomePage';

const Connection = ({ edgeName }: any) => {
  const { edges, setEdges }: any = useContext(EdgesContext);
  const { selectedNode }: any = useContext(SelectedNodeContext);
  const { setSelectedEdge }: any = useContext(SelectedEdgeContext);
  return (
    <div
      className="connection"
      onClick={() => {
        const newEdges = edges.filter((edge: any) => {
          return edge.name !== `${selectedNode}->${edgeName}`;
        });
        setEdges(newEdges);
        setSelectedEdge([]);
      }}
    >
      {edgeName}
    </div>
  );
};

export default Connection;
