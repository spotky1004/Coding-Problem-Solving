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
check(`5
5 1 1 2 1`,
`4`);
check(`3
1 1 1`,
`3`);
check(`9
1 2 3 4 5 6 7 8 9`,
`2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], S] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let maxLen = 0;
let len = 0;
/** @type {Set<number>} */
const curUsing = new Set();
let sameCount = 0;
let prev = -1;
for (const Si of S) {
  if (prev !== Si) {
    if (!curUsing.has(Si) && curUsing.size === 2) {
      for (const v of curUsing) {
        if (prev !== v) curUsing.delete(v);
      }
      len = sameCount;
    }
    prev = Si;
    sameCount = 0;
    curUsing.add(Si);
  }
  len++;
  sameCount++;
  maxLen = Math.max(maxLen, len);
}

// output
return maxLen;
}
