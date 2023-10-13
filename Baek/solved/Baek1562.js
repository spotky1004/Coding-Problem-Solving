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
check(`10`, `1`);
check(`15`, `287`);
check(`20`, `23249`);
check(`30`, `49050151`);
check(`40`, `203722859`);
check(`100`, `670667793`);
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
const mod = 1e9;

const states = Array(100).fill(-1);
let stateCount = 0;
for (let i = 0; i <= 9; i++) {
  for (let j = i; j <= 9; j++) {
    states[i * 10 + j] = stateCount++;
  }
}
const statesReversed = Array(100).fill(-1);
for (let i = 0; i < 100; i++) {
  statesReversed[states[i]] = i;
}

const getIdx = (curNum, l, r) => curNum * stateCount + states[l * 10 + r];
const idxToValues = (idx) => {
  const curNum = Math.floor(idx / stateCount);
  const stateIdx = statesReversed[idx % stateCount];
  return [
    curNum,
    Math.floor(stateIdx / 10),
    stateIdx % 10
  ];
};

const maxIdx = getIdx(9, 9, 9);
let dp = Array(maxIdx + 1).fill(0);
for (let i = 1; i <= 9; i++) {
  dp[getIdx(i, i, i)] = 1;
}

for (let i = 2; i <= N; i++) {
  const newDP = Array(maxIdx + 1).fill(0);
  for (let i = 0; i <= maxIdx; i++) {
    const [curNum, l, r] = idxToValues(i);
    if (curNum !== 0) {
      const idx = getIdx(
        curNum - 1,
        Math.min(curNum - 1, l),
        r
      );
      newDP[idx] = (newDP[idx] + dp[i]) % mod;
    }
    if (curNum !== 9) {
      const idx = getIdx(
        curNum + 1,
        l,
        Math.max(r, curNum + 1)
      );
      newDP[idx] = (newDP[idx] + dp[i]) % mod;
    }
  }

  dp = newDP;
}

let out = 0;
for (let i = 0; i <= 9; i++) {
  out = (out + dp[getIdx(i, 0, 9)]) % mod;
}

// output
return out;
}
