import { Button } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

const OutputDownloadButton = () => {
  const { output }: any = useOutletContext();
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({
        ...output,
      })
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
  };
  return <Button onClick={exportData}>Download</Button>;
};

export default OutputDownloadButton;
