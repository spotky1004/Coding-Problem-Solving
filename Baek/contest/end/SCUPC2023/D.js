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
check(`4 6
0 1 0 1 1 0
1 0 0 1 1 0
0 1 1 1 1 0
0 1 0 0 0 0
0 0 1 0 1 0`,
`1`);
check(`4 6
0 1 0 1 1 0
1 0 1 0 0 0
0 1 1 0 1 0
1 1 0 1 0 0
0 0 1 0 1 0`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...models] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const ans = models.shift();

// code
const len = 2**N;

let soloMaxAcc = 0;
let ensembleMaxAcc = 0;
for (let mask = 0; mask < len; mask++) {
  let modelCount = 0;
  const ensemble = Array(M).fill(0);
  for (let i = 0; i < N; i++) {
    const bit = 2**i;
    if ((mask & bit) === 0) continue;

    modelCount++;
    for (let j = 0; j < M; j++) {
      ensemble[j] += models[i][j];
    }
  }

  if (modelCount % 2 === 0) continue;
  const threshold = (modelCount + 1) / 2;

  let accury = 0;
  for (let i = 0; i < M; i++) {
    const result = Number(ensemble[i] >= threshold);
    if (result === ans[i]) accury++;
  }

  if (modelCount === 1) {
    soloMaxAcc = Math.max(soloMaxAcc, accury);
  } else {
    ensembleMaxAcc = Math.max(ensembleMaxAcc, accury);
  }
}

// output
return ensembleMaxAcc > soloMaxAcc ? 1 : 0;
}
