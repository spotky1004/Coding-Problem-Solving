const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky") || require("fs").existsSync("C:/users/spotky1004");

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
check(`3 3 6
1 2 3
2 3 6
3 1 9
`,
`Yes`);
check(`4 4 7
1 2 3
2 3 2
3 4 3
4 2 2
`,
`No`);
check(`1 1 5
1 1 5`,
`Yes`);
check(`4 4 6
1 2 3
2 3 3
3 4 3
1 4 3`,
`Yes`);
check(`4 4 6
1 2 3
2 3 6
3 4 6
1 4 6`,
`No`);
check(`1 3 8
1 1 4
1 1 0
1 1 8`,
`No`);
check(`1 1 6
1 1 3`,
`No`)
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const YES = "Yes";
const NO = "No";

if (K === 1) return YES;
if (
  K % 2 === 1 &&
  !edges.every(edge => edge[2] % K === 0)
) return NO;

const halfK = K / 2;

const zeroEdges = [];
const oneEdges = [];
for (let i = 0; i < edges.length; i++) {
  const [u, v, weight] = edges[i];
  if (weight % halfK !== 0) return NO;
  const newWeight = (weight / halfK) % 2;
  if (newWeight === 1) oneEdges.push([u, v]);
  else zeroEdges.push([u, v]);
}

const zeroEdgesSet = new Set(zeroEdges.map(v => v.join(",")));
const oneEdgesSet = new Set(oneEdges.map(v => v.join(",")));
for (const e of zeroEdgesSet) {
  if (oneEdgesSet.has(e)) return NO;
}

const zeroConnections = Array.from({ length: N + 1 }, _ => []);
for (const [a, b] of zeroEdges) {
  zeroConnections[a].push(b);
  zeroConnections[b].push(a);
}

const oneConnections = Array.from({ length: N + 1 }, _ => []);
for (const [a, b] of oneEdges) {
  oneConnections[a].push(b);
  oneConnections[b].push(a);
}

const bipariteSet = Array(N + 1).fill(-1);
let visitedIdx = 1;
while (visitedIdx <= N) {
  let startNode = -1;
  for (; visitedIdx <= N; visitedIdx++) {
    if (bipariteSet[visitedIdx] !== -1) continue;
    startNode = visitedIdx++;
    break;
  }
  if (startNode === -1) break;
  
  const queue = [startNode];
  bipariteSet[startNode] = 0;
  for (const node of queue) {
    const nodeSet = bipariteSet[node];
    for (const toVisit of oneConnections[node]) {
      if (toVisit === node) return NO;
      if (bipariteSet[toVisit] !== -1) {
        if (bipariteSet[toVisit] === nodeSet) return NO;
        continue;
      }

      bipariteSet[toVisit] = nodeSet ^ 1;
      queue.push(toVisit);
    }

    for (const toVisit of zeroConnections[node]) {
      if (toVisit === node) continue;
      if (bipariteSet[toVisit] !== -1) {
        if (bipariteSet[toVisit] !== nodeSet) return NO;
        continue;
      }

      bipariteSet[toVisit] = nodeSet;
      queue.push(toVisit);
    }
  }
}

for (const [a, b] of zeroEdges) {
  if (a === b) continue;
  if (bipariteSet[a] !== bipariteSet[b]) return NO;
}
for (const [a, b] of oneEdges) {
  if (a === b) continue;
  if (bipariteSet[a] === bipariteSet[b]) return NO;
}

// output
return YES;
}
