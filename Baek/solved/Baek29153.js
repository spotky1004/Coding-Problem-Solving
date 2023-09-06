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
check(`4 3
1 2
1 3
1 4
`,
`1`);
check(`11 12
1 2
2 3
2 4
3 5
4 5
5 6
6 7
7 8
7 9
8 10
9 10
10 11
`,
`2`);
check(`25 28
1 2
2 3
2 4
2 5
2 7
2 8
2 12
3 6
4 6
5 6
7 9
8 9
9 10
9 11
12 13
13 14
13 15
13 16
13 22
15 17
16 17
17 18
17 19
17 20
17 21
22 23
23 24
23 25
`,
`4`);
check(`19 21
1 10
1 9
1 8
8 4
4 11
4 12
7 11
12 3
7 13
7 14
14 6
6 15
15 3
3 19
6 16
16 5
5 18
5 17
17 2
2 19
2 9
`,
`4`);
check(`16 16
1 4
3 4
2 4
9 10
10 12
10 11
8 6
6 5
5 14
9 14
14 2
14 13
13 16
13 15
7 6
`,
`4`);
check(`19 0
1 2
2 5
5 3
1 3
1 4
4 5
5 6
5 9
9 7
7 5
6 9
9 10
9 11
11 12
8 12
12 10
9 8
12 14
14 15
12 13
13 15
12 17
17 15
12 16
16 15
5 18
18 9
19 1
`,
`3`);
check(`12 0
1 2
2 4
2 3
7 6
6 8
6 5
8 11
11 12
7 11
4 9
9 10
3 9
`,
`2`);
check(`9 0
9 6
6 2
2 5
5 1
1 6
5 4
4 7
8 7
5 3
3 7`,
`2`);
check(`16 0
1 2
2 6
1 3
3 6
1 4
4 7
7 16
1 5
7 5
6 10
10 13
13 15
6 11
13 11
6 9
9 12
14 12
12 8
8 6
`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} leftCount 
 * @param {number} rightCount 
 * @param {number[][]} connections 
 * @returns {number} 
*/
function bipartiteMatching(leftCount, rightCount, connections) {
  const occuipedBy = Array(rightCount).fill(-1);

  let done = Array(rightCount).fill(false);
  function match(l) {
    for (const r of connections[l]) {
      if (done[r]) continue;
      done[r] = true;

      if (occuipedBy[r] === -1 || match(occuipedBy[r])) {
        occuipedBy[r] = l;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < leftCount; i++) {
    done = Array(rightCount).fill(false);
    match(i);
  }
  return occuipedBy.filter(v => v !== -1).length;
}

const connections = Array.from({ length: N }, _ => []);
for (const [a, b] of edges) {
  connections[a - 1].push(b - 1);
  connections[b - 1].push(a - 1);
}

// u = urchin
const uIdxes = [];
const uIdxReverse = Array(N).fill(-1);
for (let i = 0; i < N; i++) {
  if (connections[i].length < 3) continue;
  uIdxReverse[i] = uIdxes.length;
  uIdxes.push(i);
}
const uCount = uIdxes.length;
const uTypes = Array(uCount).fill(-1);
const uConnections = Array.from({ length: uCount }, _ => []);

const uSpikes = Array.from({ length: N }, (_, i) => connections[i].filter(v => connections[v].length >= 3));
for (const uSpike of uSpikes) {
  if (uSpike.length !== 2) continue;
  const [u, v] = [uIdxReverse[uSpike[0]], uIdxReverse[uSpike[1]]]
  uConnections[u].push(v);
  uConnections[v].push(u);
}

const visited = Array(uCount).fill(false);
function initU(cur) {
  visited[cur] = true;
  for (const u of uConnections[cur]) {
    if (visited[u]) continue;
    uTypes[u] = uTypes[cur] ^ 1;
    initU(u);
  }
}
for (let i = 0; i < uIdxes.length; i++) {
  if (uTypes[i] !== -1) continue;
  uTypes[i] = 0;
  initU(i);
}

const zeroTypeCount = uTypes.filter(v => v === 0).length;
const leftType = zeroTypeCount >= uCount - zeroTypeCount ? 0 : 1;
const rightType = leftType ^ 1;
const leftCount = uTypes.filter(v => v === leftType).length;
const rightCount = uCount - leftCount;
const rIdxes = Array(uCount).fill(-1);
let rIdx = 0;
for (let i = 0; i < uCount; i++) {
  if (uTypes[i] !== rightType) continue;
  rIdxes[i] = rIdx;
  rIdx++;
}
// b = bipartite
const bConections = [];
for (let i = 0; i < uCount; i++) {
  if (uTypes[i] !== leftType) continue;
  bConections.push(uConnections[i].map(v => rIdxes[v]));
}
const matchCount = bipartiteMatching(leftCount, rightCount, bConections);

// output
return uCount - matchCount;
}

