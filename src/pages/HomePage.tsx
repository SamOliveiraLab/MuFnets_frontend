import Sidebar from '../components/Sidebar/Sidebar';
import { useState, useCallback } from 'react';

const HomePage = () => {
  return (
    <div className="homepage-layout">
      <Sidebar />
    </div>
  );
};

export default HomePage;
