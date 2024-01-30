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
check(`6
4 8 6 3 12 9`,
`9 3 6 12 4 8`);
check(`4
42 28 84 126`,
`126 42 84 28`);
check(`8
1 2 4 8 16 32 64 128`,
`1 2 4 8 16 32 64 128`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], B] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
const nums = new Set(B);
let minNum = -1n;
let maxThreeCount = -1;
for (const Bi of B) {
  let threeCount = 0;
  let tmp = Bi;
  while (tmp % 3n === 0n) {
    tmp /= 3n;
    threeCount++;
  }

  if (
    (maxThreeCount === threeCount && Bi <= minNum) ||
    (threeCount > maxThreeCount)
  ) {
    maxThreeCount = threeCount;
    minNum = Bi;
  }
}

const seq = [minNum];
for (let n = minNum; ; ) {
  if (nums.has(n * 2n)) n = n * 2n;
  else if (n % 3n === 0n && nums.has(n / 3n)) n = n / 3n;
  else break;
  seq.push(n);
}

// output
return seq.join(" ");
}
