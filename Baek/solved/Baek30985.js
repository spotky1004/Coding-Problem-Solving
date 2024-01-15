const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`5 7 4
1 2 7
1 3 11
1 4 7
2 3 13
2 4 4
2 5 16
4 5 10
3 -1 1 3 -1`,
`26`);
check(`3 2 7
1 2 3
2 3 8
-1 -1 -1`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const e = edges.pop();

// code
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

function dijkstra(nodeCount, startNode, connections) {
  const costs = Array(nodeCount + 1).fill(Infinity);
  costs[startNode] = 0;
  
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.push([startNode, 0]);

  while (heap.size > 0) {
    const [nodeNr, cost] = heap.pop();
    if (costs[nodeNr] < cost) continue;
    for (const [curNr, curCost] of connections[nodeNr]) {
      if (costs[curNr] < cost + curCost) continue;
      costs[curNr] = cost + curCost;
      heap.push([curNr, costs[curNr]]);
    }
    if (nodeNr > N) {
      for (let [curNr, curCost] of connections[nodeNr - N]) {
        curNr += N;
        if (curNr > nodeCount) continue;

        if (costs[curNr] <= cost + curCost) continue;
        costs[curNr] = cost + curCost;
        heap.push([curNr, costs[curNr]]);
      }
    }
  }

  return costs;
}



const V = 2 * N;
const connections = Array.from({ length: 1 + V }, _ => []);
for (const [u, v, c] of edges) {
  connections[u].push([v, c]);
  connections[v].push([u, c]);
  // connections[u + N].push([v + N, c]);
  // connections[v + N].push([u + N, c]);
}
for (let i = 1; i <= N; i++) {
  const ei = e[i - 1];
  if (ei === -1) continue;

  const c = (K - 1) * ei;
  connections[i].push([i + N, c]);
}

const costs = dijkstra(V, 1, connections);
const result = costs[V];

// output
return isFinite(result) ? result : -1;
}
