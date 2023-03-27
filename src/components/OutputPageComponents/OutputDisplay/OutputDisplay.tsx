import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from 'recharts';

const OutputDisplay = () => {
  const { output }: any = useOutletContext();
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);
  useEffect(() => {
    if (output != '') {
      const [predArray, topoOrder, orderedAdj, endpoints, unfolded] =
        JSON.parse(output);
      const sources = Object.keys(orderedAdj);
      const values = sources.map((key: string) => {
        const [row, target] = orderedAdj[key][0];
        return {
          name: `${key}->${target}`,
          data: [
            { category: key, value: row },
            { category: target, value: row },
          ],
        };
      });

      setCurrentNetwork({ values, topoOrder, endpoints });
    }
  }, [output]);

  return (
    <div className="display-container">
      {currentNetwork && (
        <LineChart
          width={730}
          height={500}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <XAxis
            orientation="top"
            dataKey="category"
            type="category"
            allowDuplicatedCategory={false}
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            orientation="left"
            dataKey="value"
            reversed
            padding={{ top: 30, bottom: 30 }}
          />
          {currentNetwork.topoOrder.map((cell: string) => {
            //Full Length for now, waiting on algorithm
            const endpoint = currentNetwork.endpoints[cell]
              ? currentNetwork.endpoints[cell]
              : currentNetwork.values.length - 1;
            console.log(cell + endpoint);
            return (
              <ReferenceLine
                segment={[
                  { x: cell, y: 0 },
                  { x: cell, y: 4 },
                ]}
              />
            );
          })}
          {currentNetwork.values.map((connection: any) => {
            return (
              <Line
                type="monotone"
                dataKey="value"
                data={connection.data}
                key={connection.name}
                strokeWidth={10}
              />
            );
          })}
        </LineChart>
      )}
    </div>
  );
};

export default OutputDisplay;
