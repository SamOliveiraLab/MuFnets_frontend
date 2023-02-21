import { FC, useContext, useEffect, useState } from 'react';
import {
  EdgesContext,
  NodesContext,
  SelectedNodeContext,
  SelectedEdgeContext,
} from '../../pages/HomePage';
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
  ControlsContainer,
  ZoomControl,
} from '@react-sigma/core';
import { useLayoutCircular } from '@react-sigma/layout-circular';
import { MultiDirectedGraph } from 'graphology';
import '@react-sigma/core/lib/react-sigma.min.css';
import './Canvas.css';

const LoadGraphWithHook: FC = () => {
  const Graph: FC = () => {
    const loadGraph = useLoadGraph();
    const { nodes }: any = useContext(NodesContext);
    const { edges }: any = useContext(EdgesContext);
    const { positions, assign } = useLayoutCircular();

    const selectColor = (height: number) => {
      switch (height) {
        case 10:
          return 'blue';
        case 15:
          return 'red';
        case 25:
          return 'green';
        case 35:
          return 'yellow';
      }
    };

    useEffect(() => {
      const graph = new MultiDirectedGraph();
      nodes.forEach(({ name, attributes, settings }: any) => {
        const nodeAttributes = {
          size: settings.height,
          color: selectColor(settings.height),
          ...attributes,
        };
        graph.addNode(name, nodeAttributes);
      });

      edges.forEach(({ name, source, target }: any) => {
        graph.addEdgeWithKey(name, source, target, { size: 7 });
      });

      loadGraph(graph);
      assign();
    }, [assign, loadGraph]);

    return null;
  };

  const GraphEvents: FC = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const { edges }: any = useContext(EdgesContext);
    const { setSelectedNode }: any = useContext(SelectedNodeContext);
    const { setSelectedEdge }: any = useContext(SelectedEdgeContext);

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
          const node1 = e.edge.charAt(0);
          const node2 = e.edge.charAt(e.edge.length - 1);
          const parallel = edges.filter((edge: any) => {
            return edge.name === `${node2}->${node1}`;
          });

          if (parallel.length == 1) {
            setSelectedEdge([e.edge, parallel[0].name]);
          } else {
            setSelectedEdge([e.edge]);
          }
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
