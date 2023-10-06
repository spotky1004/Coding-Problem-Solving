const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`4
1 2
1 3
1 4
8
2 3 4
3 2 4
4 2 3
4 3 2
1 2 3
2 1 3
3 1 2
3 2 1`,
`1
1
1
1
-1
-1
-1
-1`);
check(`2
1 2
4
1 1 2
1 2 1
2 1 1
2 2 2`,
`-1
-1
-1
2`);
check(`6
1 2
2 3
2 4
3 5
5 6
4
1 4 6
4 1 6
6 1 4
6 4 1`,
`3
3
3
3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number[]} parents 
*/
function genSparseTable(parents) {
  const sparseTable = [[...parents]];
  
  const tableSize = Math.ceil(Math.log2(parents.length));
  for (let i = 1; i < tableSize; i++) {
    const prevRow = sparseTable[i - 1];
    const row = Array(parents.length);
    row[0] = -1;

    for (let j = 1; j < parents.length; j++) {
      row[j] = prevRow[prevRow[j]];
    }
    sparseTable.push(row);
  }

  return sparseTable;
}

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number[]} depths 
 * @param {number[][]} sparseTable 
*/
function calcLCA(a, b, depths, sparseTable) {
  if (depths[a] < depths[b]) [a, b] = [b, a];

  a = moveNodeOnSparseTable(a, depths[a] - depths[b], sparseTable);
  let depth = depths[b];

  if (a === b) return a;

  let left = 0;
  let right = depth;
  let mid;
  while (true) {
    mid = Math.floor((left + right) / 2);
    
    const newA = moveNodeOnSparseTable(a, depth - mid, sparseTable);
    const newB = moveNodeOnSparseTable(b, depth - mid, sparseTable);
    if (newA === newB) {
      left = mid;
    } else {
      right = mid;
    }

    if (right - left <= 1) return moveNodeOnSparseTable(a, depth - left, sparseTable);
  }
}

/**
 * @param {number} node 
 * @param {number} count 
 * @param {number[][]} sparseTable 
*/
function moveNodeOnSparseTable(node, count, sparseTable) {
  for (let i = 0; i < sparseTable.length; i++) {
    if ((count & (1 << i)) === 0) continue;
    node = sparseTable[i][node];
  }
  return node;
}




let line = 0;
const nodeEdges = Array.from({ length: N + 1 }, _ => []);
for (let i = 0; i < N - 1; i++) {
  const [a, b] = lines[line++];
  nodeEdges[a].push(b);
  nodeEdges[b].push(a);
}

const parents = Array(N + 1).fill(-1);
const depths = Array(N + 1).fill(-1);
function init(curNode = 1, parentNode = -1, depth = 0) {
  parents[curNode] = parentNode;
  depths[curNode] = depth;

  for (const childNode of nodeEdges[curNode]) {
    if (childNode === parentNode) continue;
    init(childNode, curNode, depth + 1);
  }
}
init();

function calcDist(a, b) {
  const lca = calcLCA(a, b, depths, sparseTable);
  return depths[a] + depths[b] - 2 * depths[lca];
}

function testQuery(A, B, C) {
  if (A === B && A === C) return A;

  const abDist = calcDist(A, B);
  if (abDist % 2 !== 0) return -1

  const abHalfDist = abDist / 2;
  const abCenter = moveNodeOnSparseTable(
    depths[A] > depths[B] ? A : B,
    abHalfDist,
    sparseTable
  );

  const centerCDist = calcDist(abCenter, C);
  if (centerCDist !== abHalfDist) return -1;
  return abCenter;
}

const sparseTable = genSparseTable(parents);
const [Q] = lines[line++];
const out = [];
for (let i = 0; i < Q; i++) {
  const [A, B, C] = lines[line++];
  let ans = -1;
  const tests = [
    [A, B, C],
    [B, A, C],
    [C, A, B],
    [C, B, A]
  ];
  for (const test of tests) {
    const result = testQuery(...test);
    if (result !== -1) {
      ans = result;
      break;
    }
  }
  out.push(ans);
}

// output
return out.join("\n");
}
