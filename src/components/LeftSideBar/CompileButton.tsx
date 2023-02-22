import { Button } from '@mui/material';
import { useContext } from 'react';
import { EdgesContext, NodesContext, Edge, Node } from '../../pages/HomePage';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompileButton = () => {
  const { edges }: any = useContext(EdgesContext);
  const { nodes }: any = useContext(NodesContext);
  const { setOuput }: any = useOutletContext();
  const navigate = useNavigate();

  const handleCompile = () => {
    const outputEdges = edges.map(({ source, target, settings }: Edge) => {
      const comType = settings?.communicationType?.charAt(0).toUpperCase();
      return `${source}:${comType}:${target}:1`;
    });
    const outputNodes = nodes.map(({ name, settings }: Node) => {
      return { name, settings };
    });
    const output = { Edges: outputEdges, Nodes: outputNodes };
    // const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    //   JSON.stringify(output)
    // )}`;
    // const link = document.createElement('a');
    // link.href = jsonString;
    // link.download = 'data.json';
    // link.click();
    setOuput(JSON.stringify(output));
    console.log(JSON.stringify(output));
    axios
      .post('http://127.0.0.1:5000', {
        graph: output,
      })
      .then((res) => {
        console.log(res);
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
    >
      Compile
    </Button>
  );
};

export default CompileButton;
