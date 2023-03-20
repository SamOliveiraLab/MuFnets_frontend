import { Button } from '@mui/material';
import { useContext } from 'react';
import {
  EdgesContext,
  NodesContext,
  Edge,
  Node,
} from '../../../pages/HomePage';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompileButton = () => {
  const { edges }: any = useContext(EdgesContext);
  const { nodes }: any = useContext(NodesContext);
  const { setOutput }: any = useOutletContext();
  const navigate = useNavigate();

  const handleCompile = () => {
    const outputEdges = edges.map(({ source, target, settings }: Edge) => {
      const comType = settings?.communicationType?.charAt(0).toUpperCase();
      return `${source}:${comType}:${target}:1`;
    });
    const outputNodes = nodes.map(({ name }: Node) => {
      return name;
    });
    const output = { Edges: outputEdges, Nodes: outputNodes };
    axios
      .post('http://127.0.0.1:5000', {
        graph: output,
      })
      .then((res) => {
        setOutput(JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    navigate('/output');
  };
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleCompile}
      disabled={edges.length === 0}
      style={{ width: '80%', borderRadius: 30, fontSize: '.85rem' }}
    >
      Compile
    </Button>
  );
};

export default CompileButton;
