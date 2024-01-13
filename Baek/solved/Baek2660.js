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
1 2
2 3
3 4
4 5
2 4
5 3
-1 -1`,
`2 3
2 3 4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...friends] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const adj = Array.from({ length: N + 1 }, _ => []);
for (const [u, v] of friends) {
  if (u === -1) break;
  adj[u].push(v);
  adj[v].push(u);
}

let minScore = Infinity;
const scores = [null];
for (let i = 1; i <= N; i++) {
  const dists = Array(N + 1).fill(-1);
  dists[i] = 0;
  const queue = [i];
  for (const u of queue) {
    for (const v of adj[u]) {
      if (dists[v] !== -1) continue;
      dists[v] = dists[u] + 1;
      queue.push(v);
    }
  }
  const score = Math.max(...dists);
  minScore = Math.min(minScore, score);
  scores.push(score);
}

const kings = [];
for (let i = 1; i <= N; i++) {
  if (scores[i] === minScore) kings.push(i);
}

// output
return `${minScore} ${kings.length}\n${kings.join(" ")}`;
}
