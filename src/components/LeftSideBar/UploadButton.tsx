import { useState, useContext } from 'react';
import { NodesContext, EdgesContext } from '../../pages/HomePage';
import { Button } from '@mui/material';

const UploadButton = () => {
  const { setNodes }: any = useContext(NodesContext);
  const { setEdges }: any = useContext(EdgesContext);

  const handleUpload = (e: any) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0], 'UTF-8');
    reader.onload = (e: any) => {
      const { nodes, edges }: any = JSON.parse(e.target.result);
      const newNodes = nodes.map((node: any) => {
        return {
          name: node,
          attributes: { x: 0, y: 0, label: node },
          settings: {
            height: 10,
          },
        };
      });
      const newEdges = edges.map((edge: any) => {
        const [source, target]: any = edge.split('->');
        return {
          name: edge,
          source: source,
          target: target,
          settings: { communicationType: 'long' },
        };
      });
      setEdges(newEdges);
      setNodes(newNodes);
    };
  };
  return (
    <Button variant="contained" component="label" color="secondary">
      Upload Graph
      <input hidden type="file" accept=".json" onChange={handleUpload} />
    </Button>
  );
};

export default UploadButton;
