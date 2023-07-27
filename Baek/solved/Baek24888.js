const isDev = process?.platform !== "linux";
const [[N, M], ...edges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 4
1 2 1
2 4 1
1 3 1
3 4 1
1 1 0 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

class Heap {
  tree = [null];
  compFunc = (a, b) => a - b;

  constructor(compFunc) {
    if (compFunc) this.compFunc = compFunc;
  }

  get size() {
    return this.tree.length - 1;
  }

  first() {
    return this.tree[1];
  }

  push(v) {
    const tree = this.tree;
    const compFunc = this.compFunc;

    let curIdx = tree.length;
    tree.push(v);
    while (curIdx !== 1) {
      const parentIdx = Math.floor(curIdx / 2);
      if (compFunc(v, tree[parentIdx]) >= 0) break;
      this.swap(curIdx, parentIdx);
      curIdx = parentIdx;
    }
  }

  pop() {
    const tree = this.tree;
    const compFunc = this.compFunc;
    if (tree.length === 1) return null;
    
    const popedNode = tree[1];
    if (tree.length === 2) {
      this.tree = [null];
      return popedNode;
    }
    
    const lastNode = tree.pop();
    tree[1] = lastNode;
    let curIdx = 1;
    while (true) {
      const childIdx = tree.length <= curIdx * 2 + 1 || compFunc(tree[curIdx * 2], tree[curIdx * 2 + 1]) <= 0 ? curIdx * 2 : curIdx * 2 + 1;
      if (
        tree.length <= childIdx ||
        compFunc(lastNode, tree[childIdx]) <= 0
      ) break;
      this.swap(curIdx, childIdx);
      curIdx = childIdx;
    }
    
    return popedNode;
  }

  swap(a, b) {
    const tmp = this.tree[b];
    this.tree[b] = this.tree[a];
    this.tree[a] = tmp;
  }
}



const A = edges.pop();
A.unshift(null);

/** @type {[to: number, cost: number][]} */
const connections = Array(N + 1).fill().map(_ => []);
for (const [from, to, cost] of edges) {
  connections[from].push([to, cost]);
  connections[to].push([from, cost]);
}

function dijkstra(nodeCount, startNode) {
  const costs = Array(nodeCount + 1).fill(Infinity);
  const prevNodes = Array(nodeCount + 1).fill(-1);
  const collectCounts = Array(nodeCount + 1).fill(0);
  costs[startNode] = 0;
  collectCounts[1] = A[1];
  
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.push([startNode, 0]);

  while (heap.size > 0) {
    const [nodeNr, cost] = heap.pop();
    if (costs[nodeNr] < cost) continue;
    const node = connections[nodeNr];
    for (const [curNr, curCost] of node) {
      if (costs[curNr] < cost + curCost) continue;
      if (costs[curNr] > cost + curCost) {
        costs[curNr] = cost + curCost;
        heap.push([curNr, costs[curNr]]);
        prevNodes[curNr] = nodeNr;
        collectCounts[curNr] = collectCounts[nodeNr] + A[curNr];
      } else {
        const newCount = collectCounts[nodeNr] + A[curNr];
        if (collectCounts[curNr] < newCount) {
          collectCounts[curNr] = newCount;
          prevNodes[curNr] = nodeNr;
        }
      }

    }
  }

  return [costs, prevNodes, collectCounts];
}

const collectCount = A.reduce((a, b) => a + b, 0);
const [costs, prevNodes, collectCounts] = dijkstra(N, 1);
if (collectCounts[N] === collectCount) {
  const route = [N];
  for (let i = 1; i < N; i++) {
    const toPush = prevNodes[route[i - 1]];
    if (toPush === -1) break;
    route.push(toPush);
  }
  route.reverse();
  console.log(`${route.length}\n${route.join(" ")}`);
} else {
  console.log(-1);
}
