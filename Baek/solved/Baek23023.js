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
check(`6
3 3
1 2 3
3 3
23 29 41
3 2
23 29 41
4 4
23 29 31 37
5 2
10 20 30 40 50
5 3
10 20 30 40 50`,
`1
4
2
4
1
1`);
check(`1
15 8
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15`,
`1`);
check(`1
8 6
1 2 3 4 5 6 7 8`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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



const primes = genPrimes(5001000);
const scoreAt = [2, 1, 1];
let l = 0, r = 2;
for (let i = 3; i <= 5000000; i++) {
  if (primes[r] === i) r++;
  scoreAt.push(Math.min(primes[r] - i, i - primes[l]));
  if (primes[l + 1] === i) l++;
}

const bitCounts = Array.from({ length: 16 }, () => []);
const subMasks = [];
for (let mask = 0; mask <= 32767; mask++) {
  const subMask = [];
  subMasks.push(subMask);
  let bitCount = 0;
  for (let b = 0; b <= 15; b++) {
    const bitValue = 1 << b;
    if ((mask & bitValue) === 0) continue;
    bitCount++;
    subMask.push(bitValue);
    for (const v of subMask) {
      if (v & bitValue) break;
      subMask.push(v + bitValue);
    }
  }
  bitCounts[bitCount].push(mask);
}

const out = [];
for (let caseNr = 0; caseNr < T; caseNr++) {
  const [m, n] = lines[2 * caseNr];
  const v = lines[2 * caseNr + 1];

  const maxMask = (1 << m) - 1;
  const scores = Array(maxMask + 1).fill(Infinity);
  for (let mask = 1; mask <= maxMask; mask++) {
    let score = 0;
    for (let b = 0; b < m; b++) if (mask & (1 << b)) score += v[b];
    scores[mask] = scoreAt[score];
  }

  let dp = scores;
  for (let i = 1; i < n; i++) {
    const newDp = Array(maxMask + 1).fill(Infinity);
    for (let mask1 = 1; mask1 <= maxMask; mask1++) {
      for (const mask2 of subMasks[mask1]) {
        newDp[mask1] = Math.min(newDp[mask1], Math.max(dp[mask1 ^ mask2], scores[mask2]));
      }
    }
    dp = newDp;
  }
  out.push(dp[maxMask]);
}

// output
return out.join("\n");
}
