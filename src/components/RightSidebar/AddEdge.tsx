import { useContext, useState } from 'react';
import { TextField } from '@mui/material';
import {
  SelectedNodeContext,
  NodesContext,
  EdgesContext,
  Edge,
  Node,
} from '../../pages/HomePage';

const AddEdge = () => {
  const [targetNode, setTargetNode] = useState<string>('');
  const { edges, setEdges }: any = useContext(EdgesContext);
  const { nodes }: any = useContext(NodesContext);
  const { selectedNode }: any = useContext(SelectedNodeContext);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const checkNodeExist = nodes.filter((node: Node) => {
      return node.name === targetNode;
    });

    if (checkNodeExist.length != 0) {
      const checkDuplicateEdge = edges.filter((edge: Edge) => {
        return edge.name === `${selectedNode}->${targetNode}`;
      });
      if (checkDuplicateEdge.length === 0) {
        setEdges([
          ...edges,
          {
            name: `${selectedNode}->${targetNode}`,
            source: selectedNode,
            target: targetNode,
          },
        ]);
        setTargetNode('');
      } else {
        alert('This edge already exists');
        setTargetNode('');
      }
    } else {
      alert('Node does not exist');
      setTargetNode('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        variant="standard"
        label="Enter Edge Name"
        value={targetNode}
        onChange={(e) => {
          setTargetNode(e.target.value);
        }}
      />
    </form>
  );
};

export default AddEdge;
