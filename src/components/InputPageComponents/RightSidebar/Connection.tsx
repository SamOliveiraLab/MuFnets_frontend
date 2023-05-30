import React, { useContext } from 'react';
import {
  EdgesContext,
  SelectedEdgeContext,
  SelectedNodeContext,
} from '../../../pages/HomePage';

/* 
  Connection
    This component is is an individual connection between the current selected node and a target
    EdgeList is the parent component of this and will map each each coming out of this node
    to a connection
*/

const Connection = ({ target }: any) => {
  const { edges, setEdges }: any = useContext(EdgesContext);
  const { selectedNode }: any = useContext(SelectedNodeContext);
  const { setSelectedEdge }: any = useContext(SelectedEdgeContext);

  return (
    <div
      className="connection"
      onClick={() => {
        // Currently to delete an edge, click on the edge in the edge list and it will delete
        // We filter out the edge that we are deleting and set the edges to the filtered list
        const newEdges = edges.filter((edge: any) => {
          return edge.name !== `${selectedNode}->${target}`;
        });
        setEdges(newEdges);
        setSelectedEdge([]);
      }}
    >
      {target}
    </div>
  );
};

export default Connection;
