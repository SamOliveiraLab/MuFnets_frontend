import { Button } from '@mui/material';
import { useContext } from 'react';
import {
  EdgesContext,
  NodesContext,
  Edge,
  Node as HomePageNode,
} from '../../../pages/HomePage';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Node as AlgorithmNode, 
  Graph, 
  threeIntSum 
} from '../../../Algorithm';

const CompileButton = () => {
  const { edges }: any = useContext(EdgesContext);
  const { nodes }: any = useContext(NodesContext);
  const { setOutput }: any = useOutletContext();
  const navigate = useNavigate();

  const handleCompile = () => {
    // 1. Create outputEdges and outputNodes as before
    const outputEdges = edges.map(({ source, target, settings }: Edge) => {
      const comType = settings?.communicationType?.charAt(0).toUpperCase();
      return `${source}:${comType}:${target}:1`;
    });

    const outputNodes = nodes.map(({ name }: HomePageNode) => {
      return name;
    });

    // 2. Create and populate a new graph from the outputEdges and outputNodes
    const graph = new Graph();

    outputNodes.forEach(nodeName => {
        graph.addNode(nodeName);
    });

    outputEdges.forEach(edge => {
        const [source, , target] = edge.split(':');
        graph.addEdge(source, target);
    });

    // 3. Perform operations on the graph (in this case, checking for a cycle and finding shortest path)
    const hasCycle = graph.nodes[outputNodes[0]].containsCycle();  // Assuming the graph starts from outputNodes[0]

    // Find the shortest path between two nodes for demo purposes (e.g., between outputNodes[0] and outputNodes[1])
    const shortestPathArray = graph.shortestPath(outputNodes[0], outputNodes[1]);

    // 4. Set the output and navigate
    setOutput({ 
        hasCycle, 
        shortestPathArray, 
        // other properties based on other operations you might want to add 
    });
    
    navigate('/output');
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleCompile}
      disabled={edges.length === 0}
      style={{ width: '80%', borderRadius: 30, fontSize: '.85rem' }}
    >
      Compile
    </Button>
  );
};

export default CompileButton;
