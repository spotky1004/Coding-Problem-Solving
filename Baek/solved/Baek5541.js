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
check(`5 2
2 2 1
2 1 3`,
`12`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N, M], ...tris] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
tris.sort((a, b) => a[0] - b[0]);

let trisIdx = 0;
/** @type {[b: number, x: number][]} */
const removeTris = Array.from({ length: N }, _ => []);
const plus = [];
const minus = [];

let count = 0;
for (let y = 0; y < N; y++) {
  plus.push(0);
  minus.unshift(0);
  while (trisIdx !== M && tris[trisIdx][0] === y + 1) {
    const [a, b, x] = tris[trisIdx];
    plus[b - 1]++;
    if (b !== y + 1) minus[b]--;
    trisIdx++;
    removeTris[a - 1 + x].push([b, x]);
  }

  let rangeCount = 0;
  for (let x = 0; x <= y; x++) {
    rangeCount += plus[x] + minus[x];
    if (rangeCount > 0) count++;
  }

  for (const [b, x] of removeTris[y]) {
    plus[b - 1]--;
    if (b + x !== y + 1) minus[b + x]++;
  }
}

// output
return count;
}
