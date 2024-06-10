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
6 7 10 8 20`,
[`YES
1
4 15`,
`YES
1
3 8`]);
check(`3
9 1 7`,
`YES
3
1 1
2 2
3 3`);
check(`10
10 9 8 7 6 5 4 3 2 1`,
`NO`);
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
/**
 * @template T 
 * @param {T[]} A 
 * @param {(l: T, r: T) => boolean} cond 
 * @returns {T[]} 
*/
function lis(A, cond) {
  const dp = [0];
  const lenValues = [A[0]];
  for (let i = 1; i < A.length; i++) {
    const cur = A[i];

    let l = -1, r = lenValues.length;
    while (l + 1 < r) {
      const m = Math.floor((l + r) / 2);
      if (cond(lenValues[m], cur)) l = m;
      else r = m;
    }

    const curLen = r;
    dp.push(curLen);
    if (
      curLen >= lenValues.length ||
      cond(cur, lenValues[curLen])
    ) lenValues[curLen] = cur;
  }

  for (let i = A.length - 1; i >= 0; i--) {
    if (dp[i] !== lenValues.length - 1) continue;
    const out = [i];
    let cur = A[i];
    let curLen = lenValues.length - 2;
    let j = i;
    while (curLen >= 0) {
      j--;
      if (dp[j] !== curLen || !cond(A[j], cur)) continue;
      cur = A[j];
      out.push(j);
      curLen--;
    }
    return out.reverse();
  }
  return [];
}



const lisIdxes = lis(A, (l, r) => l <= r);
if (N - lisIdxes.length > 3) return "NO";

const isLisEl = Array(N).fill(false);
for (const i of lisIdxes) isLisEl[i] = true;
const changes = [];
for (let i = 0; i < N; i++) {
  if (isLisEl[i]) continue;
  A[i] = i !== 0 ? A[i - 1] : 1;
  changes.push(`${i + 1} ${A[i]}`);
}

// output
return `YES
${changes.length}
${changes.join("\n")}`;
}
