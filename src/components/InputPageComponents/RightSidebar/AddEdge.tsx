import { useContext, useState } from 'react';
import { TextField } from '@mui/material';
import {
  SelectedNodeContext,
  NodesContext,
  EdgesContext,
  Edge,
  Node,
} from '../../../pages/HomePage';

/* 
  Add Edge
    An input on the right sidebar that allows users to enter the name of another 
    node in the graph and draw a line from the selected node to that node
    Currently just an input that is submitted by hitting enter
*/

const AddEdge = () => {
  const [targetNode, setTargetNode] = useState<string>('');
  const { edges, setEdges }: any = useContext(EdgesContext);
  const { nodes }: any = useContext(NodesContext);
  const { selectedNode }: any = useContext(SelectedNodeContext);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //First check if the target node exists in the graph
    const checkNodeExist = nodes.filter((node: Node) => {
      return node.name === targetNode;
    });

    if (checkNodeExist.length != 0) {
      //Then check if there is an already existing edge that from this source to the target
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
            settings: {
              communicationType: 'long',
              communicationSpeed: 'fast',
            },
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
        label="Enter Node Name"
        value={targetNode}
        onChange={(e) => {
          setTargetNode(e.target.value);
        }}
      />
    </form>
  );
};

export default AddEdge;
