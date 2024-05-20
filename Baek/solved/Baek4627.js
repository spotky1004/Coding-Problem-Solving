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
check(`4
3 1
1111
1111
1111
LLLL
LLLL
LLLL
3 2
00000
01110
00000
.....
.LLL.
.....
3 1
00000
01110
00000
.....
.LLL.
.....
5 2
00000000
02000000
00321100
02000000
00000000
........
........
..LLLL..
........
........`,
`Case #1: 2 lizards were left behind.
Case #2: no lizard was left behind.
Case #3: 3 lizards were left behind.
Case #4: 1 lizard was left behind.`);
check(`1
3 1
000
010
000
...
.L.
...`,
`Case #1: 1 lizard was left behind.`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");

// code
/**
 * @param {number[][]} c capacity (N * N) 
 * @param {number} source 
 * @param {number} sink  
 */
function maximumFlow(c, source, sink) {
  const N = c.length;
  /** @type {number[][]} flow */
  const f = Array.from({ length: N }, _ => Array(N).fill(0));
  let maxFlowSum = 0;

  while (true) {
    const parents = Array(N).fill(-1);
    const queue = [source];
    queueLoop: for (const node of queue) {
      for (let to = 0; to < N; to++) {
        if (node === to) continue;
        if (
          parents[to] === -1 &&
          c[node][to] - f[node][to] > 0
        ) {
          queue.push(to);
          parents[to] = node;

          if (to === sink) break queueLoop;
        }
      }
    }

    if (parents[sink] === -1) break;

    let maxFlow = Infinity;
    for (let node = sink; node !== source; node = parents[node]) {
      maxFlow = Math.min(maxFlow, c[parents[node]][node] - f[parents[node]][node]);
    }
    if (maxFlow === 0) break;
    maxFlowSum += maxFlow;

    for (let node = sink; node !== source; node = parents[node]) {
      f[parents[node]][node] += maxFlow;
      f[node][parents[node]] -= maxFlow;
    }
  }

  return maxFlowSum;
}



let line = 0;
const T = Number(lines[line++]);
const out = [];
for (let caseNr = 1; caseNr <= T; caseNr++) {
  const [N, D] = lines[line++].split(" ").map(Number);
  const pillars = lines.slice(line, line + N);
  line += N;
  const lizards = lines.slice(line, line + N);
  line += N;
  const M = lizards[0].length;

  const caps = Array.from({ length: 2 * N * M + 2 }, () => Array(2 * N * M + 2).fill(0));
  const cellCount = N * M;
  const sourceVertex = 2 * cellCount;
  const sinkVertex = sourceVertex + 1;
  let lizardCount = 0;
  for (let u = 0; u < cellCount; u++) {
    const [ui, uj] = [Math.floor(u / M), u % M];
    if (pillars[ui][uj] === "0") continue;

    caps[u][u + cellCount] = Number(pillars[ui][uj]);
    if (lizards[ui][uj] === "L") {
      caps[sourceVertex][u] = 1;
      lizardCount++;
    }
    if (
      ui < D || uj < D ||
      N - ui - 1 < D || M - uj - 1 < D
    ) caps[u + cellCount][sinkVertex] = Infinity;
  }
  for (let u = 0; u < cellCount; u++) {
    const [ui, uj] = [Math.floor(u / M), u % M];
    if (pillars[ui][uj] === "0") continue;
    for (let v = 0; v < cellCount; v++) {
      const [vi, vj] = [Math.floor(v / M), v % M];
      if (
        u === v ||
        Math.abs(ui - vi) + Math.abs(uj - vj) > D ||
        pillars[vi][vj] === "0"
      ) continue;
      caps[u + cellCount][v] = Infinity;
    }
  }

  const escaped = maximumFlow(caps, sourceVertex, sinkVertex);
  const lostCount = lizardCount - escaped;
  out.push(`Case #${caseNr}: ${lostCount ? lostCount : "no"} ${lostCount >= 2 ? "lizards were" : "lizard was"} left behind.`);
}

// output
return out.join("\n");
}
