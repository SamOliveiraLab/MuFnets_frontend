import { useContext } from 'react';
import {
  NodesContext,
  SelectedNodeContext,
  Node,
  NodeColorsContext,
} from '../../../pages/HomePage';
import { Typography } from '@mui/material';

const NodesList = () => {
  const { nodes }: any = useContext(NodesContext);
  const { setSelectedNode }: any = useContext(SelectedNodeContext);
  const { nodeColors }: any = useContext(NodeColorsContext);

  return (
    <div className="list-items">
      <Typography fontSize={15} fontWeight="bold">
        Nodes
      </Typography>
      {nodes.map((node: Node) => {
        return (
          <Typography
            key={`${node.name}`}
            fontSize={13}
            color={nodeColors[node.name]}
            className="nodes-list-node"
            onClick={() => {
              setSelectedNode(node.name);
            }}
          >
            {node.name}{' '}
          </Typography>
        );
      })}
    </div>
  );
};

export default NodesList;
