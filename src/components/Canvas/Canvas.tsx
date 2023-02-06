import { FC, useContext, useEffect, useState } from 'react';
import {
  EdgesContext,
  NodesContext,
  SelectedNodeContext,
} from '../../pages/HomePage';
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
  ControlsContainer,
  ZoomControl,
} from '@react-sigma/core';
import { MultiDirectedGraph } from 'graphology';
import '@react-sigma/core/lib/react-sigma.min.css';
import './Canvas.css';

const LoadGraphWithHook: FC = () => {
  const Graph: FC = () => {
    const loadGraph = useLoadGraph();
    const { nodes }: any = useContext(NodesContext);
    const { edges }: any = useContext(EdgesContext);

    useEffect(() => {
      const graph = new MultiDirectedGraph();
      nodes.forEach(({ name, attributes }: any) => {
        graph.addNode(name, attributes);
      });
      edges.forEach(({ name, source, target }: any) => {
        graph.addEdgeWithKey(name, source, target, { size: 5 });
      });

      loadGraph(graph);
    }, [loadGraph]);

    return null;
  };

  const GraphEvents: FC = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const { selectedNode, setSelectedNode }: any =
      useContext(SelectedNodeContext);

    useEffect(() => {
      registerEvents({
        downNode: (e) => {
          setDraggedNode(e.node);
          sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
        },
        mouseup: (e) => {
          if (draggedNode) {
            setDraggedNode(null);
            sigma.getGraph().removeNodeAttribute(draggedNode, 'highlighted');
          }
        },
        mousedown: (e) => {
          // Disable the autoscale at the first down interaction
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        },
        mousemove: (e) => {
          if (draggedNode) {
            // Get new position of node
            const pos = sigma.viewportToGraph(e);
            sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
            sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

            // Prevent sigma to move camera:
            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
          }
        },
        touchup: (e) => {
          if (draggedNode) {
            setDraggedNode(null);
            sigma.getGraph().removeNodeAttribute(draggedNode, 'highlighted');
          }
        },
        touchdown: (e) => {
          // Disable the autoscale at the first down interaction
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        },
        touchmove: (e) => {
          if (draggedNode) {
            // Get new position of node
            const pos = sigma.viewportToGraph(e);
            sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
            sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

            // Prevent sigma to move camera:
            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
          }
        },
        clickNode: (e) => {
          setSelectedNode(e.node);
        },
        clickEdge: (e) => {
          console.log(e.edge);
        },
      });
    }, [registerEvents, sigma, draggedNode]);

    return null;
  };

  return (
    <div className="canvas-container">
      <SigmaContainer
        settings={{
          defaultEdgeType: 'arrow',
          defaultEdgeColor: 'black',
        }}
      >
        <Graph />
        <GraphEvents />
        <ControlsContainer position={'bottom-right'}>
          <ZoomControl />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
};

export default LoadGraphWithHook;
