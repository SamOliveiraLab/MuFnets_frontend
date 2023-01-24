import Canvas from '../components/Canvas/Canvas';
import Sidebar from '../components/Sidebar/Sidebar';
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from 'reactflow';
import { useState, useCallback } from 'react';

const HomePage = () => {
  const [currentNodes, setCurrentNodes] = useState<string[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((nds) => applyEdgeChanges(changes, nds)),
    []
  );

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onCreateNode = (name: string) => {
    if (!currentNodes.includes(name)) {
      setNodes([
        ...nodes,
        {
          id: name,
          position: { x: 0, y: 0 },
          data: { label: name },
        },
      ]);
      setCurrentNodes((prev) => [...prev, name]);
    } else {
      alert('This is a duplicate node');
    }
  };

  const onNodesDelete = useCallback((nodes: Node[]) => {
    nodes.forEach((node: Node) => {
      setCurrentNodes((prev) => prev.filter((str) => str !== node.id));
    });
  }, []);

  const extractGraph = () => {
    const graph: any = {};
    for (const node of currentNodes) {
      graph[node] = [];
    }
    for (const edge of edges) {
      graph[edge.source] = [...graph[edge.source], edge.target];
    }
    console.log(graph);
  };

  return (
    <div className="homepage-layout">
      <Sidebar onCreateNode={onCreateNode} />
      <Canvas
        nodes={nodes}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        extractGraph={extractGraph}
      />
    </div>
  );
};

export default HomePage;
