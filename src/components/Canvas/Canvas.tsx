import { Button } from '@mui/material';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

type CanvasProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (change: NodeChange[]) => void;
  onNodesDelete: (nodes: Node[]) => void;
  onEdgesChange: (change: EdgeChange[]) => void;
  onConnect: (change: Connection) => void;
  extractGraph: () => void;
};

const Canvas = ({
  nodes,
  edges,
  onNodesChange,
  onNodesDelete,
  onEdgesChange,
  onConnect,
  extractGraph,
}: CanvasProps) => {
  return (
    <div style={{ flex: 4, height: '95vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodesDraggable={true}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
        <Panel position="bottom-right">
          <Button variant="contained" onClick={extractGraph}>
            Compile
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Canvas;
