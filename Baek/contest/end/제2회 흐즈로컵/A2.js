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
1 -1
1 0
1 1`,
`WWAX
WAX
AX`);
check(`5
11 2
-3 8
2 5
-5 8
-12 -14`,
`?`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...soliders] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const solidersComp = soliders.map(([x, y]) => x + " " + y);

/** @type {[delta: [dx: number, dy: number], key: string, dt: number][]} */
const directions = [
  [[ 0,  1], "X", 1],
  [[ 1,  0], "A", 0],
  [[ 0, -1], "W", 1],
  [[-1,  0], "D", 0]
];

const curCommands = [];
let soliderLeft = N;
let t = 0;
let u = 0;
let x = 0, y = 0;
let curDirection = 3;
const out = Array(N);
while (soliderLeft > 0) {
  if (u === 0) {
    curDirection = (curDirection + 1) % directions.length;
    t += directions[curDirection][2];
    u = t;
  }
  u--;

  const [[dx, dy], key] = directions[curDirection];
  curCommands.unshift(key);
  x += dx;
  y += dy;

  const comp = x + " " + y;
  const soliderIdx = solidersComp.findIndex(v => v === comp);
  if (soliderIdx !== -1) {
    out[soliderIdx] = curCommands.join("");
    soliderLeft--;
  }
}

// output
return out.join("\n");
}
