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
check(`3
194.85.160.177
194.85.160.183
194.85.160.178`,
`194.85.160.176
255.255.255.248`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [, ...adds] = input
  .trim()
  .split("\n")
  .map(line => line.split(".").map(Number));

// code
function addToNum(add) {
  return [...add].reverse().reduce((a, b, i) => a + 256**i*b, 0);
}
function numToAdd(num) {
  const add = [];
  let rem = num;
  for (let i = 0; i < 4; i++) {
    add.push(rem % 256);
    rem = Math.floor(rem / 256);
  }
  return add.reverse();
}
function formatAdd(add) {
  return add.join(".");
}

const addNums = adds.map(addToNum);
const allAnd = Number(addNums.map(BigInt).reduce((a, b) => a & b, BigInt(2**32 - 1)));
const m = addNums.reduce((maxM, add) => {
  const bigAddAnd = BigInt(allAnd);
  add = BigInt(add);

  let m = 32;
  for (let i = 31n; i >= 0n; i--) {
    const bit = 1n << i;
    if ((bigAddAnd & bit) !== (add & bit)) break;
    m--;
  }
  
  return Math.max(maxM, m);
}, 0);
const netAddNum = parseInt(addNums[0].toString(2).padStart(32, "0").slice(0, 32 - m) || "0", 2) * 2**m;
const maskAddNum = 2**32 - 2**m;

// output
return `${formatAdd(numToAdd(netAddNum))}\n${formatAdd(numToAdd(maskAddNum))}`;
}
