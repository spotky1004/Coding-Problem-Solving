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
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`6`,
`0`);
check(`5`,
`2`);
check(`1`,
`-1`);
check(`1000`,
`6`);
check(`999999999999`,
`128`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (Math.abs(Math.sqrt(N) - Math.round(Math.sqrt(N))) === 0) return -1;

const sqN = Math.ceil(Math.sqrt(N));

let count = 0;
for (let i = 1; i < sqN; i++) {
  const a = i;
  const b = Math.sqrt(N - a**2);
  if (a > b) break;
  if (Math.abs(b - Math.round(b)) === 0) {
    count++;
  }
}

const factors = [];
for (let i = 1; i <= sqN; i++) {
  if (!Number.isInteger(N / i)) continue;
  factors.push(i);
}
for (let i = 0; i < factors.length; i++) {
  const c = factors[i];
  const t = N / c;
  if ((c - t) % 2 !== 0) continue;
  count++;
}

// output
return count;
}
