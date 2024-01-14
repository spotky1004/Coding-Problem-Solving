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
check(`5 3 1
5 1 2 6 3
1 3 5 2 7
7 2 4 6 1
9 9 8 6 5
0 6 9 3 9
1 2`,
`5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, B, K], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mat = lines.splice(0, N);
const queries = lines.map(v => [v[0] - 1, v[1] - 1]);

const minVals = Array.from({ length: N }, _ => Array(N).fill(Infinity));
const maxVals = Array.from({ length: N }, _ => Array(N).fill(-Infinity));
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    const slice = mat[i].slice(j, j + B);
    minVals[i][j] = Math.min(...slice);
    maxVals[i][j] = Math.max(...slice);
  }
}

const out = [];
for (const [i, j] of queries) {
  let max = -Infinity;
  let min = Infinity;
  for (let b = i; b < i + B; b++) {
    min = Math.min(min, minVals[b][j]);
    max = Math.max(max, maxVals[b][j]);
  }
  out.push(max - min);
}

// output
return out.join("\n");
}
