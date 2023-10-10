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
check(`2
3
1 5 6
3
1 1 1`,
`4
9`);
check(`1
1
5`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[z], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number[]} arr 
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

const out = [];
const counts = Array(1e6 + 1).fill(0);
for (let line = 0; line < z * 2; line += 2) {
  const [n] = lines[line];
  const a = lines[line + 1];

  counts.fill(0);
  for (const ai of a) {
    counts[ai]++;
  }

  const dp = SOSdp(counts);

  let ans = 0;
  for (let i = 1; i <= 1e6; i++) {
    const count = counts[i];
    if (count === 0) continue;
    ans += count * dp[i];
  }
  out.push(ans);
}

// output
return out.join("\n");
}
