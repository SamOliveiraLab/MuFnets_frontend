import React from 'react';

const Bridge = (props: any) => {
  const { scale, data, source, target } = props;

  //data is passed in as x and y coordinates
  //to allow for the svg to draw properly, we have use the provided scale function
  const getPoints = () => {
    return data.reduce((accum: any, data: any) => {
      return [...accum, { x: scale.x(data.x), y: scale.y(data.y) }];
    }, []);
  };

  const x1 = getPoints()[0].x;
  const x2 = getPoints()[1].x;
  const y1 = getPoints()[0].y;
  const y2 = getPoints()[1].y;

  return (
    <svg>
      <line
        x1={x1 + 10}
        y1={y1}
        x2={x2 - 10}
        y2={y2}
        stroke="gray"
        strokeWidth={20}
      />
    </svg>
  );
};

export default Bridge;
