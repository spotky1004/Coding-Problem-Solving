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
check(`8
1 8
3 9
2 2
4 1
6 4
10 10
9 7
7 6`,
`3
1
3
4`);
check(`9
1 50000
2 4
3 11
4 12
5 6
6 3
7 2
8 9
9 10`,
`5
1
3
4
6
7`)
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...wires] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
wires.sort((a, b) => a[0] - b[0]);
const prevs = Array(N).fill(-1);
const dpIdxes = Array(N).fill(-1);
const dp = Array(N).fill(Infinity);
for (let i = 0; i < N; i++) {
  const [, b] = wires[i];
  let l = -1; r = N;
  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);
    if (dp[m] < b) l = m;
    else r = m;
  }
  if (dp[r] < b) continue;
  dp[r] = b;
  dpIdxes[r] = i;
  prevs[i] = r !== 0 ? dpIdxes[r - 1] : -1;
}

const maxLen = dp.reduce((a, b) => a + isFinite(b), 0);
const isAvaiable = Array(N).fill(false);
for (let i = dpIdxes[maxLen - 1]; i !== -1; i = prevs[i]) {
  isAvaiable[i] = true;
}

const toCut = [];
for (let i = 0; i < N; i++) {
  if (isAvaiable[i]) continue;
  toCut.push(wires[i][0]);
}

// output
return `${toCut.length}\n${toCut.join("\n")}`;
}
