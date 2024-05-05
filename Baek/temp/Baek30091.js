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
check(`6
3 1 2 9 3 7`,
`63`);
check(`2000
${Array.from({ length: 2000 }, (_, i) => 1 + i).join(" ")}`,
``);
check(`2000
${Array.from({ length: 2000 }, (_, i) => 1 + Math.floor(Math.random() * 1e7)).join(" ")}`,
``);
check(`2000
${Array.from({ length: 2000 }, (_, i) => 1e7 - 1).join(" ")}`,
`99999980000001000`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], L] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
L.sort((a, b) => a - b);
const LCounts = [];
for (let i = 0; i < N; i++) {
  const Li = L[i];
  if (
    LCounts.length !== 0 &&
    LCounts[LCounts.length - 1][0] === Li
  ) {
    LCounts[LCounts.length - 1][1]++;
  } else {
    LCounts.push([Li, 1n]);
  }
}

const idxes = [];
const rounds = [];
const areas = [];
for (let i = 0; i < LCounts.length; i++) {
  const [Li, iCount] = LCounts[i];
  for (let j = i + 1; j < LCounts.length; j++) {
    const [Lj, jCount] = LCounts[j];
    idxes.push(idxes.length);
    rounds.push(Li + Lj);
    areas.push(BigInt(Li * Lj) * iCount * jCount);
  }
}
for (let i = 0 ; i < LCounts.length; i++) {
  const [Li, iCount] = LCounts[i];
  idxes.push(idxes.length);
  rounds.push(2 * Li);
  areas.push(BigInt(Li * Li) * (iCount / 2n));
}

idxes.sort((a, b) => rounds[a] - rounds[b]);
let maxAreaSum = 0n;
let curRound = -1;
let curAreaSum = 0n;
for (const idx of idxes) {
  const round = rounds[idx];
  const area = areas[idx];
  if (round !== curRound) curAreaSum = 0n;
  curRound = round;
  curAreaSum += area;
  if (maxAreaSum < curAreaSum) maxAreaSum = curAreaSum;
}

// output
return maxAreaSum;
}
