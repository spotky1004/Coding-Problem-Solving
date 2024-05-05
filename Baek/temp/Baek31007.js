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
4 3
2 3 4
3 2
2 3
5 1
5`,
`bnb2011
bnb2011
amsminn`);
check(`1
150 300
${Array.from({ length: 300 }, (_, i) => Math.floor(i / 2) + 1).join(" ")}`,
``);
check(`1
30 4
2 3 5 30`,
`amsminn`);
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



const primes = genPrimes(150);
const isPrime = Array(151).fill(false);
for (const p of primes) isPrime[p] = true;

let nonDupePrimeCount = 0;
for (let i = 1; i < 75; i++) {
  nonDupePrimeCount += isPrime[i];
}

const MAX_MASK = (1 << nonDupePrimeCount) - 1;
const maskBitCounts = Array(MAX_MASK + 1).fill(0);
for (let b = 0; b < nonDupePrimeCount; b++) {
  const value = 1 << b;
  for (let i = value; i <= MAX_MASK; i += value) {
    maskBitCounts[i]++;
  }
}

const masks = [];
masks.push(null);
for (let i = 1; i <= 150; i++) {
  let mask = 0;
  for (let b = 0; b < nonDupePrimeCount; b++) {
    const p = primes[b];
    if (i % p === 0) mask |= 1 << b;
  }
  masks.push(mask === 0 ? null : mask);
}

const sortedMasks = Array.from({ length: MAX_MASK + 1 }, (_, i) => i);
sortedMasks.sort((a, b) => maskBitCounts[a] - maskBitCounts[b]);

const out = [];
for (let caseNr = 0; caseNr < T; caseNr++) {
  const [N, M] = lines[2 * caseNr];
  const cards = lines[2 * caseNr + 1];

  /** @type {boolean[]} */
  const cardCounts = Array(151).fill(0);
  for (const card of cards) cardCounts[card]++;

  let isResultInv = cardCounts[1] % 2 ? 1 : 0;
  for (let i = 76; i < 150; i++) {
    if (isPrime[i] && cardCounts[i] > 0) isResultInv ^= 1;
  }
  /** @type {Set<number>} */
  const avaiableMasksSet = new Set();
  let startState = 0;
  for (let i = 1; i <= 150; i++) {
    if (cardCounts[i] === 0) continue;
    const mask = masks[i];
    if (mask === null) continue;
    startState |= mask;
    avaiableMasksSet.add(mask);
  }

  const avaiableMasks = [...avaiableMasksSet];
  const dp = Array(MAX_MASK + 1).fill(null);
  function search(dpMask) {
    if (dp[dpMask] !== null) return dp[dpMask];
    let canWin = 0;
    for (const cardMask of avaiableMasks) {
      if ((dpMask & cardMask) !== cardMask) continue;
      canWin |= !search(dpMask ^ cardMask);
    }
    dp[dpMask] = canWin;
    return canWin;
  }
  search(startState);

  out.push(dp[startState] ^ isResultInv ? "amsminn" : "bnb2011");
}

// output
return out.join("\n");
}
