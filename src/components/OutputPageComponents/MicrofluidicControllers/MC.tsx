import React from 'react';

const MC = (props: any) => {
  const { scale, data, nodes } = props;

  //data is passed in as x and y coordinates
  //to allow for the svg to draw properly, we have use the provided scale function
  const getPoints = () => {
    return data.reduce((accum: any, data: any) => {
      return [...accum, { x: scale.x(data.x), y: scale.y(data.y) }];
    }, []);
  };

  const x1 = getPoints()[0].x;
  const y1 = getPoints()[0].y;

  return (
    <svg>
      <line
        x1={x1 + 10}
        y1={y1 + 10}
        x2={x1 + 50}
        y2={y1 + 10}
        stroke="beige"
        strokeWidth={20}
      />
      <foreignObject x={x1 + 15} y={y1 - 15} width={50} height={50}>
        <div
          style={{
            color: 'black',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p style={{ marginLeft: 5, fontSize: 10 }}>{nodes}</p>
        </div>
      </foreignObject>
    </svg>
  );
};

export default MC;
