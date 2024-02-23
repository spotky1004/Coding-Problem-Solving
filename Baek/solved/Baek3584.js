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
check(`2
16
1 14
8 5
10 16
5 9
4 6
8 4
4 10
1 13
6 15
10 11
6 7
10 2
16 3
8 1
16 12
16 7
5
2 3
3 4
3 1
1 5
3 5`,
`4
3`);
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

function initTree(root, adj) {
  const depths = Array(adj.length).fill(-1);
  const parents = Array(adj.length).fill(-1);
  const visited = Array(adj.length).fill(false);

  function impl(u, depth, parent) {
    depths[u] = depth;
    parents[u] = parent;
    visited[u] = true;
    for (const v of adj[u]) {
      if (visited[v]) continue;
      impl(v, depth + 1, u);
    }
  }
  impl(root, 0, -1);

  return { depths, parents, visited };
}

const out = [];
let line = 0;
for (let caseNr = 0; line < lines.length; caseNr++) {
  const [N] = lines[line++];
  const adj = Array.from({ length: N + 1 }, _ => []);
  let root;
  for (let i = 1; i < N; i++) {
    const [u, v] = lines[line++];
    if (i === 1) root = u;
    adj[u].push(v);
    adj[v].push(u);
  }
  const [A, B] = lines[line++];

  const { depths, parents } = initTree(root, adj);
  const sparseTable = genSparseTable(parents);
  out.push(calcLCA(A, B, depths, sparseTable));
}


// output
return out.join("\n");
}
