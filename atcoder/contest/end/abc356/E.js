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
check(`3
3 1 4`,
`8`);
check(`6
2 7 1 8 2 8`,
`53`);
check(`12
3 31 314 3141 31415 314159 2 27 271 2718 27182 271828`,
`592622`);
check(`5
1 1 1 1 1`,
`10`);
check(`5
2 2 2 2 2`,
`10`);
check(`5
1 2 3 4 5`,
`22`);
check(`200000
${Array.from({ length: 200000 }, (_, i) => Math.floor(Math.random() * 10 * i + 1)).join(" ")}`,
`1`);
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
A.sort((a, b) => a - b);
let sum = 0;
for (let i = 0; i < N; i++) {
  const cur = A[i];
  let s = i + 1;
  while (s < N) {
    const divVal = Math.floor(A[s] / cur);
    let l = s, r = N;
    while (l + 1 < r) {
      const m = Math.floor((l + r) / 2);
      if (divVal === Math.floor(A[m] / cur)) l = m;
      else r = m;
    }
    // while (divVal === Math.floor(A[l + 1] / cur)) l++;
    sum += (l - s + 1) * divVal;
    s = l + 1;
    if (l - s === 0) break;
  }
  for (let j = s; j < N; j++) sum += Math.floor(A[j] / cur);
}

// output
return sum;
}
