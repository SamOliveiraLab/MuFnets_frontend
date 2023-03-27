import { useState, useContext } from 'react';
import {
  NodesContext,
  EdgesContext,
  NodeColorsContext,
  Node,
} from '../../../pages/HomePage';
import { Button } from '@mui/material';
import { getMyColor } from '../../../scripts.js';

const UploadButton = () => {
  const { setNodes }: any = useContext(NodesContext);
  const { setEdges }: any = useContext(EdgesContext);
  const { setNodeColors }: any = useContext(NodeColorsContext);

  const handleUpload = (e: any) => {
    //code for reading in input json file
    const reader = new FileReader();
    reader.readAsText(e.target.files[0], 'UTF-8');
    reader.onload = (e: any) => {
      //Separate Nodes and Edges from the file
      const { nodes, edges, downloaded }: any = JSON.parse(e.target.result);

      if (downloaded) {
        const colors = nodes.reduce((accumulator: any, node: Node) => {
          return {
            ...accumulator,
            [node.name]: node.attributes.color,
          };
        }, {});

        setNodeColors(colors);
        setNodes(nodes);
        setEdges(edges);
      } else {
        const newNodes = nodes.map((node: any) => {
          const color = getMyColor();
          return {
            name: node,
            attributes: { x: 0, y: 0, label: node, color: color },
            settings: {
              height: 10,
            },
          };
        });

        //Create the edges list
        const newEdges = edges.map((edge: any) => {
          const [source, target]: any = edge.split('->');
          return {
            name: edge,
            source: source,
            target: target,
            settings: { communicationType: 'long', communicationSpeed: 'fast' },
          };
        });

        //Create the colors object
        const colors = newNodes.reduce((accumulator: any, node: Node) => {
          return {
            ...accumulator,
            [node.name]: node.attributes.color,
          };
        }, {});

        setNodeColors(colors);
        setNodes(newNodes);
        setEdges(newEdges);
      }
    };
  };

  return (
    <Button
      className="upload-button"
      variant="contained"
      component="label"
      color="secondary"
      style={{ width: '80%', borderRadius: 30, fontSize: '.85rem' }}
    >
      Upload Graph
      <input hidden type="file" accept=".json" onChange={handleUpload} />
    </Button>
  );
};

export default UploadButton;
