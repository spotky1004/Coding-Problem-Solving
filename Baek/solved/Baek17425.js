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
check(`5
1
2
10
70
10000`,
`1
4
87
4065
82256014`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [T, ...cases] = input
  .trim()
  .split("\n")
  .map(Number);

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
 * @param {number[]} arr
*/
function prefixSum(arr) {
  if (arr.length === 0) return [];

  const sumArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    sumArr[i] = sumArr[i - 1] + arr[i];
  }
  return sumArr;
}



const minFactors = genMinFactors(1e6 + 1);
const factorSums = Array(1e6 + 1).fill(0);
for (let i = 1; i <= 1e6; i++) {
  let sum = 1;
  let j = i;
  while (j > 1) {
    const minFactor = minFactors[j];
    let count = 0;
    let mul = 0;
    while (minFactor === minFactors[j]) {
      j /= minFactors[j];
      count++;
      mul += minFactor ** count;
    }
    sum += sum * mul;
  }
  factorSums[i] = sum;
}
const ans = prefixSum(factorSums);

const out = [];
for (const N of cases) {
  out.push(ans[N]);
}

// output
return out.join("\n");
}
