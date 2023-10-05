const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`10 15 35`,
`1`);
check(`1 1 2`,
`0`);
check(`1 1 1`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[A, B, C]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (A === B && A === C) return 1;

const append = new Set([`${A},${B},${C}`]);
const queue = [[A, B, C]];
function test(stones, i1, i2) {
  if (stones[i1] < stones[i2]) return test(stones, i2, i1);

  const newStones = [...stones];
  newStones[i1] -= newStones[i2];
  newStones[i2] *= 2;
  if (
    newStones[0] === newStones[1] &&
    newStones[0] === newStones[2]
  ) return true;
  const stonesStr = `${newStones[0]},${newStones[1]},${newStones[2]}`;
  if (
    append.has(stonesStr) ||
    newStones[0] <= 0 ||
    newStones[1] <= 0 ||
    newStones[2] <= 0
  ) return false;
  append.add(stonesStr);
  queue.push(newStones);
  return false;
}
for (const stones of queue) {
  if (
    test(stones, 0, 1) ||
    test(stones, 1, 2) ||
    test(stones, 0, 2)
  ) return 1;
}

// output
return 0;
}
