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
check(`5 2
3 2 3 2 2`,
`2 2 2 2 2`);
check(`5 5
4 2 3 7 6`,
`3 2 3 4 5`);
check(`3 6
10 10 1`,
`9 5 1`);
check(`9 32
10 5 1 5 10 5 1 5 10`,
`5 3 1 3 5 3 1 3 5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, T], A] = input
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



const startHeap = new Heap((a, b) => a[0] - b[0]);
for (let i = 0; i < N; i++) startHeap.push([A[i], i]);

function gen(x) {
  const out = [...A];
  let changeCount = 0;
  const heap = new Heap((a, b) => a[0] - b[0]);
  heap.tree = [...startHeap.tree];
  while (heap.size > 0) {
    const [cur, i] = heap.pop();
    if (i !== 0) {
      const diff = Math.max(0, out[i - 1] - cur - x);
      if (diff !== 0) {
        changeCount += diff;
        out[i - 1] -= diff;
        heap.push([out[i - 1], i - 1]);
      }
    }
    if (i !== N - 1) {
      const diff = Math.max(0, out[i + 1] - cur - x);
      if (diff !== 0) {
        changeCount += diff;
        out[i + 1] -= diff;
        heap.push([out[i + 1], i + 1]);
      }
    }
  }

  return [changeCount, out];
}

let l = 0, r = 1e9;
while (l + 1 < r) {
  const m = Math.floor((l + r) / 2);
  const changeCount = gen(m)[0];
  if (changeCount >= T) l = m;
  else r = m;
}
while (gen(l)[0] > T) l++;

// output
return gen(l)[1].join(" ");
}
