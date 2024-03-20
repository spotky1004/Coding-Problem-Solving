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
3
4
6
15
429817672`,
`1 5 9
1 16
1 9 28 36
1 20 52 113 174 206 225
1 20754756089683012 39145712577323067 70722018579373302 114021212584126283 145597518586176518 163988475073816573 184743231163499584`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [T, ...cases] = input
  .trim()
  .split("\n")
  .map(BigInt);

// code
/**
 * @template {number | bigint} T 
 * @param {T} a 
 * @param {T} b 
 * @returns {T} 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

/**
 * Solves "ax + by = n"
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} n 
 * @returns {[x: bigint, y: bigint, xShift: bigint, yShift: bigint]?} 
 */
function exGcd(a, b, n) {
  if (a > b) {
    const value = exGcd(b, a, n);
    if (!value) return null;
    let [y, x] = value;
    if (b !== 0n) {
      let t = -x / b;
      if (b * t < -x) t++;
      x += b * t;
      y -= a * t;
    }
    return [x, y, b, a];
  }

  if (a === 0n && b === 0n) {
    if (n === 0n) return [0n, 0n, 0n, 0n];
    return null;
  }
  if (a === 0n) {
    if (gcd(b, n) !== b) return null;
    return [0n, n / b, 0n, 0n];
  }
  if (b === 0n) {
    if (gcd(a, n) !== a) return null;
    return [n / a, 0n, 0n, 0n];
  }
  if (n === 0n) return [0n, 0n, 0n, 0n];

  const aModGcd = gcd(a, b);
  if (n % aModGcd !== 0n) return null;
  
  a /= aModGcd;
  b /= aModGcd;
  n /= aModGcd;
  let [xp, yp] = exGcdImpl(a, b);
  let x = xp * n;
  let y = yp * n;
  let t = -x / b;
  if (b * t < -x) t++;
  x += b * t;
  y -= a * t;
  return [x, y, b, a];
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



const out = [];
for (const n of cases) {
  const solsSet = new Set();
  const n2 = 2n * n;
  const sqrtN2 = BigInt(Math.ceil(Math.sqrt(Number(n2))));
  for (let a = 1n; a <= sqrtN2; a++) {
    if (n2 % a !== 0n) continue;
    const b = n2 / a;
    let exGcdSol = exGcd(a, b, 1n);
    if (exGcdSol !== null) {
      const sol = a * exGcdSol[0] - 1n;
      if (0n <= sol && sol < n) solsSet.add(sol);
    }
    exGcdSol = exGcd(b, a, 1n);
    if (exGcdSol !== null) {
      const sol = b * exGcdSol[0] - 1n;
      if (0n <= sol && sol < n) solsSet.add(sol);
    }
  }

  const pos = [];
  for (const sol of solsSet) {
    const y = sol * (sol + 1n) / n2;
    const x = sol - y;
    pos.push([x, y]);
  }

  const ans = [];
  for (const [x, y] of pos) {
    ans.push(x + n * y + 1n);
    ans.push((n - x - 1n) + n * (n - y - 1n) + 1n);
  }
  out.push([...new Set(ans)].sort((a, b) => Number(a - b)).join(" "));
}

// output
return out.join("\n");
}
