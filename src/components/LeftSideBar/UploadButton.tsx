import React from 'react';
import { Button } from '@mui/material';

const UploadButton = () => {
  return (
    <Button variant="contained" component="label">
      Upload Graph
      <input
        hidden
        type="file"
        accept=".json"
        onChange={(e) => {
          console.log(e.target.files);
        }}
      />
    </Button>
  );
};

export default UploadButton;
