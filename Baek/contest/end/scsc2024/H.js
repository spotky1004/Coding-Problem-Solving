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
check(`0`,
`1`);
check(`?`,
`0`);
check(`0?10`,
`1`);
check(`10?01`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const S = input
  .trim();

// code
const dp = [
  Array.from({ length: S.length + 1 }, () => Array(S.length + 1).fill(-1)),
  Array.from({ length: S.length + 1 }, () => Array(S.length + 1).fill(-1)),
  Array.from({ length: S.length + 1 }, () => Array(S.length + 1).fill(-1))
];
for (let i = 0; i < S.length; i++) dp[0][i][i] = 0, dp[1][i][i] = 0, dp[2][i][i] = 1;

function search(l, r, layer) {
  if (l > r) throw "!";
  if (dp[layer][l][r] !== -1) return dp[layer][l][r];

  let canWin = 0;

  let lChr = S[l];
  if (lChr === "?" && layer !== 2) lChr = layer.toString();
  let rChr = S[r - 1];
  if (rChr === "?" && layer !== 2) rChr = layer.toString();

  if (layer === 2) canWin |= (search(l, r, 0) ^ 1) | (search(l, r, 1) ^ 1);
  if (lChr !== "?") {
    for (let i = l; i < r; i++) {
      let curChr = S[i];
      if (curChr === "?" && layer !== 2) curChr = layer.toString();
      if (curChr !== lChr) break;
      canWin |= search(i + 1, r, layer) ^ 1;
    }
  }
  if (rChr !== "?") {
    for (let i = r; i > l; i--) {
      let curChr = S[i - 1];
      if (curChr === "?" && layer !== 2) curChr = layer.toString();
      if (curChr !== rChr) break;
      canWin |= search(l, i - 1, layer) ^ 1;
    }
  }

  dp[layer][l][r] = canWin;
  return canWin;
}

// output
return S.includes("?") ? search(0, S.length, 2) : search(0, S.length, 0);
}
