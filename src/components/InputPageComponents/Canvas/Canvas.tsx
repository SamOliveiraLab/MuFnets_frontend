import { FC, useContext, useEffect, useState } from "react";
import {
  EdgesContext,
  NodesContext,
  SelectedNodeContext,
  SelectedEdgeContext,
  NodeColorsContext,
  HighlightNodeContext,
} from "../../../pages/HomePage";
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
  ControlsContainer,
  ZoomControl,
  useSetSettings,
} from "@react-sigma/core";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { MultiDirectedGraph } from "graphology";
import "@react-sigma/core/lib/react-sigma.min.css";
import "./Canvas.css";
import NodeModal from "../NodeModal/NodeModal";

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
  const {
    highlightedNode,
    highlightTrigger,
    setHighlightTrigger,
    setHighlightedNode,
  }: any = useContext(HighlightNodeContext);

  const [showNodeModal, setShowNodeModal] = useState(false);
  const [currentNode, setCurrentNode] = useState<{
    id: string;
    data: any;
  } | null>(null);

  // Add handler for saving node data
  const handleSaveNode = (nodeId: string, data: any) => {
    // Here you would update your nodes state with the new data
    // This depends on how you're managing state in your app
    console.log(`Saving data for node ${nodeId}:`, data);
    // You might need to update your NodesContext here
  };

  // Graph component is used to actually render the nodes and edges
  const Graph: FC = () => {
    const loadGraph = useLoadGraph();
    // ERROR HERE: the only layout that seemed to be working for me was Circular, was trying to get
    // atlas 2 to work but had an error with that

    const sigma = useSigma();

    const { assign } = useLayoutCircular();

    // Creates graph from state on render and update to the graph
    useEffect(() => {
      const graph = new MultiDirectedGraph();
      const existingGraph = sigma?.getGraph?.();

      nodes.forEach(({ name, attributes, settings }: any) => {
        const existingAttributes = existingGraph?.hasNode(name)
          ? existingGraph.getNodeAttributes(name)
          : {};

        const nodeAttributes = {
          size: settings.height,
          color: attributes.color,
          ...attributes,
          x: existingAttributes.x ?? Math.random(),
          y: existingAttributes.y ?? Math.random(),
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
      // assign();
    }, [nodes, edges, nodeColors, loadGraph]);

    return null;
  };

  //This function handles events related to the graph and was taken from react sigma docs
  const GraphEvents: FC = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const [isDrawingEdge, setIsDrawingEdge] = useState(false);
    const [edgeStartNode, setEdgeStartNode] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
      null
    );
    const { edges, setEdges }: any = useContext(EdgesContext);
    const { selectedNode, setSelectedNode }: any =
      useContext(SelectedNodeContext);
    const { setSelectedEdge }: any = useContext(SelectedEdgeContext);
    const setSettings = useSetSettings();

    useEffect(() => {
      if (!highlightedNode || !highlightTrigger) return;

      const graph = sigma.getGraph();
      if (!graph.hasNode(highlightedNode)) return;

      const { x, y } = graph.getNodeAttributes(highlightedNode);
      sigma.getCamera().animate({ x, y, ratio: 0.5 }, { duration: 1200 });

      // Reset trigger so it doesn’t run again accidentally
      setHighlightTrigger(false);
    }, [highlightedNode, highlightTrigger]);



    useEffect(() => {
      if (!highlightedNode || !highlightTrigger) return;

      const graph = sigma.getGraph();
      if (!graph.hasNode(highlightedNode)) return;

      const originalSize = graph.getNodeAttribute(highlightedNode, "size");

      let pulseCount = 0;
      const pulse = () => {
        if (pulseCount >= 3) {
          graph.setNodeAttribute(highlightedNode, "size", originalSize);
          return;
        }

        graph.setNodeAttribute(highlightedNode, "size", originalSize * 1.6);
        setTimeout(() => {
          graph.setNodeAttribute(highlightedNode, "size", originalSize);
          setTimeout(() => {
            pulseCount++;
            pulse();
          }, 250);
        }, 250);
      };

      pulse();
    }, [highlightedNode, highlightTrigger]);



    // Event listeners
    useEffect(() => {
      let didDrag = false;
      let clickTimeout: ReturnType<typeof setTimeout> | null = null;

      const handleClickNode = (e: any) => {
        if (didDrag) return;

        if (clickTimeout) clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          if (isDrawingEdge && edgeStartNode && edgeStartNode !== e.node) {
            // Finish drawing the edge
            const newEdge = {
              name: `${edgeStartNode}->${e.node}`,
              source: edgeStartNode,
              target: e.node,
            };

            setEdges((prev: any[]) => [...prev, newEdge]);
            setIsDrawingEdge(false);
            setEdgeStartNode(null);
            setCursorPos(null);
          } else {
            // Begin edge drawing
            setIsDrawingEdge(true);
            setEdgeStartNode(e.node);
          }
          setSelectedNode(e.node);
          clickTimeout = null;
        }, 200);
      };

      const handleDoubleClickNode = (e: any) => {
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }

        e.preventSigmaDefault?.();
        e.original?.preventDefault?.();
        e.original?.stopPropagation?.();

        const nodeId = e.node;
        const nodeData = sigma.getGraph().getNodeAttributes(nodeId);
        setCurrentNode({ id: nodeId, data: nodeData });
        setShowNodeModal(true);
      };

      registerEvents({
        clickNode: handleClickNode,
        doubleClickNode: handleDoubleClickNode,
        downNode: (e) => {
          didDrag = false;
          setDraggedNode(e.node);
          sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
        },
        // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
        mousemovebody: (e) => {
          if (draggedNode) {
            didDrag = true;
            const pos = sigma.viewportToGraph(e);
            sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
            sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);
            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
          } else if (isDrawingEdge) {
            const pos = sigma.viewportToGraph(e);
            setCursorPos({ x: pos.x, y: pos.y });
          }
        },
        // On mouse up, we reset the autoscale and the dragging mode
        mouseup: () => {
          if (draggedNode) {
            setDraggedNode(null);
            sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
          }
        },
        // Disable the autoscale at the first down interaction
        mousedown: () => {
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        },
        // clickNode: (e) => {
        //   if (didDrag) return;
        //   setSelectedNode(e.node);
        // },
        clickStage: () => {
          if (isDrawingEdge) {
            setIsDrawingEdge(false);
            setEdgeStartNode(null);
            setCursorPos(null);
          } else {
            setSelectedNode("");
            setSelectedEdge("");
          }

          if (highlightedNode) {
            setHighlightedNode("");
          }
        },

        clickEdge: (e) => {
          if (didDrag) return;
          const [node1, node2]: string[] = e.edge.split("->");
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

      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsDrawingEdge(false);
          setEdgeStartNode(null);
          setCursorPos(null);
        }
      };

      window.addEventListener("keydown", handleEscKey);
      return () => {
        if (clickTimeout) clearTimeout(clickTimeout);
      };
    }, [
      registerEvents,
      sigma,
      draggedNode,
      edges,
      isDrawingEdge,
      edgeStartNode,
    ]);

    //Code taken from react sigma docs, used to hide edges not related to current selected node
    useEffect(() => {
      setSettings({
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };
          if (
            selectedNode != "" &&
            !graph.extremities(edge).includes(selectedNode)
          ) {
            newData.hidden = true;
          }
          return newData;
        },
      });
    }, [selectedNode, nodes, edges, setSettings, sigma]);

    useEffect(() => {
      if (!highlightedNode || highlightedNode === "") return;

      setSettings({
        nodeReducer: (node, data) => {
          return {
            ...data,
            color: node === highlightedNode ? "#FF0000" : data.color,
            zIndex: node === highlightedNode ? 999 : data.zIndex,
          };
        },
      });
    }, [highlightedNode, setSettings]);

    return null;
  };

  return (
    <div className="canvas-container">
      <SigmaContainer
        settings={{
          defaultEdgeType: "arrow",
          defaultEdgeColor: "black",
          allowInvalidContainer: true,
        }}
      >
        <Graph />
        <GraphEvents />
        <ControlsContainer position={"bottom-right"}>
          <ZoomControl />
        </ControlsContainer>
      </SigmaContainer>

      {/* Add the modal to your render output */}
      {showNodeModal && currentNode && (
        <NodeModal
          nodeId={currentNode.id}
          nodeData={currentNode.data}
          onClose={() => setShowNodeModal(false)}
          onSave={handleSaveNode}
        />
      )}
    </div>
  );
};

export default LoadGraphWithHook;
