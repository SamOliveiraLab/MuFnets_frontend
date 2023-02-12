import { Typography, TextField, Button } from '@mui/material';
import { useState, useContext } from 'react';
import { NodesContext } from '../../pages/HomePage';
import './LeftSidebar.css';
import UploadButton from './UploadButton';

type SidebarProps = {};

const LeftSidebar = () => {
  const [name, setName] = useState<string>('');
  const { nodes, setNodes }: any = useContext(NodesContext);

  return (
    <div className="leftsidebar-container">
      <Typography variant="h3">Create Node</Typography>
      <form
        className="leftsidebar-form"
        onSubmit={(e) => {
          e.preventDefault();
          setNodes([
            ...nodes,
            {
              name: name,
              attributes: {
                x: 12,
                y: 1,
                label: `${name}`,
                size: 10,
              },
              settings: {
                height: 0,
              },
            },
          ]);
          setName('');
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Enter Node Name:"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={name === '' ? true : false}
          className="create-button"
        >
          Create
        </Button>
      </form>
      <UploadButton />
    </div>
  );
};

export default LeftSidebar;
