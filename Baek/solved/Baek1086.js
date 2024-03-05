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
check(`15
12345678
81234567
78123456
67812345
56781234
45678123
34567812
23456781
12345678
81234567
78123456
67812345
56781234
45678123
34567812
98`,
`1357529/127702575`);
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
const bigK = nums.pop();
const K = Number(bigK);

// code
/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}



const MAX_DIGIT = 50 * N;
const expMod = [1];
for (let i = 1; i <= MAX_DIGIT; i++) {
  expMod[i] = expMod[i - 1] * 10 % K;
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

const numMods = [];
for (let i = 0; i < N; i++) {
  numMods.push(Number(nums[i] % bigK));
}

const dp = Array(1 << N).fill(null);
for (let i = 0; i < N; i++) {
  const key = 1 << i;
  dp[key] = Array(K).fill(0);
  dp[key][numMods[i] % K]++;
}

const bits = [];
for (let i = 0; i < N; i++) {
  bits.push(1 << i);
}

for (let mask = 0; mask < dp.length; mask++) {
  if (dp[mask] !== null) continue;

  const curDp = Array(K).fill(0);
  dp[mask] = curDp;
  for (let b = 0; b < N; b++) {
    const bit = bits[b];
    if (!(mask & bit)) continue;

    const num = numMods[b];
    const subKey = mask ^ bit;
    const subDigitExp = expMod[bitDigits[subKey]];
    const curExp = expMod[numDigits[b]];
    const subDp = dp[subKey];

    const numMul = num * subDigitExp;
    for (let subMod = 0; subMod < K; subMod++) {
      const curCount = subDp[subMod] / 2;
      curDp[(numMul + subMod) % K] += curCount;
      curDp[(subMod * curExp + num) % K] += curCount;
    }
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
