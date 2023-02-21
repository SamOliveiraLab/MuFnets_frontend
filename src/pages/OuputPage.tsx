import React from 'react';
import { useOutletContext } from 'react-router-dom';

const OuputPage = () => {
  const { output }: any = useOutletContext();
  return <div>{output}</div>;
};

export default OuputPage;
