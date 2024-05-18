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
check(`2`, `1666`);
check(`3`, `2666`);
check(`6`, `5666`);
check(`187`, `66666`);
check(`500`, `166699`);
check(`1`, `666`);
// let i = 0;
// for (let n = 0; n < 100000000; n++) {
//   if (n.toString().includes("666")) {
//     i++;
//     check(`${i}`, `${n}`);
//   }
// }
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @param {number} len 
 * @param {string} startsWith 
 */
function S(len, startsWith = "") {
  let count = 0n;
  let dp = Array(3).fill(0n);
  if (startsWith === "") {
    dp[0] = 9n;
    dp[1] = 1n;
  } else if (startsWith.includes("666")) count++;
  else if (startsWith.endsWith("66")) dp[2]++;
  else if (startsWith.endsWith("6")) dp[1]++;
  else dp[0]++;

  for (let i = Math.max(1, startsWith.length); i < len; i++) {
    const newDp = Array(3).fill(0n);
    newDp[0] = 9n * (dp[0] + dp[1] + dp[2]);
    newDp[1] = dp[0];
    newDp[2] = dp[1];
    count = 10n * count + dp[2];
    dp = newDp;
  }
  return count;
}

let len = 0;
let firstDigits = "";
while (S(len) < N) len++;
let sum = S(len - 1);
for (let i = 0; i < len; i++) {
  let subSum = sum;
  for (let j = i !== 0 ? 0 : 1; j <= 9; j++) {
    const s = S(len, firstDigits + j);
    if (subSum + s < N) {
      subSum += s;
      continue;
    }
    firstDigits += j;
    break;
  }
  sum = subSum;
}

// output
return firstDigits;
}
