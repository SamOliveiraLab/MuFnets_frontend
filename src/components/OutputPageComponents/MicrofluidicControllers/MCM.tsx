import React from 'react';

const MCM = (props: any) => {
  const { node1, node2 } = props;
  return (
    <div className="MCM-container">
      <div>{node1}</div>
      <div>{node2}</div>
    </div>
  );
};

export default MCM;
