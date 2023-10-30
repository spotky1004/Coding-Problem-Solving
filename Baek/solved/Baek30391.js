const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky1004");

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
check(`8 3
`,
`8 1
1 6
2 1
2 5
4 5
7 2
7 3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const edges = [];
let i = 2;
for (; i <= Math.min(2 + K - 1, N); i++) {
  edges.push(`1 ${i}`);
}
let parent = 2;
while (i <= N) {
  for (let j = 0; j < K - 1; j++) {
    edges.push(`${parent} ${i}`);
    i++;
    if (i > N) break;
  }
  parent++;
}

// output
return edges.join("\n");
}
