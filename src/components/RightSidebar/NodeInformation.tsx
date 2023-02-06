import { useContext, useEffect, useState } from 'react';
import { Typography, TextField, Select, MenuItem, Button } from '@mui/material';
import { SelectedNodeContext, NodesContext, Node } from '../../pages/HomePage';

const NodeInformation = () => {
  const { selectedNode }: any = useContext(SelectedNodeContext);
  const { nodes, setNodes }: any = useContext(NodesContext);
  const [nodeInfo, setNodeInfo]: any = useState({
    height: 0,
    contactType: 'off',
    communicationType: 'short',
    signalDirectionality: 'uni',
  });

  useEffect(() => {
    const node = nodes.filter((node: Node) => {
      return node.name === selectedNode;
    });
    setNodeInfo(node[0].settings);
  }, [selectedNode]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const prevNodes = nodes.filter((node: Node) => {
          return node.name != selectedNode;
        });
        const oldNode = nodes.filter((node: Node) => {
          return node.name === selectedNode;
        });
        const newNode = { ...oldNode[0], settings: nodeInfo };
        setNodes([...prevNodes, newNode]);
      }}
    >
      <Typography
        variant="h6"
        onClick={() => {
          console.log(nodeInfo);
        }}
      >
        Height:
      </Typography>
      <TextField
        value={nodeInfo.height && nodeInfo.height}
        onChange={(e) => {
          setNodeInfo((prev: any) => {
            return { ...prev, height: e.target.value };
          });
        }}
      />
      <Typography variant="h6">Type of Contact:</Typography>
      <Select
        value={nodeInfo.contactType}
        onChange={(e) => {
          setNodeInfo((prev: any) => {
            return { ...prev, contactType: e.target.value };
          });
        }}
      >
        <MenuItem value="on">On</MenuItem>
        <MenuItem value="off">Off</MenuItem>
      </Select>
      <Typography variant="h6">Type of Communication:</Typography>
      <Select
        value={nodeInfo.communicationType}
        onChange={(e) => {
          setNodeInfo((prev: any) => {
            return { ...prev, communicationType: e.target.value };
          });
        }}
      >
        <MenuItem value="short">Short Range</MenuItem>
        <MenuItem value="long">Long Range</MenuItem>
      </Select>
      <Typography variant="h6">Signal Directionality:</Typography>
      <Select
        value={nodeInfo.signalDirectionality}
        onChange={(e) => {
          setNodeInfo((prev: any) => {
            return { ...prev, signalDirectionality: e.target.value };
          });
        }}
      >
        <MenuItem value="uni">Unidirectional</MenuItem>
        <MenuItem value="bi">Bidirectional</MenuItem>
      </Select>
      <Button variant="contained" type="submit">
        Save Changes
      </Button>
    </form>
  );
};

export default NodeInformation;
