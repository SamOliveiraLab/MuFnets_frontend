import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';

const VictoryOutputDisplay = () => {
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);
  const { output }: any = useOutletContext();
  useEffect(() => {
    if (output != '') {
      const { predArray, topoOrder, orderedAdj, endpoints, unfolded } = output;
      const sources = Object.keys(orderedAdj);
      let nodeMappings: any = {};
      let xDomain: Number[] = [];
      topoOrder.forEach((node: any, index: any) => {
        xDomain.push(index);
        nodeMappings[node] = index;
      });

      const values = sources.map((source: string) => {
        const [row, target] = orderedAdj[source][0];
        return {
          name: `${source}->${target}`,
          data: [
            { x: nodeMappings[source], y: row },
            { x: nodeMappings[target], y: row },
          ],
        };
      });

      setCurrentNetwork({
        sources,
        values,
        xDomain,
        topoOrder,
        endpoints,
        unfolded,
        nodeMappings,
      });
    }
  }, [output]);

  return (
    currentNetwork && (
      <VictoryChart
        domainPadding={{ x: 5, y: 5 }}
        domain={{
          x: currentNetwork.xDomain,
          y: [1, Object.keys(currentNetwork.unfolded).length],
        }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: 'transparent' },
            ticks: { stroke: 'transparent' },
            tickLabels: { fill: 'transparent' },
          }}
        />
        {currentNetwork.topoOrder.map((cell: string) => {
          //Full Length for now, waiting on algorithm
          const endpoint = currentNetwork.endpoints[cell]
            ? currentNetwork.endpoints[cell]
            : Object.keys(currentNetwork.unfolded).length;
          console.log(cell + endpoint);
          return (
            <VictoryLine
              data={[
                {
                  x: currentNetwork.nodeMappings[cell],
                  y: Object.keys(currentNetwork.unfolded).length,
                },
                { x: currentNetwork.nodeMappings[cell], y: 0 },
              ]}
              style={{
                data: {
                  stroke: 'lightgray',
                  strokeWidth: 1,
                },
              }}
            />
          );
        })}
        {currentNetwork.values.map(({ name, data }: any) => {
          return (
            <VictoryLine
              data={data}
              style={{
                data: {
                  stroke: '#c43a31',
                  strokeWidth: 20,
                },
              }}
              labels={({ datum }) => {
                console.log(datum);
                return currentNetwork.topoOrder[datum.x];
              }}
            />
          );
        })}
      </VictoryChart>
    )
  );
};

export default VictoryOutputDisplay;
