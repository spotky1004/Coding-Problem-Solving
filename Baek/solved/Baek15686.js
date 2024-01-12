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
check(`5 3
0 0 1 0 0
0 0 2 0 1
0 1 2 0 0
0 0 1 0 0
0 0 0 0 2`,
`5`);
check(`5 2
0 2 0 1 0
1 0 1 0 0
0 0 0 0 0
2 0 0 1 1
2 2 0 1 2`,
`10`);
check(`5 1
1 2 0 0 0
1 2 0 0 0
1 2 0 0 0
1 2 0 0 0
1 2 0 0 0`,
`11`);
check(`5 1
1 2 0 2 1
1 2 0 2 1
1 2 0 2 1
1 2 0 2 1
1 2 0 2 1`,
`32`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...board] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const houses = [];
const chickens = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    const cell = board[i][j];
    if (cell === 1) houses.push([i, j]);
    if (cell === 2) chickens.push([i, j]);
  }
}

const chickenDistTable = [];
for (const [ci, cj] of chickens) {
  let chickenDist = [];
  for (const [hi, hj] of houses) {
    chickenDist.push(Math.abs(ci - hi) + Math.abs(cj - hj));
  }
  chickenDistTable.push(chickenDist);
}

let minCityChicken = Infinity;
function search(cur = -1, chickenCount = 0, chickenDists = Array(houses.length).fill(Infinity)) {
  minCityChicken = Math.min(minCityChicken, chickenDists.reduce((a, b) => a + b, 0));
  if (chickenCount === M) return;

  for (let i = cur + 1; i < chickens.length; i++) {
    search(i, chickenCount, chickenDists);

    const distsClone = [...chickenDists];
    for (let j = 0; j < houses.length; j++) {
      distsClone[j] = Math.min(distsClone[j], chickenDistTable[i][j]);
    }
    search(i, chickenCount + 1, distsClone);
  }
}
search();

// output
return minCityChicken;
}
