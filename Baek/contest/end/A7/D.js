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
check(`24 7
ai 1 20:00 21:30
polka 1 16:00 16:30
ange 1 22:00 23:30
tsuna 1 00:00 05:00
lita 1 05:00 06:30
tsuna 2 03:00 20:00
polka 2 00:00 20:01
ange 2 01:00 23:30
lita 3 01:00 23:30
tsuna 3 10:00 23:00
ai 3 10:00 23:00
ange 4 06:00 20:00
polka 4 10:00 23:00
tsuna 5 07:00 20:00
ange 5 11:00 23:00
polka 5 07:00 13:00
lita 5 03:00 23:00
ange 6 00:00 11:01
ai 6 00:00 20:00
tsuna 6 14:00 23:00
lita 6 00:00 17:00
polka 6 13:00 20:00
tsuna 7 16:00 22:00
polka 7 06:00 09:28`,
`ange
tsuna`);
check(`22 7
ai 1 20:00 21:30
polka 1 16:00 16:30
lita 1 05:00 06:30
tsuna 2 03:00 20:00
polka 2 00:00 20:01
ange 2 01:00 23:30
lita 3 01:00 23:30
tsuna 3 10:00 23:00
ai 3 10:00 23:00
ange 4 06:00 20:00
polka 4 10:00 23:00
tsuna 5 07:00 20:00
ange 5 11:00 23:00
polka 5 07:00 13:00
lita 5 03:00 23:00
ange 6 00:00 11:01
ai 6 00:00 20:00
tsuna 6 14:00 23:00
lita 6 00:00 17:00
polka 6 13:00 20:00
tsuna 7 16:00 22:00
polka 7 06:00 09:28`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N, M], ...V] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const timeConvert = (s) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

N = Number(N);
M = Number(M);
V = V.map(v => [v[0], Number(v[1]), timeConvert(v[3]) - timeConvert(v[2])]);

const timeSums = new Map();
const countSums = new Map();
for (const [name, date, time] of V) {
  const key = name + "_" + Math.floor((date - 1) / 7);

  if (!timeSums.has(key)) timeSums.set(key, time);
  else timeSums.set(key, timeSums.get(key) + time);

  if (!countSums.has(key)) countSums.set(key, 1);
  else countSums.set(key, countSums.get(key) + 1);
}

const weekCount = M / 7;
const timeGoal = 60 * 60;
const countGoal = 5;
const reals = [];
const names = [...new Set(V.map(v => v[0]))];
loop: for (const name of names) {
  for (let i = 0; i < weekCount; i++) {
    const key = name + "_" + i;
    if (
      !(
        timeSums.get(key) >= timeGoal &&
        countSums.get(key) >= countGoal
      )
    ) continue loop;
  }
  reals.push(name);
}

// output
if (reals.length === 0) return -1;
return reals.sort().join("\n");
}
