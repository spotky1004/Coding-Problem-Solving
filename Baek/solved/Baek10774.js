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
check(`4
3
M
S
S
L
L 3
S 3
L 1`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[J], [A], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

J = Number(J);
A = Number(A);
const items = lines.splice(0, J);
const players = lines;

// code
const sizeIdx = {
  "S": 0,
  "M": 1,
  "L": 2,
};

players.sort((a, b) => a[1] - b[1]);
let playerIdx = 0;
let count = 0;
for (let i = 1; i <= J; i++) {
  while (i > (players[playerIdx] ?? [])[1]) playerIdx++;
  if (playerIdx >= A) break;
  
  const item = items[i - 1];
  while (i === Number(players[playerIdx][1])) {
    if (sizeIdx[item] >= sizeIdx[players[playerIdx][0]]) {
      count++;
      break;
    }
    playerIdx++;
    if (playerIdx >= A) break;
  }
}

// output
return count;
}
