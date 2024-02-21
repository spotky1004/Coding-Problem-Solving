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
check(`6
0 1 0 1 1 1
1 0 1 1 1 0
0 1 0 1 0 0
1 1 1 0 1 0
1 1 0 1 0 1
1 0 0 0 1 0`,
[
  `1 2 3 4 1 5 2 4 5 6 1`,
  `1 5 2 4 5 6 1 2 3 4 1`
]);
check(`3
0 0 0
0 0 2
0 2 0`,
`2 3 2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...adjMat] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
function flatConnectedArray(root) {
  const arr = [];
  for (let node = root; node !== null; node = node[2]) {
    arr.push(node[0]);
  }
  return arr;
}

const minConnectedVertex = Array(N).fill(0);
function updateMin(node) {
  let cur = minConnectedVertex[node];
  if (cur === -1) return;
  while (adjMat[node][cur] === 0) cur++;
  if (cur === N) cur = -1;
  minConnectedVertex[node] = cur;
}
for (let i = 0; i < N; i++) updateMin(i);

function findPath(startNode, depth = 0) {
  let u = startNode;
  const lstRoot = [u + 1, null, null];
  let lstCurNode = lstRoot;
  do {
    const v = minConnectedVertex[u];
    if (v === -1) return -1;
    const removeCount = 1 + 2 * Math.floor((adjMat[u][v] - 1) / 2);
    adjMat[u][v] -= removeCount;
    adjMat[v][u] -= removeCount;
    updateMin(u);
    updateMin(v);
    for (let i = 0; i < removeCount; i++) {
      let lstNewNode;
      if (i % 2 === 0) lstNewNode = [v + 1, null, null];
      else lstNewNode = [u + 1, null, null];

      lstNewNode[1] = lstCurNode;
      lstCurNode[2] = lstNewNode;
      lstCurNode = lstNewNode;
    }
    u = v;
  } while (u !== startNode);
  const lstLastNode = lstCurNode;

  if (depth === 0) {
    for (lstCurNode = lstRoot; lstCurNode !== null; lstCurNode = lstCurNode[2]) {
      const node = lstCurNode[0] - 1;
      if (minConnectedVertex[node] === -1) continue;
      const result = findPath(node, depth + 1);
      if (result === -1) return -1;
      const [l, r] = result;
      r[2] = lstCurNode[2];
      lstCurNode[2] = l[2];
    }
  }
  return [lstRoot, lstLastNode];
}

let startNode;
for (let i = 0; i < N; i++) {
  if (adjMat[i].every(v => v === 0)) continue;
  startNode = i;
  break;
}

const result = findPath(startNode);
if (result === -1) return "-1";

// output
return flatConnectedArray(result[0]).join(" ");
}
