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
check(`1
500000004 2 5`,
`500000004
250000003
875000008
62500003
968750010`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b) {
  if (b === 0n) return 1n;
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % mod;
    }
    curMul = curMul**2n % mod;
  }
  return out;
}



const mod = 1_000_000_007n;
const out = [];
console.log(divAndPow(500000004n, 2n));
for (let [p, c, n] of cases) {
  p = BigInt(p);

  const dp = Array(n + 1);
  dp[0] = 0n;

  const pinv = (1n - p + mod) % mod;
  const pc = divAndPow(p, BigInt(c));
  console.log(pc);
  for (let i = 1; i <= n; i++) {
    let sum = 0n;
    if (i >= c) sum += pc * (dp[i - c] + 1n);
    sum += pinv * dp[i - 1];
    sum += p * (dp[i - 1] + 1n);
    sum %= mod;
    console.log(p * (dp[i - 1] + 1n) % mod, i >= c ? pc * (dp[i - c] + 1n) % mod : null, pinv * dp[i - 1] % mod, pinv, dp[i - 1]);

    dp[i] = sum;
    out.push(sum);
  }
}

// output
return out.join("\n");
}
