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
check(`#O########
OOO#######
#O########
####OO####
###O##O###
####OO####
##########
########O#
#######OOO
########O#`,
`4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const board = input
  .trim()
  .split("\n")
  .map(line => Array.from(line));

// code
const N = 10;

const rowToMask = (row) => row.reduce((a, b, i) => a + b * (1 << i), 0);
const maskToRow = (mask) => Array.from({ length: N }, (_, i) => Math.sign(mask & (1 << i)));

for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    board[i][j] = board[i][j] === "#" ? 0 : 1;
  }
}

const MAX = (1 << N) - 1;
let dp = Array.from({ length: MAX + 1 }, _ => Array(MAX + 1).fill(Infinity));
for (let i = 0; i <= MAX; i++) {
  const row1 = [...board[0]];
  const row2 = [...board[1]];
  let bitCount = 0;
  for (let b = 0; b < N; b++) {
    if ((i & (1 << b)) === 0) continue;

    bitCount++;
    if (b !== 0) row1[b - 1] ^= 1;
    row1[b] ^= 1;
    if (b !== N - 1) row1[b + 1] ^= 1;
    row2[b] ^= 1;
  }

  const mask1 = rowToMask(row1);
  const mask2 = rowToMask(row2);
  dp[mask1][mask2] = Math.min(dp[mask1][mask2], bitCount);
}
for (let row = 1; row <= 8; row++) {
  const newDp = Array.from({ length: MAX + 1 }, _ => Array(MAX + 1).fill(Infinity));

  for (let i = 0; i <= MAX; i++) {
    const row1 = maskToRow(i);
    const pressCount = row1.reduce((a, b) => a + b, 0);
    for (let j = 0; j <= MAX; j++) {
      if (!isFinite(dp[i][j])) continue;
      const row2 = maskToRow(j);
      const row3 = [...board[row + 1]];
      for (let k = 0; k < N; k++) {
        if (!row1[k]) continue;

        if (k !== 0) row2[k - 1] ^= 1;
        row2[k] ^= 1;
        if (k !== N - 1) row2[k + 1] ^= 1;
        row3[k] ^= 1;
      }

      const mask2 = rowToMask(row2);
      const mask3 = rowToMask(row3);
      newDp[mask2][mask3] = Math.min(newDp[mask2][mask3], dp[i][j] + pressCount);
    }
  }

  dp = newDp;
}
let minClick = Infinity
for (let i = 0; i <= MAX; i++) {
  const row1 = maskToRow(i);
  const pressCount = row1.reduce((a, b) => a + b, 0);
  for (let j = 0; j <= MAX; j++) {
    if (!isFinite(dp[i][j])) continue;
    const row2 = maskToRow(j);
    for (let k = 0; k < N; k++) {
      if (!row1[k]) continue;
      if (k !== 0) row2[k - 1] ^= 1;
      row2[k] ^= 1;
      if (k !== N - 1) row2[k + 1] ^= 1;
    }

    if (row2.some(c => c === 1)) continue;
    minClick = Math.min(minClick, dp[i][j] + pressCount);
  }
}

// output
return isFinite(minClick) ? minClick : -1;
}
