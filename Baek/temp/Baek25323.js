const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`4
1 27 3 12`,
`YES`);
check(`2
2 1`,
`NO`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @returns {bigint} 
*/
function gcd(a, b) {
  if (b > a) [a, b] = [a, b];
  if (b === 0n) return a;
  return gcd(b, a % b);
}

function bigSqrt(x) {
  let left = 0n, right = x;
  while (left < right) {
    const mid = (left + right) / 2n;
    const midPow = mid ** 2n;
    if (midPow > x) right = mid - 1n;
    else if (midPow < x) left = mid + 1n;
    else return mid;
  }
  return left;
}



const sorted = [...A].sort((a, b) => Number(a - b));
for (let i = 0; i < A.length; i++) {
  let v1 = A[i];
  let v2 = sorted[i];
  const vGcd = gcd(v1, v2);
  v1 /= vGcd;
  v2 /= vGcd;
  if (v1 * v2 !== bigSqrt(v1 * v2)**2n) return "NO";
}

// output
return "YES";
}
