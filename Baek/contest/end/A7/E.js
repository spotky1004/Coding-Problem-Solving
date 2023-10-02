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
check(`2 3
1 5
2 3
7 1
4 2`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], b, ...foods] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
b.sort((a, b) => a - b);
foods.sort((a, b) => a[0] - b[0]);

function check(P) {
  let bIdx = 0;
  for (let i = 0; i < M; i++) {
    const [a, w] = foods[i];
    while (Math.abs(b[bIdx] - a) * w > P) {
      bIdx++;
      if (bIdx === N) return false;
    }
  }
  return true;
}

let l = 0, r = 1000000000;
while (l + 1 < r) {
  const m = Math.floor((l + r) / 2);
  if (check(m)) r = m;
  else l = m;
}

// output
return r;
}
