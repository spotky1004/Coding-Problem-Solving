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
check(`10 4
QRSRWBRBSB
0 7
1 6
0 9
3 9`,
`1 3 5 7
-1
1 3 7 9
3 6 7 9`);
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



let line = 0;
const [N, Q] = lines[line++].split(" ").map(Number);
const S = lines[line++];

const rIdxes = [];
const bIdxes = [];
for (let i = 0; i < N; i++) {
  if (S[i] === "R") rIdxes.push(i);
  else if (S[i] === "B") bIdxes.push(i);
}

const out = [];
for (let i = 0; i < Q; i++) {
  const [l, r] = lines[line++].split(" ").map(Number);

  let ls = binSearch(rIdxes, l);
  if (rIdxes[ls] < l) ls++;
  const re = binSearch(bIdxes, r);

  const r2 = rIdxes[ls + 1] ?? Infinity;
  const b1 = bIdxes[re - 1] ?? -Infinity;

  if (r2 < b1) out.push(`${rIdxes[ls]} ${rIdxes[ls + 1]} ${bIdxes[re - 1]} ${bIdxes[re]}`);
  else out.push(`-1`);
}

// output
return out.join("\n");
}
