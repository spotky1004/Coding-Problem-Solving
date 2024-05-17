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
check(`7
3 4 5 9 10 14 15`,
`5`);
check(`7
1 1 1 1 1 1 1`,
`1`);
check(`7
5 5 5 5 5 5 5`,
`5`);
check(`7
35 4 4 4 4 4 4`,
`5`);
check(`7
4 4 4 4 4 4 28`,
`4`);
check(`7
4 4 4 4 4 4 29`,
`5`);
check(`7
1000000000 1000000000 1000000000 1000000000 1000000000 1000000000 1000000000`,
`1000000000`);
check(`7
150000000 200000000 250000000 450000000 500000000 700000000 750000000`,
`250000000`);
check(`5
2 4 8 16 32`,
`8`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], T] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
T.sort((a, b) => a - b);
function check(n) {
  let l = 0, r = N - 1;
  let lEnd = T[l], rEnd = T[r];
  for (let i = 0; i < N; i++) {
    let curTime = n * (i + 1);
    if (Math.min(lEnd, rEnd) > curTime) return false;
    if (rEnd <= curTime) {
      r--;
      rEnd = Math.max(curTime, rEnd + T[r]);
    } else {
      l++;
      lEnd = Math.max(curTime, lEnd + T[l]);
    }
  }
  return true;
}

let l = 0, r = 1e9 + 1;
while (l + 1 < r) {
  const m = Math.floor((l + r) / 2);
  if (check(m)) r = m;
  else l = m;
}
while (!check(l)) l++;
while (check(l - 1)) l;

// output
return l;
}
