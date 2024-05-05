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
check(`3
2 1 0 1
0 1 5 5 1 10
3 3 0 2
0 1 0 5 61 50
1 2 5 5 62 50
0 2 0 5 63 99
2 0 0 1`,
`Case #1: 10.1111111
Case #2: 162.0000000
Case #3: -1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
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



const fixNum = (x) => Math.round(x * 1e10) / 1e10;

let line = 0;
const out = [];
for (let caseNr = 0; caseNr < T; caseNr++) {
  const [N, M, H, O] = lines[line++];
  /** @type {[v: number, w: number, s: number][]} */
  const adj = Array.from({ length: N }, () => []);
  for (let i = 0; i < M; i++) {
    const [A, B, S, R, D, P] = lines[line++];
    const w = fixNum(R + D * (P / 100) / (1 - P / 100));
    adj[A].push([B, w, S]);
  }
  console.log(H, O, adj);

  const minTimes = Array(N).fill(Infinity);
  minTimes[H] = 0;
  const heap = new Heap((a, b) => a[1] - b[1]);
  heap.push([H, 0]);
  while (heap.size > 0) {
    const [u, time] = heap.pop();
    if (minTimes[u] < time) continue;
    const edges = adj[u];
    for (const [v, w, s] of edges) {
      const newTime = fixNum(
        time % 60 <= s ?
        60 * Math.floor(time / 60) + s + w :
        60 * Math.ceil(time / 60) + s + w
      );
      if (minTimes[v] <= newTime) continue;
      minTimes[v] = newTime;
      heap.push([v, newTime]);
    }
  }

  out.push(`Case #${caseNr + 1}: ${isFinite(minTimes[O]) ? minTimes[O].toFixed(7) : -1}`);
}

// output
return out.join("\n");
}
