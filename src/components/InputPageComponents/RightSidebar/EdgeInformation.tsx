import { MenuItem, Select, Typography, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import {
  Edge,
  EdgesContext,
  SelectedEdgeContext,
} from '../../../pages/HomePage';

/* 
  Edge Information
    This is a form that appears when there is an edge selected by the user. 
    The it displays the current settings of the edge and allows the user
    to modify the settings.
*/

const EdgeInformation = () => {
  const { selectedEdge }: any = useContext(SelectedEdgeContext);
  const { edges, setEdges }: any = useContext(EdgesContext);
  const [edgeSettings, setEdgeSettings]: any = useState({
    communicationType: 'long',
    communicationSpeed: 'fast',
  });

  useEffect(() => {
    const currentEdge = edges.filter((edge: Edge) => {
      return edge.name === selectedEdge[0];
    });
    setEdgeSettings(currentEdge[0].settings);
  }, [selectedEdge]);

  //Handling Submission for uni and bi directional connections
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const [source, target]: any = selectedEdge[0].split('->');
    // First get the edges that do not connect source and target
    const oldEdges = edges.filter((edge: Edge) => {
      return (
        edge.name !== `${source}->${target}` &&
        edge.name !== `${target}->${source}`
      );
    });

    // Get the edges with their old settings
    const newEdges = edges.filter((edge: Edge) => {
      return (
        edge.name === `${source}->${target}` ||
        edge.name === `${target}->${source}`
      );
    });

    // Map old edges with the updated settings
    const updatedSettings = newEdges.map((edge: Edge) => {
      return { ...edge, settings: edgeSettings };
    });
    setEdges([...oldEdges, ...updatedSettings]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="body1">
        Selected Edge:{' '}
        {selectedEdge.length === 2
          ? `${selectedEdge[0].charAt(0)}<->${selectedEdge[1].charAt(0)}`
          : selectedEdge[0]}
      </Typography>
      <Typography variant="h6">Type of Communication:</Typography>
      <Select
        value={edgeSettings.communicationType}
        onChange={(e) => {
          setEdgeSettings((prev: any) => {
            return { ...prev, communicationType: e.target.value };
          });
        }}
      >
        <MenuItem value="contact">Contact</MenuItem>
        <MenuItem value="short">Short Range</MenuItem>
        <MenuItem value="long">Long Range</MenuItem>
      </Select>
      <Typography variant="h6">Speed of Communication:</Typography>
      <Select
        value={edgeSettings.communicationSpeed}
        onChange={(e) => {
          setEdgeSettings((prev: any) => {
            return { ...prev, communicationSpeed: e.target.value };
          });
        }}
      >
        <MenuItem value="slow">Slow</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="fast">Fast</MenuItem>
      </Select>
      <Button variant="contained" type="submit">
        Save Changes
      </Button>
    </form>
  );
};

export default EdgeInformation;
