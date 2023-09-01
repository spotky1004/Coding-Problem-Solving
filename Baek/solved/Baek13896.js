const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString();
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
check(`2
5 5 1
1 5
3 4
3 5
2 1
1 1
1 2
0 5
1 5
1 3
1 5 1
1 1
1 1
0 1
1 1
1 1`,
`Case #1:
5
1
5
2
Case #2:
1
1
1
1`);
check(`1
17 9 1
1 2
2 3
2 4
3 5
3 6
3 7
4 8
4 9
5 10
6 11
6 12
9 13
9 14
11 15
15 16
15 17\n` +
`0 11
1 6
1 4
1 13
0 13
1 3
1 2
0 11
1 3`,
`Case #1:
13
5
1
10
12
11`);
let bigCase = `1\n100 100 1\n`;
for (let i = 0; i < 99; i++) bigCase += `${i + 1} ${i + 2}\n`;
for (let i = 0; i < 100; i++) bigCase += `1 ${i + 1}\n`;
const bigCaseOut = "Case #1:\n" + Array.from({ length: 100 }, (_, i) => 100 - i).join("\n");
check(bigCase, bigCaseOut);
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



let line = 0;
const out = [];
let caseNr = 0;
while (line < lines.length) {
  caseNr++;
  out.push(`Case #${caseNr}:`);

  const [N, Q, R] = lines[line++];
  const connections = Array.from({ length: N }, _ => []);
  for (let i = 0; i < N - 1; i++) {
    const [A, B] = lines[line++];
    connections[A - 1].push(B - 1);
    connections[B - 1].push(A - 1);
  }

  const parents = Array(N).fill(-1);
  const depths = Array(N).fill(-1);
  const nodeValues = Array(N).fill(0);
  function bfsInit() {
    const visited = Array(N).fill(false);
    visited[0] = true;
    depths[0] = 0;
    const queue = [0];
    for (const node of queue) {
      for (const child of connections[node]) {
        if (visited[child]) continue;
        visited[child] = true;
        depths[child] = depths[node] + 1;
        parents[child] = node;
        queue.push(child);
      }
    }
  }
  const visited = Array(N).fill(false);
  function dfsInit(node = 0) {
    visited[node] = true;
    let value = 1;
    for (const child of connections[node]) {
      if (visited[child]) continue;
      value += dfsInit(child);
    }
    nodeValues[node] = value;
    return value;
  }
  bfsInit();
  dfsInit();

  const sparseTable = genSparseTable(parents);
  let capital = R - 1;
  for (let i = 0; i < Q; i++) {
    let [S, U] = lines[line++];
    U--;

    if (S === 0) {
      capital = U;
    } else if (S === 1) {
      const lca = calcLCA(U, capital, depths, sparseTable);
      if (U === capital) {
        out.push(N);
      } else if (lca === capital) {
        out.push(nodeValues[U]);
      } else if (lca === U) {
        let count = nodeValues[0] - nodeValues[U] + 1;
        for (const child of connections[U]) {
          if (calcLCA(child, capital, depths, sparseTable) !== U) continue;
          count += nodeValues[child];
        }
        out.push(count);
      } else {
        out.push(nodeValues[U]);
      }
    }
  }
}

// output
return out.join("\n");
}
