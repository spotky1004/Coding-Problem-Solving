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
check(`4 8
4 6 1 3
5 4 1 7`,
`86`);
check(`9 29
10 7 1 8 0 7 5 5 4
14 8 8 12 1 4 11 6 0`,
`791`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, p], A, B] = input
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



const MAX_NUM = (1 << 17) - 1;
const aCounts = Array(MAX_NUM + 1).fill(0);
const bCounts = Array(MAX_NUM + 1).fill(0);

for (const Ai of A) aCounts[Ai]++;
for (const Bi of B) bCounts[Bi]++;

const aSOSDp = SOSdp(aCounts);
const bSOSDp = SOSdp(bCounts);

const extraScoreCounts = Array(MAX_NUM + 1).fill(0);
for (let i = 0; i <= MAX_NUM; i++) {
  extraScoreCounts[i] = (N - aSOSDp[MAX_NUM ^ i]) - (N - bSOSDp[MAX_NUM ^ i]);
}
console.log(extraScoreCounts);

// output
return "answer";
}
