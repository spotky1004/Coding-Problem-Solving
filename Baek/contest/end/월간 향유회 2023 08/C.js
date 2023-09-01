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
check(`3 3 1 3
1 3
3 2
1 2`,
`0 1 1`);
check(`4 3 1 4
1 3
3 2
1 2`,
`-1`);
check(`2 1 1 2
1 2`,
`0`);
check(`5 10 1 4
1 2
2 3
3 4
4 5
5 1
1 4
4 2
2 5
5 3
3 1`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, S, E], ...edges] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
edges.forEach(edge => edge.push(-1));

/** @type {[to: number, edge: [u: number, v: number, direction: -1 | 0 | 1]][]} */
const connections = Array.from({ length: N + 1 }, _ => []);
for (let i = 0; i < M; i++) {
  const edge = edges[i];
  const [u, v] = edge;
  connections[u].push([v, edge]);
  connections[v].push([u, edge]);
}

let visited, depth;
function bfs(s) {
  visited[s] = true;
  depth[s] = 0;
  const queue = [s];
  for (const node of queue) {
    for (const [to] of connections[node]) {
      if (visited[to]) continue;
      visited[to] = true;
      depth[to] = depth[node] + 1;
    }
  }
}
visited = Array(N + 1).fill(false);
depth = Array(N + 1).fill(-1);
bfs(S);

const path = [E];
for (let i = depth[E] - 1; i >= 0; i--) {
  const curNode = path[path.length - 1];
  for (const [to] of connections[curNode]) {
    if (depth[to] !== i) continue;
    path.push(to);
    break;
  }
}
path.reverse();
if (path[0] !== S) return -1;

for (let i = 0; i < path.length - 1; i++) {
  const curNode = path[i];
  const nextNode = path[i + 1];
  for (const [to, edge] of connections[curNode]) {
    if (to !== nextNode) continue;
    edge[2] = edge[0] === curNode ? 0 : 1;
  }
}

for (const [, edge] of connections[S]) {
  if (edge[2] !== -1) continue;
  edge[2] = edge[0] === S ? 0 : 1;
}
for (const [, edge] of connections[E]) {
  if (edge[2] !== -1) continue;
  edge[2] = edge[0] === E ? 0 : 1;
}
for (const node of path) {
  for (const [, edge] of connections[node]) {
    if (edge[2] !== -1) continue;
    edge[2] = edge[0] === node ? 0 : 1;
  }
}

// output
return edges.map(edge => edge[2] === -1 ? 0 : edge[2]).join(" ");
}
