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

/* 
  Canvas
    The canvas is the most crucial component of the input page components as it is where the nodes and edges are being displayed.
    Most of the code written was taken basically directly from the react sigma documentation, with slight modifications here and
    there for our specific use case.
*/

// Function taken from the sigma documentation
const LoadGraphWithHook: FC = () => {
  // Importing Context
  const { nodes }: any = useContext(NodesContext);
  const { edges }: any = useContext(EdgesContext);
  const { nodeColors }: any = useContext(NodeColorsContext);

  // Graph component is used to actually render the nodes and edges
  const Graph: FC = () => {
    const loadGraph = useLoadGraph();
    // ERROR HERE: the only layout that seemed to be working for me was Circular, was trying to get
    // atlas 2 to work but had an error with that
    const { assign } = useLayoutCircular();

    // Creates graph from state on render and update to the graph
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

  //This function handles events related to the graph and was taken from react sigma docs
  const GraphEvents: FC = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const { edges }: any = useContext(EdgesContext);
    const { selectedNode, setSelectedNode }: any =
      useContext(SelectedNodeContext);
    const { setSelectedEdge }: any = useContext(SelectedEdgeContext);
    const setSettings = useSetSettings();

    // Event listeners
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
        clickStage: (e) => {
          setSelectedNode('');
          setSelectedEdge('');
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
      });
    }, [registerEvents, sigma]);

    // Code taken from react sigma docs, used to hide edges not related to current selected node
    useEffect(() => {
      setSettings({
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };
          if (
            selectedNode != '' &&
            !graph.extremities(edge).includes(selectedNode)
          ) {
            newData.hidden = true;
          }
          return newData;
        },
      });
    }, [selectedNode, nodes, edges, setSettings, sigma]);

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
