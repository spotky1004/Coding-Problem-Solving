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
check(`3 4
1 3 0
1122
1003
3330
1200
3031
3332`,
`13`);
check(`3 4
1 3 0
1122
1003
3330
1200
1031
3332`,
`9`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[H, W], [R, C, D], ...tableA] = input
  .trim()
  .split("\n")
  .map((line, i) => i <= 1 ? line.split(" ").map(Number) : Array.from(line).map(Number));
const tableB = tableA.splice(H);

// code
/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  roots[a] = root;
  return root;
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  if (a === b) return;

  if (rank[a] < rank[b]) {
    roots[a] = b;
  } else {
    roots[b] = a;
    if (rank[a] === rank[b]) {
      rank[a]++;
    }
  }
}



/** @type {[dR: number, dC: number][]} */
const deltas = [
  [-1, 0], [0, 1],
  [1, 0], [0, -1]
];

const nodeCount = 8 * H * W + 1;
const outNode = nodeCount;
/**
 * @param {number} r 
 * @param {number} c 
 * @param {number} d 
 * @param {boolean} isDust 
 */
const stateToNode = (state) => {
  const [r, c, d, isDust] = state;
  if (
    0 > r || r >= H ||
    0 > c || c >= W
  ) return outNode;
  return (d + 4 * isDust) * H * W + r * W + c + 1;
}
/**
 * @param {number} node 
 */
const nodeToState = node => {
  if (node === outNode || node === 0) return null;
  node--;
  const isDust = Boolean(Math.floor(node / 4 / H / W));
  node -= isDust * 4 * H * W;
  const d = Math.floor(node / H / W);
  node -= d * H * W;
  const r = Math.floor(node / W);
  node -= r * W;
  const c = node;
  /** @type {[R: number, C: number, D: number, isDust: boolean]} */
  return [r, c, d, isDust];
}

const rank = Array(nodeCount + 1).fill(1);
const rootValues = Array.from({ length: nodeCount + 1 }, (_, i) => [i, 0]);
const roots = Array.from({ length: nodeCount + 1 }, (_, i) => i);
const dusts = Array.from({ length: H }, () => Array(W).fill(true));

let moveCount = 0;
let curMoveCount = 0;
const getNextState = (state) => {
  let node = stateToNode(state);
  // console.log("is", state);
  if (nodeToState(node) === null) return null;
  while (!nodeToState(node)[3]) {
    if (find(node) !== node) {
      const [skipNode, skipCount] = rootValues[find(node)];
      node = skipNode;
      curMoveCount += skipCount;
      console.log(skipCount);
    }
    const curState = nodeToState(node);
    if (curState === null) return null;
    const nextR = curState[0] + deltas[curState[2]][0];
    const nextC = curState[1] + deltas[curState[2]][1];
    if (
      0 > nextR || nextR >= H ||
      0 > nextC || nextC >= W
    ) return null;
    const tileValue = !dusts[nextR][nextC] ? tableB[nextR][nextC] : tableA[nextR][nextC];
    const nextD = (curState[2] + tileValue) % 4;
    const nextState = [nextR, nextC, nextD, dusts[nextR][nextC]];
    const nextNode = stateToNode(nextState);
    // console.log(node, nextNode, curState, nextState);
    if (node === nextNode) return null;
    if (!nextState[3]) {
      const curNodeRoot = find(node);
      const newNodeRoot = find(nextNode);
      union(node, nextNode);
      rootValues[find(nextNode)] = [
        rootValues[newNodeRoot][0],
        rootValues[curNodeRoot][1] + rootValues[newNodeRoot][1] + 1
      ];
    }
    node = nextNode;
    console.log("iw", nextState);
    // throw "!";
    curMoveCount++;
  }
  return nodeToState(node);
}

let curState = [R, C, (D + tableA[R][C]) % 4, true];
console.log(curState, D, tableA[R][C]);
console.table(dusts);
while (curState !== null) {
  if (curState[3]) {
    curState[3] = false;
    dusts[curState[0]][curState[1]] = false;
    moveCount = curMoveCount;
    console.log(curState, moveCount);
  }
  // console.log(curState);
  console.table(dusts);
  curState = getNextState(curState);
}

// output
return moveCount;
}
