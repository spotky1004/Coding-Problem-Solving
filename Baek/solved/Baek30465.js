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
1 3 2 4
`, `1`);
check(`5
1 2 4 3 5
`, `-1`);
check(`4
4 3 2 1
`, `2`);
check(`8
8 7 6 4 2 3 5 1
`, `4`);
check(`11
11 3 4 2 10 6 7 8 5 1 9
`, `8`);
check(`5
1 2 3 4 5
`, `0`);
check(`7
5 3 7 4 6 2 1
`, `5`);
check(`9
2 3 4 6 5 7 8 9 1
`, `7`);
check(`10
2 7 4 1 5 6 8 3 9 10
`, `5`);
check(`1
1
`, `0`);
check(`4
2 1 4 3`,
`4`);
check(`9
2 1 4 3 5 7 6 8 9
`, `8`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (N % 2 === 1) {
  const center = Math.floor(N / 2) + 1;
  if (A[center - 1] !== center) return "-1";
}

const rightStartIdx = Math.ceil(N / 2) + 1;
const sideCycleCount = [0, 0];
let minSwap = 0;
const visited = Array(N + 1).fill(false);
for (let i = 0; i < N; i++) {
  const start = A[i];
  if (visited[start]) continue;
  visited[start] = true;

  const cycle = [start];
  let cur = A[start - 1];
  while (cur !== start) {
    if (visited[cur]) break;
    cycle.push(cur);
    visited[cur] = true;
    
    const next = A[cur - 1];
    cur = next;
  }

  if (cycle.length === 1) continue;

  const sideCounts = [0, 0];
  for (let i = 0; i < cycle.length; i++) {
    const a = i !== 0 ? cycle[i - 1] : cycle[cycle.length - 1];
    const b = cycle[i];
    
    if (a < rightStartIdx && b < rightStartIdx) sideCounts[0]++;
    if (a >= rightStartIdx && b >= rightStartIdx) sideCounts[1]++;
  }

  if (sideCounts[0] === cycle.length) sideCycleCount[0]++;
  if (sideCounts[1] === cycle.length) sideCycleCount[1]++;

  // console.log(cycle, sideCounts, sideCycleCount);
  minSwap += cycle.length - 1;
}
// console.log(minSwap);

const canMergeCount = Math.min(sideCycleCount[0], sideCycleCount[1]);
minSwap += 2 * canMergeCount + 2 * (sideCycleCount[0] + sideCycleCount[1] - 2 * canMergeCount);
// console.log(sideCycleCount);


// output
return minSwap;
}
