const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`3
7 32
18 67
40 137`,
`3.1818181818 9.7272727272`);
check(`2
1 30
899 30`,
`0.0 30`);
check(`2
124 30
124 30`,
`EZPZ`);
check(`14
-61 632
-37 465
11 119
-30 416
-46 526
-79 746
89 432
69 -293
57 203
59 223
-42 492
51 165
-69 677
-8 256`,
`-3.6088744257783 352.077180047999`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n], ...poses] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
const Sx = poses.reduce((a, b) => a + b[0], 0n);
const Sxx = poses.reduce((a, b) => a + b[0]**2n, 0n);
const Sy = poses.reduce((a, b) => a + b[1], 0n);
const Sxy = poses.reduce((a, b) => a + b[0] * b[1], 0n);
if (Sx**2n === n * Sxx) return "EZPZ";

const mul = 10n**12n;
const a2 = (n * Sxy - Sx * Sy) * mul / (n * Sxx - Sx**2n);
const b2 = (Sy * mul - a2 * Sx) / n;

// output
return `${(Number(a2) / Number(mul)).toFixed(10)} ${(Number(b2) / Number(mul)).toFixed(10)}`;
}
