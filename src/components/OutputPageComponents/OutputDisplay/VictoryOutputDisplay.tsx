import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MFM from '../MicrofluidicControllers/MFM';
import MCM from '../MicrofluidicControllers/MCM';
import MC from '../MicrofluidicControllers/MC';
import FlowPipe from '../MicrofluidicControllers/FlowPipe';
import Bridge from '../MicrofluidicControllers/Bridge';

/* 
  Victory Output Display
    This maps the output of the algorithm to a modified line chart to display the output result
    The line chart is created using the victory library that has highly customizable components
*/

const VictoryOutputDisplay = () => {
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);
  const { output }: any = useOutletContext();

  useEffect(() => {
    if (output != '') {
      const { predArray, topoOrder, orderedAdj, endpoints, unfolded } = output;
      console.log(output);
      //nodeToNumber will map each node to a numerical x value that will be used to determine the axis as well as for mapping the custom svgs based on length
      let correctOrder = topoOrder && Array.isArray(topoOrder) ? topoOrder.reverse() : [];
      let mcList = {};
      let endMC = null;

      //checking for MCS and adjusting columns based on whether or not there are MCS
      for (const target in predArray) {
        const [source, contactType, _] = predArray[target];
        if (contactType == 'C') {
          const targetIndex = correctOrder.indexOf(target);
          const valuesBeforeTarget = correctOrder.slice(0, targetIndex);
          const valuesAfterTarget = correctOrder.slice(targetIndex + 1);

          correctOrder = [...valuesBeforeTarget, ...valuesAfterTarget];
          const sourceIndex = correctOrder.indexOf(source);
          const valuesBeforeSource = correctOrder.slice(0, sourceIndex);
          const valuesAfterSource = correctOrder.slice(sourceIndex + 1);

          correctOrder = [
            ...valuesBeforeSource,
            `${source}/${target}`,
            ...valuesAfterSource,
          ];

          if (valuesAfterSource.length == 0) {
            correctOrder = [...correctOrder, 'output'];
            endMC = `${source}/${target}`;
          }

          mcList = { ...mcList, [source]: target, [target]: source };
        }
      }

      let nodeToNumber: any = {};

      //Assigning each node a integer value based on its index in the topological order
      correctOrder.forEach((node: any, index: any) => {
        //means we have an MC column
        const [source, target] = node.split('/');
        nodeToNumber[source] = index;
        if (target) {
          nodeToNumber[target] = index;
        }
      });

      const xDomain = correctOrder.map((node: string) => {
        const [mc1, mc2] = node.split('/');
        return nodeToNumber[mc1];
      });

      //Creating this object to be held in state so that we are able to create labels for the flow pipes
      let numberToNode = Object.keys(nodeToNumber).reduce((obj, key) => {
        if (key in mcList) {
          if (!(nodeToNumber[key] in obj)) {
            if (`${key}/${mcList[key]}` in correctOrder) {
              return { ...obj, [nodeToNumber[key]]: `${key}/${mcList[key]}` };
            } else {
              return { ...obj, [nodeToNumber[key]]: `${mcList[key]}/${key}` };
            }
          }
          return { ...obj };
        } else {
          return { ...obj, [nodeToNumber[key]]: key };
        }
      }, {});

      let MCMS: any[] = [];
      let MFMS: any[] = [];
      let MCS: any[] = [];
      let Bridges: any[] = [];

      for (const row in unfolded) {
        unfolded[row].forEach((connection: any) => {
          const [source, target, communication, deviceType] = connection;

          // based on the formatting of output from algorithm
          if (deviceType != 'MC') {
            const [row, _] = orderedAdj[source][0];
            switch (deviceType) {
              case 'MFM':
                MFMS = [
                  ...MFMS,
                  {
                    source: source,
                    target: target,
                    data: [
                      { x: nodeToNumber[source], y: row },
                      { x: nodeToNumber[target], y: row },
                    ],
                  },
                ];
                break;
              case 'MCM':
                MCMS = [
                  ...MCMS,
                  {
                    source: source,
                    target: target,
                    data: [
                      { x: nodeToNumber[source], y: row },
                      { x: nodeToNumber[target], y: row },
                    ],
                  },
                ];
                break;
              case 'bridge':
                Bridges = [
                  ...Bridges,
                  {
                    source: source,
                    target: target,
                    data: [
                      { x: nodeToNumber[source], y: row },
                      {
                        x:
                          endMC == `${source}/${target}`
                            ? nodeToNumber[target] + 1
                            : nodeToNumber[target],
                        y: row,
                      },
                    ],
                  },
                ];
                break;
            }
          } else {
            MCS = [
              ...MCS,
              {
                source: source,
                target: target,
                data: [
                  { x: nodeToNumber[target], y: row },
                  { x: nodeToNumber[target], y: row },
                ],
              },
            ];
          }
        });
      }

      setCurrentNetwork({
        xDomain,
        correctOrder,
        topoOrder,
        endpoints,
        unfolded,
        nodeToNumber,
        numberToNode,
        MCS,
        MCMS,
        MFMS,
        Bridges,
      });
    }
  }, [output]);

  return (
    currentNetwork && (
      <div style={{ width: '75vw', height: 'auto' }}>
        <VictoryChart
          domainPadding={20}
          singleQuadrantDomainPadding={false}
          padding={20}
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
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'transparent' },
              ticks: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent' },
            }}
          />
          {currentNetwork.correctOrder.map((cell: string) => {
            const [node1, node2] = cell.split('/');

            //Full Length for now, waiting on algorithm
            return (
              <VictoryLine
                data={[
                  {
                    x: currentNetwork.nodeToNumber[node1],
                    y: Object.keys(currentNetwork.unfolded).length,
                  },
                  { x: currentNetwork.nodeToNumber[node1], y: 0 },
                ]}
                style={{
                  data: {
                    stroke: 'lightgray',
                    strokeWidth: 1,
                  },
                }}
                labels={({ datum }) => {
                  if (datum.y === Object.keys(currentNetwork.unfolded).length) {
                    return currentNetwork.numberToNode[datum.x];
                  }
                }}
                dataComponent={
                  <FlowPipe numberToNode={currentNetwork.numberToNode} />
                }
              />
            );
          })}
          {currentNetwork.MCMS.map(({ source, target, data }: any) => {
            return (
              <VictoryLine
                data={data}
                style={{
                  data: {
                    stroke: '#c43a31',
                    strokeWidth: 20,
                  },
                }}
                dataComponent={<MCM source={source} target={target} />}
              />
            );
          })}
          {currentNetwork.MFMS.map(({ source, target, data }: any) => {
            return (
              <VictoryLine
                data={data}
                style={{
                  data: {
                    stroke: '#c43a31',
                    strokeWidth: 20,
                  },
                }}
                dataComponent={<MFM source={source} target={target} />}
              />
            );
          })}
          {currentNetwork.Bridges.map(({ source, target, data }: any) => {
            return (
              <VictoryLine
                data={data}
                style={{
                  data: {
                    stroke: '#c43a31',
                    strokeWidth: 20,
                  },
                }}
                dataComponent={<Bridge source={source} target={target} />}
              />
            );
          })}
          {currentNetwork.MCS.map(({ source, target, data }: any) => {
            console.log(source, target);
            return (
              <VictoryLine
                data={data}
                style={{
                  data: {
                    stroke: '#c43a31',
                    strokeWidth: 20,
                  },
                }}
                dataComponent={<MC source={source} target={target} />}
              />
            );
          })}
        </VictoryChart>
      </div>
    )
  );
};

export default VictoryOutputDisplay;