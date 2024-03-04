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
3
2
1
2`,
`1/3`);
check(`5
10
100
1000
10000
100000
10`,
`1/1`);
check(`5
11
101
1001
10001
100001
10`,
`0/1`);
check(`9
13
10129414190271203
102
102666818896
1216
1217
1218
101278001
1000021412678412681
21`,
`5183/36288`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [bigN, ...nums] = input
  .trim()
  .split("\n")
  .map(BigInt);
const N = Number(bigN);
const K = nums.pop();
const numK = Number(K);

// code
/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}



const MAX_DIGIT = 50 * N;
const expMod = [1n];
for (let i = 1; i <= MAX_DIGIT; i++) {
  expMod[i] = expMod[i - 1] * 10n % K;
}

const numDigits = Array(N).fill(-1);
for (let i = 0; i < N; i++) {
  numDigits[i] = nums[i].toString().length;
}
const bitDigits = Array(1 << N).fill(0);
for (let i = 0; i < bitDigits.length; i++) {
  let digit = 0;
  for (let j = 0; j < N; j++) {
    if (i & (1 << j)) digit += numDigits[j];
  }
  bitDigits[i] = digit;
}

const dp = Array(1 << N).fill(null);
for (let i = 0; i < N; i++) {
  const key = 1 << i;
  dp[key] = Array(numK).fill(0);
  dp[key][nums[i] % K]++;
}

for (let mask = 0; mask < dp.length; mask++) {
  if (dp[mask] !== null) continue;

  const curDp = Array(numK).fill(0);
  dp[mask] = curDp;
  for (let b = 0; b < N; b++) {
    const bit = 1 << b;
    if ((mask & bit) === 0) continue;

    const num = nums[b];
    const subKey = mask ^ bit;
    const subDigit = bitDigits[subKey];
    const subDp = dp[subKey];
    for (let subMod = 0n; subMod < K; subMod++) {
      const curCount = subDp[subMod];
      curDp[(num * expMod[subDigit] + subMod) % K] += curCount;
      curDp[(subMod * expMod[numDigits[b]] + num) % K] += curCount;
    }
  }

  for (let k = 0; k < numK; k++) {
    curDp[k] /= 2;
  }
}

let factN = 1;
for (let i = 2; i <= N; i++) factN *= i;

const correctCount = dp[dp.length - 1][0];
if (correctCount === 0) return "0/1";

const div = gcd(correctCount, factN);

// output
return `${correctCount / div}/${factN / div}`;
}
