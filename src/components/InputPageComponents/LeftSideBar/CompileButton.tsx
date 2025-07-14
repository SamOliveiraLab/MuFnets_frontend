import { Button } from "@mui/material";
import { useContext, useState } from "react";
import {
  EdgesContext,
  NodesContext,
  allNodesContext,
  Edge,
  Node as HomePageNode,
} from "../../../pages/HomePage";
import { useOutletContext, useNavigate } from "react-router-dom";
import Select from "react-select";
import { SelectedTypeContext } from "../../../App";

const CompileButton = () => {
  const { selectedType, setSelectedType }: any =
    useContext(SelectedTypeContext);

  const options = [
    {
      value: "milifluidics",
      label: "Milifluidics",
    },
    {
      value: "hybrid",
      label: "Hybrid",
    },
    {
      value: "monolayer",
      label: "Monolayer"
    }
  ];
  const { allNodesData }: any = useContext(allNodesContext);
  const { edges }: any = useContext(EdgesContext);
  const { nodes }: any = useContext(NodesContext);
  const { setOutput }: any = useOutletContext();
  const navigate = useNavigate();

  const handleCompile = () => {
    switch (selectedType) {

      // case 1
      case "milifluidics":
        fetch("http://localhost:5050/milifluidic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allNodesData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Design result from backend:", data);
            setOutput(data);

            // TODO: you can store or visualize it here
          })
          .catch((error) => {
            console.error("Error sending data to backend bigdick:", error);
          });
        
        navigate("/output");
        break;
      
      // case 2
      case "hybrid":
        fetch("http://localhost:5050/hybrid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allNodesData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Design result from backend:", data);
            // setOutput(data);

            // TODO: you can store or visualize it here
          })
          .catch((error) => {
            console.error("Error sending data to backend bigdick:", error);
          });
        
        // navigate("/output");
        break;

        
      // Case 3
      case "monolayer":
        // 1. Transform nodes/edges into the required format
        const outputNodes = nodes.map(({ name }: HomePageNode) => name);
        // 2. Create predArray with contact type information
        const predArray: Record<string, [string, string]> = {};
        edges.forEach(({ source, target, settings }: Edge) => {
          const contactType = settings?.communicationType
            ?.charAt(0)
            .toUpperCase();
          predArray[target] = [source, contactType];
        });
        // 3. Create orderedAdj with row information
        const orderedAdj: Record<string, [number][]> = {};
        outputNodes.forEach((node, index) => {
          orderedAdj[node] = [[index]]; // Using index as row number
        });
        // 4. Compute topological order using Kahn's Algorithm (improved version)
        const inDegree: Record<string, number> = {};
        const topoOrder: string[] = [];
        const adjList: Record<string, string[]> = {};
        // Initialize
        outputNodes.forEach((node) => {
          inDegree[node] = 0;
          adjList[node] = [];
        });
        // Build adjacency list and in-degree count
        edges.forEach(({ source, target }: Edge) => {
          adjList[source].push(target);
          inDegree[target]++;
        });
        // Kahn's algorithm
        const queue = outputNodes.filter((node) => inDegree[node] === 0);
        while (queue.length > 0) {
          const node = queue.shift()!;
          topoOrder.push(node);

          adjList[node].forEach((neighbor) => {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
              queue.push(neighbor);
            }
          });
        }
        // 5. Identify endpoints (nodes with no incoming or outgoing edges)
        const startNodes = outputNodes.filter(
          (node) => !edges.some((e: Edge) => e.target === node)
        );
        const endNodes = outputNodes.filter(
          (node) => !edges.some((e: Edge) => e.source === node)
        );
        const endpoints = [...new Set([...startNodes, ...endNodes])];
        //6. Create unfolded structure with device types
        const unfolded: Record<
          number,
          Array<[string, string, string, string]>
        > = {};
        // Group edges by source node's topological order position
        topoOrder.forEach((node, row) => {
          const nodeEdges = edges.filter((e: Edge) => e.source === node);
          if (nodeEdges.length > 0) {
            unfolded[row] = nodeEdges.map(
              ({ source, target, settings }: Edge) => {
                // Determine device type based on node naming pattern
                let deviceType = "MFM"; // Default
                if (source.startsWith("mc") || target.startsWith("mc")) {
                  deviceType = "MCM";
                } else if (source.startsWith("br") || target.startsWith("br")) {
                  deviceType = "bridge";
                } else if (settings?.communicationType?.toLowerCase() === "control") {
                  deviceType = "MC";
                }
                return [
                  source,
                  target,
                  settings?.communicationType || "data",
                  deviceType,
                ];
              }
            );
          }
        });
        // 7. Set the complete output structure
        setOutput({
          selectedType,
          predArray,
          topoOrder,
          orderedAdj,
          endpoints,
          unfolded,
          // Additional properties from original implementation
          hasCycle: topoOrder.length !== outputNodes.length, // Cycle detection
          shortestPathArray: [], // You might want to implement this
        });

        navigate("/output");
    }
  };

  return (
    <div>
      <Select defaultValue={options[0]} onChange={option => setSelectedType(option.value)} options={options} />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleCompile}
        disabled={edges.length === 0}
        style={{
          width: "90%",
          borderRadius: 30,
          fontSize: ".85rem",
          marginBottom: "10px",
        }}
      >
        Compile
      </Button>
    </div>
  );
};

export default CompileButton;

