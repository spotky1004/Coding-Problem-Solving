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
check(`1000000001
2
10000 1`,
`100001`);
check(`12312412412312
3
10000 9999 1`,
`1231241242`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[money], [N], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

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



const numA = A.map(Number).sort((a, b) => b - a);
/** @type {[coinCount: number, moneyUsed: number][]} */
const dp = Array(10000).fill(null);
dp[0] = [0n, 0];
const heap = new Heap((a, b) => dp[b][1] - dp[a][1]);
heap.push(0);

while (heap.size > 0) {
  const modVal = heap.pop();
  const [coinCount, moneyUsed] = dp[modVal];
  const newCoinCount = coinCount + 1n;
  for (const Ai of numA) {
    const newModVal = (modVal + Ai) % 10000;
    const newMoneyUsed = moneyUsed + Ai;
    if (dp[newModVal] !== null) {
      if (dp[newModVal][1] < newMoneyUsed) {
        dp[newModVal] = [newCoinCount, newMoneyUsed];
      }
      continue;
    }
    dp[newModVal] = [newCoinCount, newMoneyUsed];
    heap.push(newModVal);
  }
}

let minCoinCount = money;
for (let i = 0n; i < 10000n; i++) {
  const [coinCount, moneyUsed] = dp[i];
  const moneyRem = money - BigInt(moneyUsed);
  for (const Ai of A) {
    const newCoinCount = coinCount + (moneyRem / Ai) + (moneyRem % Ai);
    if (minCoinCount > newCoinCount) minCoinCount = newCoinCount;
  }
}

// output
return minCoinCount.toString();
}
