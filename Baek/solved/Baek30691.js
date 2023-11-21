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
check(`10 2
1 2 1
1 3 1
2 4 1
3 5 1
4 6 1
5 7 1
5 8 1
5 9 1
5 10 1
`,
`6`);
check(`10 2
1 2 1
1 3 1
2 4 2
3 5 1
4 6 1
5 7 1
5 8 1
5 9 1
5 10 3
`,
`5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], ...edges] = input
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



const nodeAdj = Array.from({ length: N + 1 }, _ => []);
for (const [u, v, w] of edges) {
  nodeAdj[u].push([v, w]);
  nodeAdj[v].push([u, w]);
}

const visited = Array(N + 1).fill(false);
const parents = Array(N + 1).fill(-1);
const depths = Array(N + 1).fill(0);
function init(u = 1, parent = -1, depth = 0) {
  visited[u] = true;
  parents[u] = parent;
  depths[u] = depth;
  
  for (const [v, w] of nodeAdj[u]) {
    if (visited[v]) continue;
    init(v, u, depth + w);
  }
}
init();

visited.fill(false);
const queue = [1];
for (const u of queue) {
  visited[u] = true;

  for (const [v] of nodeAdj[u]) {
    if (visited[v]) continue;
    visited[v] = true;
    queue.push(v);
  }
}
queue.reverse();
queue.pop();

const heapCompFunc = (a, b) => depths[b] - depths[a];
/** @type {Heap[]} */
const canBreaks = Array.from({ length: N + 1 }, (_, i) => {
  const heap = new Heap(heapCompFunc);
  heap.push(i);
  return heap;
});
let maxBreak = 1;
for (const child of queue) {
  visited[child] = true;
  const parent = parents[child];
  const parentDepth = depths[parent];

  const childBreaks = canBreaks[child];
  const parentBreaks = canBreaks[parent];

  if (childBreaks.size < parentBreaks.size) {
    while (childBreaks.size > 0) {
      const node = childBreaks.pop();
      if (depths[node] - parentDepth <= K) parentBreaks.push(node);
    }
    canBreaks[parent] = parentBreaks;
  } else {
    while (depths[childBreaks.first()] - parentDepth > K) {
      childBreaks.pop();
    }
    while (parentBreaks.size > 0) {
      childBreaks.push(parentBreaks.pop());
    }
    canBreaks[parent] = childBreaks;
  }

  maxBreak = Math.max(maxBreak, canBreaks[parent].size);
}

// output
return maxBreak;
}
