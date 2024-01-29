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
check(`2
2 19
4 3541`,
`16 4
49 7
3542 2
3543 3
3544 4
3545 5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {number[]} */
  const primes = [];
  const net = Array(n).fill(true);
  for (let i = 2; i <= n; i++) {
    if (net[i]) primes.push(i);
    for (const p of primes) {
      const a = i * p;
      if (a > n) break;
      net[a] = false;
      if (i % p === 0) break;
    }
  }
  return primes;
}



const primes = genPrimes(100).map(BigInt);

const out = [];
caseLoop: for (const tc of cases) {
  const N = Number(tc[0]);
  const P = Array.from(tc[1]).map(Number);
  let count = 0;
  for (let i = N - 1; i >= 0; i--) {
    const tmp = P[i];
    for (let j = 1; j <= 9; j++) {
      if (tmp === j) continue;
      P[i] = j;
      const num = BigInt(P.join(""));
      for (const p of primes) {
        if (num % p !== 0n || num === p) continue;
        count++;
        out.push(`${num} ${p}`);
        if (count >= N) continue caseLoop;
        break;
      }
    }
    P[i] = tmp;
  }
}

// output
return out.join("\n");
}
