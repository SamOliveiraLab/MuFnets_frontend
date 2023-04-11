import { VictoryContainer } from 'victory';
import MCM from '../MicrofluidicControllers/MCM';

const CustomLine = (props: any) => {
  const { x, y, data, scale } = props;

  const getPoints = (data: any) =>
    data.reduce((accumulator: any, { x, y }: any) => {
      return `${accumulator} ${scale.x(x)},${scale.y(y)}`;
    }, '');
  console.log(props);
  console.log(getPoints(data));

  // Define your custom SVG path here
  //   const d = `M ${data[0].x} ${data[0].y} L ${data[1].x} ${data[1].y}`;
  const d = 'M 0 0 L 1 1';

  console.log(d);
  return (
    <svg>
      <path d="M395,335 L74,33" stroke="red" />
      <foreignObject>
        <MCM node1="a" node2="b" />
      </foreignObject>
    </svg>
  );
};

export default CustomLine;
