import { Button } from '@mui/material';
import { NodesContext, EdgesContext } from '../../../pages/HomePage';
import { useContext } from 'react';

/* 
  Canvas Download Button
    This component is used to download the current 
    state of the canvas so users are able to save the
    current graph and load it using the upload button
    in the future
*/

const DownloadButton = () => {
  const { nodes }: any = useContext(NodesContext);
  const { edges }: any = useContext(EdgesContext);

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({
        nodes,
        edges,
        downloaded: true,
      })
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
  };

  return (
    <Button
      style={{ width: '80%', borderRadius: 30, fontSize: '.85rem' }}
      variant="contained"
      color="secondary"
      onClick={exportData}
    >
      Download
    </Button>
  );
};

export default DownloadButton;
