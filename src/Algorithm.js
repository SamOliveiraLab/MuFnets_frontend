export class Node {
  constructor(name) {
      this.name = name;
      this.neighbors = [];
  }

  addNeighbor(node) {
      this.neighbors.push(node);
  }

  dfs(visitedSet = new Set()) {
    if (visitedSet.has(this.name)) return;

    console.log(this.name);
    visitedSet.add(this.name);
    
    for (let neighbor of this.neighbors) {
        neighbor.dfs(visitedSet);
    }
  }

  // Cycle detection using DFS
  containsCycle(visitedSet = new Set(), recStack = new Set()) {
    if (recStack.has(this.name)) return true;

    if (visitedSet.has(this.name)) return false;

    visitedSet.add(this.name);
    recStack.add(this.name);
    
    for (let neighbor of this.neighbors) {
        if (neighbor.containsCycle(visitedSet, recStack)) {
            return true;
        }
    }

    recStack.delete(this.name);
    return false;
}

}

export class Graph {
  constructor() {
      this.nodes = {};
  }

  addNode(nodeName) {
      if (!this.nodes[nodeName]) {
          this.nodes[nodeName] = new Node(nodeName);
      }
      return this.nodes[nodeName];
  }

  addEdge(nodeName1, nodeName2) {
      let node1 = this.addNode(nodeName1);
      let node2 = this.addNode(nodeName2);
      node1.addNeighbor(node2);
  }

  bfs(startNodeName) {
    if (!this.nodes[startNodeName]) return;

    let queue = [this.nodes[startNodeName]];
    let visitedSet = new Set();

    while (queue.length > 0) {
        let currentNode = queue.shift();

        if (!visitedSet.has(currentNode.name)) {
            console.log(currentNode.name);
            visitedSet.add(currentNode.name);

            for (let neighbor of currentNode.neighbors) {
                queue.push(neighbor);
            }
        }
    }
  }

  shortestPath(startNodeName, endNodeName) {
    if (!this.nodes[startNodeName] || !this.nodes[endNodeName]) return [];

    let visitedSet = new Set();
    let queue = [{node: this.nodes[startNodeName], path: [startNodeName]}];

    while (queue.length > 0) {
        let currentObj = queue.shift();
        let currentNode = currentObj.node;
        let currentPath = currentObj.path;

        if (currentNode.name === endNodeName) return currentPath;

        if (!visitedSet.has(currentNode.name)) {
            visitedSet.add(currentNode.name);

            for (let neighbor of currentNode.neighbors) {
                if (!visitedSet.has(neighbor.name)) {
                    queue.push({node: neighbor, path: [...currentPath, neighbor.name]});
                }
            }
        }
    }

    return [];  // If no path found
  }
}

export function threeIntSum(nums, target) {
  nums.sort((a, b) => a - b);
  let closest = Infinity;

  for (let i = 0; i < nums.length - 2; i++) {
      let left = i + 1;
      let right = nums.length - 1;

      while (left < right) {
          let total = nums[i] + nums[left] + nums[right];

          if (Math.abs(target - closest) > Math.abs(target - total)) {
              closest = total;
          }

          if (total < target) {
              left++;
          } else {
              right--;
          }
      }
  }

  return closest;
}


