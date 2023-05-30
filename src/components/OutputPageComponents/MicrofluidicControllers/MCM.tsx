import React from 'react';
import { VictoryLineProps } from 'victory';

const MCM = (props: any) => {
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
        stroke="beige"
        strokeWidth={20}
      />
      <foreignObject x={x1 + 10} y={y1 - 10} width={x2 - x1} height={20}>
        <div
          style={{
            color: 'black',
            width: x2 - x1,
            height: 20,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p style={{ marginLeft: 5, fontSize: 10 }}>{source}</p>
        </div>
      </foreignObject>
      <foreignObject x={x1 + 10} y={y1 - 10} width={x2 - x1 - 20} height={20}>
        <div
          style={{
            color: 'black',
            width: x2 - x1 - 20,
            height: 20,
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          <p style={{ marginRight: 5, fontSize: 10 }}>{target}</p>
        </div>
      </foreignObject>
    </svg>
  );
};

export default MCM;
