import LeftSidebar from '../components/LeftSideBar/LeftSidebar';
import Canvas from '../components/Canvas/Canvas';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export const NodesContext: any = React.createContext([]);
export const EdgesContext: any = React.createContext([]);
export const SelectedNodeContext: any = React.createContext('');
export const SelectedEdgeContext: any = React.createContext('');

export type Node = {
  name: string;
  attributes: {
    x: number;
    y: number;
    label: string;
    color: string;
  };
  settings: {
    height: number;
  };
};

export type Edge = {
  name: string;
  source: string;
  target: string;
  settings?: {
    communicationType?: string;
  };
};

const HomePage = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<any>([]);
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [selectedEdge, setSelectedEdge] = useState<string[]>([]);
  const { prevGraph, setPrevGraph }: any = useOutletContext();
  useEffect(() => {
    if (prevGraph) {
      const { prevEdges, prevNodes }: any = prevGraph;
      setEdges(prevEdges);
      setNodes(prevNodes);
    }
  }, []);

  useEffect(() => {
    setPrevGraph({ prevEdges: edges, prevNodes: nodes });
  }, [nodes, edges]);

  return (
    <SelectedEdgeContext.Provider value={{ selectedEdge, setSelectedEdge }}>
      <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
        <EdgesContext.Provider value={{ edges, setEdges }}>
          <NodesContext.Provider value={{ nodes, setNodes }}>
            <div className="homepage-layout">
              <LeftSidebar />
              <Canvas />
              <RightSidebar />
            </div>
          </NodesContext.Provider>
        </EdgesContext.Provider>
      </SelectedNodeContext.Provider>
    </SelectedEdgeContext.Provider>
  );
};

export default HomePage;
