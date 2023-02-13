import { Button } from '@mui/material';
import { useContext } from 'react';
import { EdgesContext, NodesContext } from '../../pages/HomePage';

const CompileButton = () => {
  const { edges }: any = useContext(EdgesContext);
  const { nodes }: any = useContext(NodesContext);

  const handleCompile = () => {
    console.log(edges);
    console.log(nodes);
  };
  return (
    <Button variant="contained" color="secondary" onClick={handleCompile}>
      Compile
    </Button>
  );
};

export default CompileButton;
