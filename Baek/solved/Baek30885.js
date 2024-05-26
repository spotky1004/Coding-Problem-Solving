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
check(`5
4 1 3 2 5`,
`15
5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], a] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const root = [-1, null, null];
let node = root;
for (let i = 0; i < N; i++) {
  const newNode = [[a[i], i + 1], node, null];
  node[2] = newNode;
  node = newNode;
}

function printLst(root) {
  let out = ""
  for (let cur = root[2]; cur !== null; cur = cur[2]) {
    out += `(${cur[0].join(", ")}) `;
  }
  return out;
}

let t = 1;
while (root[2][2] !== null) {
  for (let cur = root[2]; cur !== null; cur = cur[2]) {
    const curValue = cur[0][0];
    if (
      cur[1] !== root &&
      cur[1][0][0] <= curValue
    ) {
      const tmp = cur[1];
      cur[0][0] += cur[1][0][0];
      cur[1] = cur[1][1];
      cur[1][2] = cur;
    }
    if (
      cur[2] !== null &&
      cur[2][0][0] <= curValue
    ) {
      cur[0][0] += cur[2][0][0];
      cur[2] = cur[2][2];
      if (cur[2]) cur[2][1] = cur;
    }
  }
  t++;
}

// output
return `${root[2][0][0]}\n${root[2][0][1]}`;
}