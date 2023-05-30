const FlowPipe = (props: any) => {
  const { scale, data, numberToNode } = props;

  const getPoints = () => {
    return data.reduce((accum: any, data: any) => {
      return [...accum, { x: scale.x(data.x), y: scale.y(data.y) }];
    }, []);
  };

  const x1 = getPoints()[0].x;
  const y1 = getPoints()[0].y;
  const x2 = getPoints()[1].x;
  const y2 = getPoints()[1].y;

  return (
    <svg>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="lightgray"
        strokeWidth={20}
      />
      {/* <line
        x1={x1}
        y1={y1 + 50}
        x2={x2}
        y2={y2 - 50}
        stroke="black"
        markerEnd="url(#arrow)"
      /> */}
    </svg>
  );
};

export default FlowPipe;
