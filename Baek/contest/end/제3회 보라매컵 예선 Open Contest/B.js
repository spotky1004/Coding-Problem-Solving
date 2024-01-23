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
check(`5 3 10
2 4 5 1 3`,
`2`);
check(`1 99 5
5`,
`5`);
check(`1 99 5
100`,
`100`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, A], s] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
s.sort((a, b) => a - b);
if (s[0] > A) return s[0];

function calcShootCount(skill) {
  let canShootIdx = 0;
  let score = 0;
  let count = 0;
  while (skill < s[N - 1]) {
    while (s[canShootIdx + 1] <= skill) canShootIdx++;
    skill += s[canShootIdx];
    score += s[canShootIdx];
    count++;
  }
  count += Math.ceil(Math.max(0, A - score) / s[N - 1]);
  return count;
}

let l = s[0] - 1, r = A + 1;
while (l + 1 < r) {
  const m = Math.floor((l + r) / 2);
  if (calcShootCount(m) > M) l = m;
  else r = m;
}

// output
return r;
}
