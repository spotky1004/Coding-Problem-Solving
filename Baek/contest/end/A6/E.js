const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString();
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
check(`3 4 10
1 22 199
1 23 30 76`,
`1 2
10`);
check(`3 6 2
12 12 10
1 2 13 11 4 10`,
`1 4
14`);
check(`2 8 3
1 2
1 10 20 30 40 50 60 70`,
`8 4
0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], h, l] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const MAX_LVL = 200;

const levelAcc = Array(MAX_LVL + 1).fill(0);
levelAcc[0] = null;
for (const h_i of h) {
  levelAcc[h_i]++;
}
const lMap = l.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
const levelFloors = Array(MAX_LVL + 1).fill(lMap[M - 1][1]);
levelFloors[0] = null;
for (let i = 0; i < M; i++) {
  const [lvl, floor] = lMap[i];
  for (let j = lvl; j <= MAX_LVL; j++) {
    levelFloors[j] = floor;
  }
}

let maxStone = 1;
let maxSave = 0;
for (let i = 1; i < M; i++) {
  let save = 0;
  for (let j = 1; j <= MAX_LVL; j++) {
    if (levelAcc[j] === 0) continue;
    const maxReach = Math.min(199, j + K - 1);
    for (let k = j; k <= maxReach; k++) {
      save += Math.max(0, levelFloors[k] - Math.abs(levelFloors[k] - i)) * levelAcc[j];
    }
  }
  if (save <= maxSave) continue;
  maxStone = i;
  maxSave = save;
}


// output
return `${1} ${maxStone + 1}\n${maxSave}`;
}
