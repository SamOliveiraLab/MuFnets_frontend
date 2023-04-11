import { Button } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { useScreenshot, createFileName } from 'use-react-screenshot';

const OutputDownloadButton = ({ screenshotRef }: any) => {
  const { output }: any = useOutletContext();
  const [image, takeScreenShot] = useScreenshot({
    type: 'image/jpeg',
    quality: 1.0,
  });

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

    const download = (image: any, { name = 'img', extension = 'jpg' } = {}) => {
      const a = document.createElement('a');
      a.href = image;
      a.download = createFileName(extension, name);
      a.click();
    };
    takeScreenShot(screenshotRef.current).then(download);
  };

  return <Button onClick={exportData}>Download</Button>;
};

export default OutputDownloadButton;
