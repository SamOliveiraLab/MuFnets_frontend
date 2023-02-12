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

      <Button variant="contained" type="submit">
        Save Changes
      </Button>
    </form>
  );
};

export default NodeInformation;
