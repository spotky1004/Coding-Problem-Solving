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
10 21
18 25`,
`11 75`);
check(`5
1 2
1 3
1 4
1 5
1 6`,
`1 6`);
check(`12
13 67
7 78
59 167
127 153
116 147
133 187
112 115
33 61
47 83
63 94
164 167
83 161`,
`419783776 306004046`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...fracs] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
 */
function genMinFactors(n) {
  const minFactors = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 4; i <= n; i += 2) {
    minFactors[i] = 2;
  }
  for (let i = 3; i <= n; i += 2) {
    if (minFactors[i] !== i) continue;
    let mul = i * 3;
    while (mul <= n) {
      if (minFactors[mul] === mul) minFactors[mul] = i;
      mul += i * 2;
    }
  }
  return minFactors;
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
  if (b === 0n) return 1n;
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

const MAX_NUM = 1e7;
const minFactors = genMinFactors(MAX_NUM);
const aFactorCounts = Array(MAX_NUM + 1).fill(0);
const bFactorCounts = Array(MAX_NUM + 1).fill(0);
for (let [Ai, Bi] of fracs) {
  Ai = Bi - Ai;
  while (Ai > 1) {
    const factor = minFactors[Ai];
    aFactorCounts[factor]++;
    Ai /= factor;
  }
  while (Bi > 1) {
    const factor = minFactors[Bi];
    bFactorCounts[factor]++;
    Bi /= factor;
  }
}

const p = 1_000_000_007n;
let A = 1n;
let B = 1n;

for (let i = 2; i <= MAX_NUM; i++) {
  const aCount = aFactorCounts[i];
  const bCount = bFactorCounts[i];
  const removeCount = Math.min(aCount, bCount);
  A = (A * divAndPow(BigInt(i), BigInt(aCount - removeCount), p)) % p;
  B = (B * divAndPow(BigInt(i), BigInt(bCount - removeCount), p)) % p;
}

// output
return `${A} ${B}`;
}
