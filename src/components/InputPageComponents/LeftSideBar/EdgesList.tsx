import { Typography } from '@mui/material';
import { useContext } from 'react';
import {
  SelectedEdgeContext,
  EdgesContext,
  Edge,
  NodeColorsContext,
} from '../../../pages/HomePage';

/* 
  Edge List
    The edge list displays the list of all edges formatted source->target
    Users can click on the edges to set the selected edge
*/

const EdgeList = () => {
  const { edges }: any = useContext(EdgesContext);
  const { setSelectedEdge }: any = useContext(SelectedEdgeContext);
  const { nodeColors }: any = useContext(NodeColorsContext);

  return (
    <div className="list-items">
      <Typography fontSize={15} fontWeight="bold">
        Edges
      </Typography>
      {edges.map((edge: Edge) => {
        return (
          <Typography
            key={`${edge.source}->${edge.target}`}
            fontSize={13}
            className="edges-list-edge"
            color={nodeColors[edge.source]}
            onClick={() => {
              const [source, target]: string[] = edge.name.split('->');
              //We see if there the is a parallel edge so we can set selected edge properly
              const parallel = edges.filter((edge: any) => {
                return edge.name === `${target}->${source}`;
              });

              if (parallel.length == 1) {
                setSelectedEdge([edge.name, parallel[0].name]);
              } else {
                setSelectedEdge([edge.name]);
              }
            }}
          >
            {edge.name}{' '}
          </Typography>
        );
      })}
    </div>
  );
};

export default EdgeList;
