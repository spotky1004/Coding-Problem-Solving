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
abba
abbab
abac
abcd
bbabab`,
`Case #1: 2
aa
Case #2: 4
abab
Case #3: 2
aa
Case #4: 0
Case #5: 4
bbbb`);
// check(`1
// ` + "a".repeat(3000) + "\n",
// `x`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [T, ...cases] = input
  .trim()
  .split("\n");

// code
function binSearch(arr, v) {
  let left = 0, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === v) return mid;
    else if (arr[mid] < v) left = mid;
    else right = mid;
  }
  return left;
}

const out = [];
let caseIdx = 0;
for (const S of cases) {
  const N = S.length;

  const lIdxes = [];
  const rIdxes = [];
  const rIdxInverse = Array.from({ length: N }, _ => []);
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (S[i] !== S[j]) continue;

      lIdxes.push(i);
      rIdxes.push(j);
      rIdxInverse[j].push(rIdxes.length - 1);
    }
  }
  console.log(rIdxes.length, lIdxes, rIdxes, rIdxInverse);

  let maxPowStr = "";
  for (let i = 0; i < N; i++) {
    const startPos = rIdxInverse[i][0];
    if (typeof startPos === "undefined") continue;

    const dp = Array(N).fill(0);
    const prevs = Array(N).fill(-1);
    let r = startPos;
    while (true) {
      r = binSearch();
    }
  }

  out.push(`Case #${++caseIdx}: ${maxPowStr.length}`);
  if (maxPowStr.length !== 0) out.push(maxPowStr);
}

// output
return out.join("\n");
}
