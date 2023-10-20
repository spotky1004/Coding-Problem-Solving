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
check(`4 2
0 1 2 3`,
`1 1 2`);
check(`6 2
0 1 2 2 2 3`,
`6 6 6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number[]} arr 
 * @returns {number[]} 
 */
function SOSdp(arr) {
  const bitLen = Math.ceil(Math.log2(arr.length));
  const maxNum = 2**bitLen;
  
  const out = [...arr, ...Array(maxNum - arr.length).fill(0)];
  for (let i = 0; i < bitLen; i++) {
    const iMask = 1 << i;
    for (let j = 0; j < maxNum; j++) {
      if ((j & iMask) === 0) continue;
      out[j] += out[j^iMask];
    }
  }
  
  return out;
}



const MAX_BIT = Math.ceil(Math.log2(1e6) + 1);
const MAX_NUM = 2**MAX_BIT - 1;

const counts = Array(MAX_NUM + 1).fill(0);
for (const Ai of A) counts[Ai]++;
const dp = SOSdp(counts);

let andSum = 0;
let  orSum = 0;
let xorSum = 0;

for (let i = 0; i <= MAX_NUM; i++) {
  const count = counts[i];
  if (count === 0) continue;

  if ((i & K) === K) {
    console.log(i, counts[i], N, dp[K], counts[K]);
    andSum += counts[i] * (N - dp[K] + counts[K] - 1);
  }
  if ((i | K) <= K) {
    orSum += counts[i] * (dp[K] - 1) / 2;
  }
}

// output
return `${andSum} ${orSum} ${xorSum}`;
}
