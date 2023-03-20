import Navbar from './components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const Root = () => {
  const [output, setOutput] = useState<any>('');

  const [prevGraph, setPrevGraph] = useState<any>(null);
  return (
    <>
      <Navbar />
      <main>
        <Outlet context={{ output, setOutput, prevGraph, setPrevGraph }} />
      </main>
    </>
  );
};

export default Root;
