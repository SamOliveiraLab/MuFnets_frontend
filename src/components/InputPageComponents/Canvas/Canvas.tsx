import { FC, useContext, useEffect, useState } from 'react';
import {
  EdgesContext,
  NodesContext,
  SelectedNodeContext,
  SelectedEdgeContext,
  NodeColorsContext,
} from '../../../pages/HomePage';
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
  ControlsContainer,
  ZoomControl,
  useSetSettings,
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
    const { nodeColors }: any = useContext(NodeColorsContext);
    const { assign } = useLayoutCircular();

    useEffect(() => {
      const graph = new MultiDirectedGraph();
      nodes.forEach(({ name, attributes, settings }: any) => {
        const nodeAttributes = {
          size: settings.height,
          color: attributes.color,
          ...attributes,
        };
        graph.addNode(name, nodeAttributes);
      });

      edges.forEach(({ name, source, target }: any) => {
        graph.addEdgeWithKey(name, source, target, {
          size: 5,
          color: nodeColors[source],
        });
      });

      loadGraph(graph);
      assign();
    }, [assign, loadGraph]);

    return null;
  };

  const GraphEvents: FC = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const { edges }: any = useContext(EdgesContext);
    const { setSelectedNode }: any = useContext(SelectedNodeContext);
    const { setSelectedEdge }: any = useContext(SelectedEdgeContext);
    const setSettings = useSetSettings();
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useEffect(() => {
      registerEvents({
        downNode: (e) => {
          sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
        },
        mousedown: (e) => {
          // Disable the autoscale at the first down interaction
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        },
        touchdown: (e) => {
          // Disable the autoscale at the first down interaction
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        },
        clickNode: (e) => {
          setSelectedNode(e.node);
        },
        clickEdge: (e) => {
          const [node1, node2]: string[] = e.edge.split('->');
          const parallel = edges.filter((edge: any) => {
            return edge.name === `${node2}->${node1}`;
          });

          if (parallel.length == 1) {
            setSelectedEdge([e.edge, parallel[0].name]);
          } else {
            setSelectedEdge([e.edge]);
          }
        },
        enterNode: (event) => setHoveredNode(event.node),
        leaveNode: () => setHoveredNode(null),
      });
    }, [registerEvents, sigma]);

    useEffect(() => {
      setSettings({
        nodeReducer: (node, data) => {
          const graph = sigma.getGraph();
          const newData: any = {
            ...data,
            highlighted: data.highlighted || false,
          };

          if (hoveredNode) {
            if (
              node === hoveredNode ||
              graph.neighbors(hoveredNode).includes(node)
            ) {
              newData.highlighted = true;
            } else {
              newData.color = '#E2E2E2';
              newData.highlighted = false;
            }
          }
          return newData;
        },
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };

          if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
            newData.hidden = true;
          }
          return newData;
        },
      });
    }, [hoveredNode, setSettings, sigma]);

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
