export function algorithm(root, nodes, adjList) {
  let PI = {};
  let topoSorted = {};
  let ordered = {};

  if (adjList == null) {
    return null;
  }

  // 1 Populate predecessor array
  for (let i = 0; i < adjList.length; i++) {
    const temp = adjList[i].split(':');
    const src = temp[0];
    const dest = temp[2];

    let numType = null;
    if (temp[1] === 'C') {
      numType = 0;
    } else if (temp[1] === 'S') {
      numType = 1;
    } else if (temp[1] === 'L') {
      numType = 2;
    }

    if (PI[src] === undefined) {
      PI[src] = [null, null, 0];
    }
    PI[dest] = [src, temp[1], 0];
  }

  // 2 Determine if MST connects to all nodes (no need to check for cycles for MST)
  const mst = MinimumSpanningTree(root, adjList);

  // 3 Run Topological Sort & Adjecency List Algorithms
  topoSorted = TopologicalSort(PI);
  const parsedAdjList = CreateSortedAdjList(PI);

  // 4 Get completed mapping
  const temp_topoSorted = [...topoSorted];
  while (temp_topoSorted.length > 0) {
    const temp = temp_topoSorted.pop();
    if (ordered[temp] === undefined) {
      ShortestBranch(parsedAdjList, temp, 0, ordered);
    }
  }
  Optimize(ordered);

  // 5 Unfold completed mapping
  const [endpoints, unfolded] = PostProcess(root, ordered, topoSorted);

  // 6 identify devices
  // 7 Return values
  console.log('predecessor array\t', PI);
  console.log('topological sorted\t', topoSorted);
  console.log('ordered adj list \t', ordered);
  console.log('endpoints \t\t', endpoints);
  console.log('unfolded adj list\t', unfolded);
  return [PI, topoSorted.slice(-1), ordered, endpoints, unfolded];
}

function MinimumSpanningTree(root, str_adjList) {
  let kv_adjList = {};

  // Parse adjlist
  for (let edge of str_adjList) {
    let temp = edge.split(':');
    let src = temp[0];
    let t = temp[1];
    let dest = temp[2];

    if (kv_adjList[src] == null) {
      kv_adjList[src] = [];
    }

    kv_adjList[src].push([dest, t, 0]);
  }

  // Run BFS
  let Q = [root];
  let minSpanningTree = [];
  let visited = [];
  let edges = [];

  // while the Queue is not empty
  while (Q.length > 0) {
    // pop the first element
    let parent = Q.shift();

    if (kv_adjList[parent] == null) {
      continue;
    }

    let children = kv_adjList[parent];

    // enqueue each child from parent node into the queue
    while (children.length > 0) {
      let [child, t, _] = children.shift();
      if (!visited.includes(child) && !Q.includes(child)) {
        Q.push(child);

        if (
          !edges.includes([parent, child]) &&
          !edges.includes([child, parent])
        ) {
          edges.push([parent, child]);
          minSpanningTree.push(`${parent}:${t}:${child}:0`);
        }
      }
    }

    // mark parent as visited, then repeat until Queue is empty
    visited.push(parent);
  }

  return minSpanningTree;
}

function TopologicalSort(PI) {
  let stack = [];
  for (let k in PI) {
    let a = k;
    while (a != null) {
      if (stack.includes(a)) {
        stack.splice(stack.indexOf(a), 1);
      }
      stack.push(a);
      let [child] = PI[a];
      a = child;
    }
  }
  return stack;
}

function CreateSortedAdjList(PI) {
  let newAdjList = {};
  for (let child in PI) {
    let [parent] = PI[child];
    if (parent != null) {
      if (newAdjList[parent] == null) {
        newAdjList[parent] = [];
      }
      newAdjList[parent].push(child);
    }
  }
  return newAdjList;
}

function ShortestBranch(network, src, distance, ordered) {
  let d = distance;
  if (network[src] == null) {
    return distance;
  } else {
    while (network[src].length > 0) {
      let nextSrc = network[src].shift();
      d = ShortestBranch(network, nextSrc, distance + 1, ordered);
      if (ordered[src] == null) {
        ordered[src] = [];
      }
      ordered[src].push([d - distance, nextSrc]);
    }
    return d;
  }
}

function Optimize(ordered) {
  for (let key in ordered) {
    ordered[key].sort();
  }
}

function printInfo(self) {
  console.log(`predecessor:\t\t${self.PI}`);
  console.log(`topological sort:\t${self.topoSorted}`);
  console.log(`complete adj list:\t${self.ordered}`);
}

function PostProcess(root, cellInfo, cellIndex) {
  // getting end points
  // Format {"A":[(1,"B"),(2,"C")], "B":[(1,"D"),(2,"E")]}

  function updateChildren(key, parentIdx, cellInfo) {
    if (cellInfo[key] != undefined) {
      let childrenList = cellInfo[key];
      let newChildrenList = [];

      // console.log(key, cellInfo);

      for (let i = 0; i < childrenList.length; i++) {
        let offset = childrenList[i][0];
        let child = childrenList[i][1];
        newChildrenList.push([offset + parentIdx, child]);
      }

      cellInfo[key] = newChildrenList;

      console.log(newChildrenList);
      let offset = Math.max(newChildrenList);
      while (childrenList.length) {
        let [childIdx, newChild] = childrenList.shift();
        updateChildren(newChild, offset, cellInfo);
      }
    }
  }

  function getEndPoints(key, endpoints, cellInfo) {
    if (cellInfo[key] != undefined) {
      let extent = Math.max(cellInfo[key]);
      endpoints[key] = extent;

      // console.log(key, extent);
      let cpy = cellInfo[key].slice();
      while (cpy.length) {
        let [row, child] = cpy.shift();

        if (cellInfo[child] == undefined) {
          endpoints[child] = row;
        }

        endpoints = getEndPoints(child, endpoints, cellInfo);
      }
    }

    return endpoints;
  }

  function unfoldAdjList(adjList) {
    // Format {"A":[(1,"B"),(2,"C")], "B":[(3,"D"),(4,"E")]}
    // to  unfolded = [[A, B], [A, C], [B, D], [B, E]]
    //
    // then just do a simple: if cell in unfolded[row] {}

    let unfoldedList = {};
    let keys = Object.keys(adjList);

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      for (let j = 0; j < adjList[key].length; j++) {
        let row = adjList[key][j][0];
        let child = adjList[key][j][1];
        if (unfoldedList[row] == undefined) {
          unfoldedList[row] = [];
        }
        unfoldedList[row].push(key);
        unfoldedList[row].push(child);
      }
    }

    return unfoldedList;
  }
  // console.log(Math.max([[1,"P"],[9,"d"]]));

  // console.log("heap", cellInfo);
  updateChildren(root, 0, cellInfo);
  // console.log("heap", cellInfo);

  let endpoints = getEndPoints(root, {}, cellInfo);
  // console.log("endpoint", endpoints);
  let unfolded = unfoldAdjList(cellInfo);
  // console.log("unfolded list", unfolded);

  return [endpoints, unfolded];
}

const edges = [
  'c1:L:v1:1',
  'c1:L:co1:1',
  'c3:L:co2:1',
  'c3:L:co1:1',
  'v1:L:c3:1',
  'v1:L:c2:1',
  'v2:L:c2:1',
  'v2:L:c3:1',
  'co1:L:c2:1',
  'co2:L:c1:1',
];
const nodes = ['c1', 'c2', 'c3', 'v1', 'v2', 'co1', 'co2'];
console.log(algorithm('c1', nodes, edges));
