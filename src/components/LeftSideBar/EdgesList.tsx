import { Typography } from '@mui/material';
import { useContext } from 'react';
import {
  SelectedEdgeContext,
  EdgesContext,
  Edge,
  NodeColorsContext,
} from '../../pages/HomePage';

const EdgeList = () => {
  const { edges }: any = useContext(EdgesContext);
  const { setSelectedEdge }: any = useContext(SelectedEdgeContext);
  const { nodeColors }: any = useContext(NodeColorsContext);

  return (
    <div className="edges-list">
      <Typography fontSize={15} fontWeight="bold">
        Edges
      </Typography>
      {edges.map((edge: Edge) => {
        console.log(nodeColors);
        return (
          <Typography
            key={`${edge.source}->${edge.target}`}
            fontSize={13}
            className="edges-list-edge"
            color={nodeColors[edge.source]}
            onClick={() => {
              const [node1, node2]: string[] = edge.name.split('->');
              const parallel = edges.filter((edge: any) => {
                return edge.name === `${node2}->${node1}`;
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
