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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`7 9
0 6
0 1 1
0 2 1
0 3 2
0 4 3
1 5 2
2 6 4
3 6 2
4 6 4
5 6 1
4 6
0 2
0 1 1
1 2 1
1 3 1
3 2 1
2 0 3
3 0 2
6 8
0 1
0 1 1
0 2 2
0 3 3
2 5 3
3 4 2
4 1 1
5 1 1
3 0 1
0 0`,
`5
-1
6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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

/**
 * @param {number} V 
 * @param {number} s 
 * @param {[v: number, cost: number][]} adj 
 */
function dijkstra(V, s, adj) {
  const costs = Array(V).fill(Infinity);
  costs[s] = 0;
  
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.push([s, 0]);

  while (heap.size > 0) {
    const [u, cost] = heap.pop();
    if (costs[u] < cost) continue;
    const node = adj[u];
    for (const [v, costAdd] of node) {
      if (costs[v] <= cost + costAdd) continue;
      costs[v] = cost + costAdd;
      heap.push([v, costs[v]]);
    }
  }

  return costs;
}



let line = 0;
const out = [];
while (true) {
  const [N, M] = lines[line++];
  if (N === 0 && M === 0) break;
  const [S, D] = lines[line++];
  const edges = lines.slice(line, line + M);
  line += M;

  const adj = Array.from({ length: N }, () => []);
  const adjInv = Array.from({ length: N }, () => []);;
  for (const [u, v, cost] of edges) {
    adj[u].push([v, cost]);
    adjInv[v].push([u, cost]);
  }

  const costs = dijkstra(N, S, adj);
  const visited = Array(N).fill(false);
  const queue = [D];
  visited[D] = true;
  const removedAdj = Array.from({ length: N }, () => new Set());
  for (const v of queue) {
    for (const [u, cost] of adjInv[v]) {
      if (costs[v] - costs[u] !== cost) continue;
      if (!visited[u]) queue.push(u);
      visited[u] = true;
      removedAdj[u].add(v);
    }
  }

  for (let u = 0; u < N; u++) {
    const removed = removedAdj[u];
    const nodeAdj = adj[u];
    for (let i = 0; i < nodeAdj.length; i++) {
      if (!removed.has(nodeAdj[i][0])) continue;
      nodeAdj.splice(i, 1);
      i--;
    }
  }

  const newCosts = dijkstra(N, S, adj);
  const ans = newCosts[D];
  out.push(isFinite(ans) ? ans : -1);
}

// output
return out.join("\n");
}
