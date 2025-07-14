import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useOutletContext } from "react-router-dom";

type NodeType = {
  id: string;
  type: string;
  label: string | null;
  col: number;
  row?: number;
};

type EdgeType = {
  source: string;
  target: string;
};

const iconMap: Record<string, string> = {
  Cell: "/cell_image.png",
  Pump: "/pump_image.png",
  MUX: "/mux_image.png",
  Media: "/media_image.png",
  Output: "/output_image.png",
};

const CELL_WIDTH = 200;
const CELL_HEIGHT = 80;
const PADDING_LEFT = 100;
const PADDING_TOP = 100;

const assignRowsFromColumns = (nodes: NodeType[]): NodeType[] => {
  const colMap = new Map<number, NodeType[]>();

  for (const node of nodes) {
    if (!colMap.has(node.col)) colMap.set(node.col, []);
    colMap.get(node.col)!.push(node);
  }

  const maxRowCount = Math.max(...[...colMap.values()].map((n) => n.length));
  const newNodes: NodeType[] = [];

  for (const [col, group] of colMap.entries()) {
    const count = group.length;
    if (count === 1) {
      newNodes.push({ ...group[0], row: Math.floor(maxRowCount / 2) });
    } else {
      group.forEach((node, i) => {
        const row = Math.round((i * (maxRowCount - 1)) / (count - 1));
        newNodes.push({ ...node, row });
      });
    }
  }

  return newNodes;
};

const D3GraphWithImages: React.FC = () => {
  const { output }: any = useOutletContext();
  let { nodes = [], edges = [] }: { nodes: NodeType[]; edges: EdgeType[] } =
    output ?? {};

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!nodes.length || !edges.length) return;

    nodes = assignRowsFromColumns(nodes); // 🔥 Patch in rows

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear

    const width = 1800;
    const height = 1200;
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g");
    const nodeMap = new Map(nodes.map((d) => [d.id, d]));

    // Arrow marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#333");

    // Draw curved edges
    g.selectAll("path.edge")
      .data(edges)
      .enter()
      .append("path")
      .attr("class", "edge")
      .attr("d", (d) => {
        const source = nodeMap.get(d.source);
        const target = nodeMap.get(d.target);
        if (
          !source ||
          !target ||
          source.row === undefined ||
          target.row === undefined
        )
          return "";

        const x1 = PADDING_LEFT + source.col * CELL_WIDTH;
        const y1 = PADDING_TOP + source.row * CELL_HEIGHT;
        const x2 = PADDING_LEFT + target.col * CELL_WIDTH;
        const y2 = PADDING_TOP + target.row * CELL_HEIGHT;

        const dx = (x2 - x1) / 2;
        const dy = (y2 - y1) / 2;
        const cx = x1 + dx;
        const cy = y1 + dy + 75; // boost curvature

        return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
      })
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("opacity", 0.7)
      .attr("marker-end", "url(#arrow)");

    // Draw node groups
    const nodeGroup = g
      .selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr(
        "transform",
        (d) =>
          `translate(${PADDING_LEFT + d.col * CELL_WIDTH}, ${
            PADDING_TOP + (d.row ?? 0) * CELL_HEIGHT
          })`
      );

    nodeGroup
      .append("image")
      .attr("xlink:href", (d) => iconMap[d.type] || "/icons/default.png")
      .attr("width", 40)
      .attr("height", 40)
      .attr("x", -20)
      .attr("y", -20);

    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333");
  }, [output]);

  return <svg ref={svgRef}></svg>;
};

export default D3GraphWithImages;
