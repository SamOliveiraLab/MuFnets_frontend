import LeftSidebar from '../components/LeftSideBar/LeftSidebar';
import Canvas from '../components/Canvas/Canvas';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import React, { useState } from 'react';

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
    size: number;
  };
  settings?: {
    height?: number;
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
  const [nodes, setNodes] = useState<Node[]>([
    {
      name: 'A',
      attributes: { x: 1, y: 1, label: 'A', size: 10 },
      settings: { height: 10 },
    },
    {
      name: 'B',
      attributes: { x: 7, y: 1, label: 'B', size: 10 },
      settings: {
        height: 0,
      },
    },
  ]);

  const [edges, setEdges] = useState<any>([
    {
      name: 'A->B',
      source: 'A',
      target: 'B',
      settings: { communicationType: 'long' },
    },
    {
      name: 'B->A',
      source: 'B',
      target: 'A',
      settings: { communicationType: 'long' },
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<string>('');
  const [selectedEdge, setSelectedEdge] = useState<string[]>([]);

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
