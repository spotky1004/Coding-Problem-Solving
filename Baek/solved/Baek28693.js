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
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`1`,
`1`);
check(`2`,
`666666674`);
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
const divAndPowDP = Array(4000000);
/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b, p) {
  if (typeof divAndPowDP[Number(a)] !== "undefined") return divAndPowDP[Number(a)];
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  divAndPowDP[Number(a)] = out;
  return out;
}

const p = 1_000_000_007n;

function frac(a, b) {
  return (BigInt(a) * divAndPow(BigInt(b), p - 2n, p)) % p;
}
function sum(...values) {
  return values.reduce((a, b) => a + BigInt(b), 0n) % p;
}

const dp = Array.from({ length: Number(N) + 1 }, () => Array(Number(N) + 1).fill(0n));
for (let i = 0; i <= Number(N); i++) {
  dp[i][i] = BigInt(i);
}

function c(a, b) {
  console.log(a, b);
}

for (let i = 1; i <= Number(N); i++) {
  for (let j = i - 1; j >= 0; j--) {
    const ni = BigInt(i);
    const nj = BigInt(j);
    dp[i][j] = sum(
      frac(
        nj * ((dp[i - 1][j - 1] ?? 0n) + 1n),
        2n * ni - nj
      ),
      frac(
        (2n * ni - 2n * nj) * ((dp[i - 1][j] ?? 0n) + 1n),
        (2n * ni - nj) * (2n * ni - nj - 1n)
      ),
      frac(
        (2n * ni - 2n * nj) * (2n * ni - 2n * nj - 2n) * ((dp[i][j + 2] ?? 0n) + 1n),
        (2n * ni - nj) * (2n * ni - nj - 1n)
      ),
      frac(
        nj * (2n * ni - 2n * nj) * ((dp[i - 1][j] ?? 0n) + 2n),
        (2n * ni - nj) * (2n * ni - nj - 1n)
      )
    );
  }
}

// output
return dp[N][0] + "";
}
