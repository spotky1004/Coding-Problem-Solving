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
check(`4
1 10 1
4 4 1
1 5 1
6 10 1`,
`4 3`);
check(`1
2147483647 2147483647 1`,
`2147483647 1`);
check(`2
2147483647 2147483647 1
2147483647 2147483647 2`,
`NOTHING`);
check(`1
1 1 1`,
`1 1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...deomideomi] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
function S(n) {
  let sum = 0;
  for (const [A, C, B] of deomideomi) {
    sum += Math.max(0, Math.floor(Math.min((n - A) / B, (C - A) / B) + 1));
  }
  return sum;
}

let l = 1, r = 2_147_483_648;
if (S(r) % 2 === 0) return "NOTHING";
while (l + 1 < r) {
  const m = Math.floor((l + r) / 2);
  if (S(m) % 2 === 0) l = m;
  else r = m;
}

let odd = l + 1;
if ((S(odd) - S(odd - 1)) % 2 !== 1) odd--;

// output
return `${odd} ${S(odd) - S(odd - 1)}`;
}
