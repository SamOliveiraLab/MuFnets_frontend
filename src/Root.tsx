import Navbar from './components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const Root = () => {
  const [output, setOuput] = useState<any>(
    'No output yet, compile a graph to view its output'
  );

  const [prevGraph, setPrevGraph] = useState<any>(null);
  return (
    <>
      <Navbar />
      <main>
        <Outlet context={{ output, setOuput, prevGraph, setPrevGraph }} />
      </main>
    </>
  );
};

export default Root;
