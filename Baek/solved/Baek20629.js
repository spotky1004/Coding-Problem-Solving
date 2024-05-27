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
2 3 1 4 5 6
3 1 2 5 4 6`,
`4`);
check(`6
1 2 3 4 5 6
3 1 2 5 4 6`,
`0`);
check(`6
2 3 1 4 5 6
3 4 5 6 1 2`,
`-1`);
check(`6
6 5 4 3 2 1
6 5 4 3 2 1`,
`1`);
check(`4
3 4 2 1
3 4 2 1`,
`3`);
check(`4
4 3 2 1
2 4 1 3`,
`2`);
check(`1
1
1`,
`0`);
check(`6
1 5 2 4 6 3
1 5 2 4 6 3`,
`3`);
check(`9
1 2 3 4 5 6 8 7 9
3 1 4 6 9 5 8 7 2`,
`7`);
check(`9
4 1 5 8 9 7 2 3 6
8 4 9 3 6 2 1 5 7`,
`4`);
check(`9
1 2 3 4 6 9 7 8 5
3 7 2 1 6 9 4 8 5`,
`5`);
check(`10
3 4 5 1 8 9 2 6 7 10
6 5 9 8 7 4 3 2 1 10`,
`2`);
check(`10
1 2 3 4 5 6 7 8 10 9
5 8 6 2 3 4 7 1 10 9`,
`7`);
check(`10
1 2 3 4 5 6 7 8 9 10
1 2 3 4 5 6 7 8 9 10`,
`0`);
check(`11
1 2 3 4 5 6 7 8 9 10 11
4 9 3 8 11 10 7 5 2 6 1`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], P, Q] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

/**
 * Solves "ax + by = n"
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} n 
 * @returns {[x: bigint, y: bigint]?} 
*/
function exGcd(a, b, n) {
  if (a > b) {
    const value = exGcd(b, a, n);
    if (!value) return null;
    let [y, x] = value;
    if (b !== 0n) {
      let t = -x / b;
      if (t > 0n) t++;
      x += b * t;
      y -= a * t;
    }
    return [x, y];
  }

  if (a === 0n && b === 0n) {
    if (n === 0n) return [0n, 0n];
    return null;
  }
  if (a === 0n) {
    if (gcd(b, n) !== b) return null;
    return [0n, n / b];
  }
  if (b === 0n) {
    if (gcd(a, n) !== a) return null;
    return [n / a, 0n];
  }
  if (n === 0n) return [0n, 0n];

  const aModGcd = gcd(a, b);
  if (n % aModGcd !== 0n) return null;
  
  a /= aModGcd;
  b /= aModGcd;
  n /= aModGcd;
  let [xp, yp] = exGcdImpl(a, b);
  let x = xp * n;
  let y = yp * n;
  let t = -x / b;
  if (t > 0n) t++;
  x += b * t;
  y -= a * t;
  return [x, y];
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @returns {[x: bigint, y: bigint]} 
 */
function exGcdImpl(a, b) {
  if (a < b) return exGcdImpl(b, a);
  const r = a % b;
  const q = (a - r) / b;
  if (r === 0n) return [1n, 0n];
  const [yp, xp] = exGcdImpl(b, r);
  return [xp - q * yp, yp];
}

/**
 * @param {[x: bigint, m: bigint][]} exprs 
*/
function crt(exprs) {
  let [a1, m1] = exprs[0];
  for (let i = 1; i < exprs.length; i++) {
    let [a2, m2] = exprs[i];
    const g = gcd(m1, m2);
    if ((a2 - a1) % g !== 0n) return null;
    const newM = m1 * m2 / g;
    a1 = (((a1 + m1 * (((a2 - a1) / g) * exGcd(m1 / g, m2 / g, 1n)[0] % (m2 / g))) % newM) + newM) % newM;
    m1 = newM;
  }
  return [a1, m1];
}

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}



for (let i = 0; i < N; i++) P[i]--, Q[i]--;
const pInv = new Map(P.map((v, i) => [v, i]));

const seen = Array(N + 1).fill(false);
const cycles = [];
for (let i = 0; i < N; i++) {
  if (seen[i]) continue;
  seen[i] = true;

  const cycle = [i];
  cycles.push(cycle);

  let cur = Q[i];
  while (cur !== i) {
    seen[cur] = true;
    cycle.push(cur);
    cur = Q[cur];
  }
}

const exprs = [];
for (const cycle of cycles) {
  const set = new Set(cycle);
  if (cycle.some(v => !set.has(pInv.get(v)))) return -1;
  let solvedAt = -1;
  const cycleItems = cycle.map((v => [pInv.get(v), v])).sort((a, b) => a[0] - b[0]).map(v => v[1]);
  for (let i = 0; i < cycle.length; i++) {
    if (isSorted(cycleItems)) {
      solvedAt = i;
      break;
    }
    for (let j = 0; j < cycle.length; j++) {
      cycleItems[j] = Q[cycleItems[j]];
    }
  }
  if (solvedAt === -1) return -1;
  exprs.push([solvedAt, cycle.length].map(BigInt));
}

const ans = crt(exprs);

// output
return ans !== null ? ans[0] : -1;
}
