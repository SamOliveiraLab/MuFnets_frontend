import { Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import './Sidebar.css';

type SidebarProps = {};

const Sidebar = () => {
  const [name, setName] = useState<string>('');

  return (
    <div style={{ flex: 1 }}>
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={(e) => {
          e.preventDefault();
          setName('');
        }}
      >
        <Typography variant="h2">Create Node</Typography>
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
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default Sidebar;
