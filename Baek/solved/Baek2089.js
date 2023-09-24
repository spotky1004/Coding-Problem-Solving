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
check(`-13`, `110111`);
check(`89`, `110101001`);
check(`57`, `1001001`);
check(`73`, `1011001`);
check(`1`, `1`);
check(`0`, `0`);
check(`-1`, `11`);
check(`-1`, `11`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const sign = Math.sign(N);
const bin = Array.from(Math.abs(N).toString(2)).reverse().map(Number);
const mBin = Array(42).fill(0);
for (let i = 0; i < 40; i++) {
  if (bin[i]) {
    mBin[i]++;
    if ((i + (sign === -1)) % 2 === 1) mBin[i + 1]++;
  }

  while (mBin[i] >= 2 && mBin[i + 1] >= 1) {
    mBin[i] -= 2;
    mBin[i + 1]--;
  }
  while (mBin[i] >= 2) {
    mBin[i + 1]++;
    mBin[i + 2]++;
    mBin[i] -= 2;
  }
}

let out = "";
let oneAppeared = false;
for (let i = 41; i >= 0; i--) {
  if (!oneAppeared && mBin[i] === 0) continue;
  oneAppeared = true;
  out += mBin[i];
}

// output
return out || "0";
}
