import { Typography, TextField, Button } from '@mui/material';
import { useState, useContext } from 'react';
import { NodesContext } from '../../pages/HomePage';
import CompileButton from './CompileButton';
import UploadButton from './UploadButton';
import './LeftSidebar.css';

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
                x: 0,
                y: 0,
                label: `${name}`,
              },
              settings: {
                height: 10,
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
      <div className="buttons-container">
        <UploadButton />
        <CompileButton />
      </div>
    </div>
  );
};

export default LeftSidebar;
