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
check(`5
1 +
2 +
3 +
4 +
5 +`,
`0`);
check(`5
1 +
2 -
3 +
4 +
5 +`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[rawN], ...cakes] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
const N = Number(rawN);

// code
/**
 * @param {number} n 
 * @param {(perm: number[]) => void} callback 
 */
function permBruteSearcher(n, callback) {
  if (n === 0) return;

  /** @type {[i: number, lp: number, rp: number][]} */
  const nodes = [[-1, null, null]];
  for (let i = 0; i < n; i++) {
    const node = [i, nodes[i], null];
    nodes[i][2] = node;
    nodes.push(node);
  }
  const root = nodes[0];
  nodes[n][2] = root;
  root[1] = nodes[n];
  
  const perm = [];
  function impl() {
    if (root[2][0] === -1) callback(perm);
    for (let node = root[2]; node[0] !== -1; node = node[2]) {
      const [i, lp, rp] = node;
      perm.push(i);
      rp[1] = lp;
      lp[2] = rp;
      impl();
      perm.pop();
      rp[1] = node;
      lp[2] = node;
    }
  }
  impl();
}



const permOrderMap = new Map();
let permCount = 0;
permBruteSearcher(N, perm => permOrderMap.set(perm.map(v => v + 1).join(""), permCount++));
const goalState = 0;
const visited = Array((1 << N) * (permCount + 1)).fill(false);

const stateToIdx = (state) => {
  const permOrder = permOrderMap.get(state.map(v => Math.abs(v)).join(""));
  const signOrder = state.reduce((a, b, i) => a + (1 << i) * (1 - Math.sign(Math.sign(b) + 1)), 0);
  return (1 << N) * permOrder + signOrder;
}

const queue = [[0, cakes.map(v => (v[1] === "+" ? 1 : -1) * v[0])]];
visited[stateToIdx(queue[0][1])] = true;
for (const [moveCount, state] of queue) {
  const idx = stateToIdx(state);
  if (idx === goalState) return moveCount;
  for (let i = 0; i < N; i++) {
    const newState = [...state];
    for (let j = 0; j <= i; j++) newState[j] = -state[i - j];
    const newStateIdx = stateToIdx(newState);
    if (visited[newStateIdx]) continue;
    visited[newStateIdx] = true;
    queue.push([moveCount + 1, newState]);
  }
}

// output
return -1;
}
