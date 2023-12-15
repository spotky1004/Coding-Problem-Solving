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
check(`6 10
/   +--- \\
|   | 6  |
|   |--- |
| /\\| 3  |
|--------|
\\ 12 - 9 /`,
`353237869`);
check(`1 10
((((11))))`,
`11`);
check(`7 5
  3  
 --- 
  3  
-----
  1  
 --- 
  2  `,
`2`);
check(`1 1
5`,
`5`);
check(`3 9
// 100 \\\\
||-----||
\\\\ (5) //`,
`20`);
check(`3 3
   
123
   `,
`123`);
check(`3 8
  +-----
  |  +--
/\\|/\\|16`,
`2`);
check(`3 17
 1     ((9))     
--- + ------- -  
 0     1 + 8    5`,
`19981200`);
check(`4 6
 (10) 
------
   +- 
 /\\|4 `,
`5`);
check(`2 8
  +-    
/\\|4 + 3`,
`5`);
check(`6 6
   +- 
 /\\|4 
------
   +- 
   |1 
 /\\|  `,
`2`);
check(`3 9
/ 1 / 2 \\
|-------|
\\ 1 / 2 /`,
`1`);
check(`1 17
(2 * (2 + 3)) / 2`,
`5`)
check(`1 17
(1 / 2) + (3 / 6)`,
`1`);
check(`1 5
1 / 0`,
`19981204`);
check(`1 17
(1 + 2) * (3 + 4)`,
`21`);
check(`1 5
0 - 1`,
`1000000006`);
check(`1 12
(5 / 10) * 2`,
`1`);
check(`1 23
(1 + ((2 - 3) * 4)) + 5`,
`2`);
check(`2 5
  +--
/\\|25`,
`5`);
check(`1000 1000\n` +
"/".repeat(499) + "10" + "\\".repeat(499) + "\n" +
("|".repeat(499) + "  " + "|".repeat(499) + "\n").repeat(998) +
"\\".repeat(499) + "  " + "/".repeat(499) + "\n",
`10`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const expr = input
  .split("\n")
  .map(line => Array.from(line));
const [R, C] = expr.shift().join("").split(" ").map(Number);

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
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

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
  if (b === 0n) return 1n;

  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

/**
 * @param {bigint} n 
 * @param {bigint} c 
 * @returns {bigint[]} 
 */
function pollardRho(n, c = 1n) {
  n = BigInt(n);
  if (n === 1n || isPrime(n)) return n;
  if (n % 2n === 0n) return 2n;

  function g(x) {
    return (x * x + c) % n;
  }
  
  let a = 2n;
  let b = a;
  while (true) {
    a = g(a);
    b = g(g(b));
    if (a === b) return pollardRho(n, c + 1n);
    const dif = a - b;
    const d = gcd(n, dif > 0 ? dif : -dif);
    if (d === 1n) continue;
    return d;
  }
}

const millerRabinPrimes = [
  2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n,
  31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n
];
/**
 * @param {bigint} n 
 * @returns {boolean} 
*/
function isPrime(n) {
  if (n === 2n) return true;
  if (n < 2n) return false;

  n = BigInt(n);
  d = n - 1n;

  let r = 0n;
  while ((d & 1n) === 0n) {
    r++;
    d /= 2n;
  }

  l: for (const p of millerRabinPrimes) {
    if (n === p) return true;
    if (divAndPow(p, d, n) === 1n) continue;
    for (let i = 0n; i < r; i++) {
      if (divAndPow(p, 2n**i * d, n) === n - 1n) continue l;
    }
    return false;
  }
  return true;
}

/**
 * @param {bigint} n 
 */
function primeFactorization(n) {
  if (n <= 3n) return [n];
  const toFactorization = [n];
  const factors = [];
  for (const n of toFactorization) {
    if (isPrime(n)) {
      factors.push(n);
      continue;
    }
    const p = pollardRho(n);
    const q = n / p;
    if (isPrime(p)) factors.push(p);
    else if (p !== 1n) toFactorization.push(p);
    if (isPrime(q)) factors.push(q);
    else if (q !== 1n) toFactorization.push(q);
  }
  return factors.sort((a, b) => Number(a - b));
}

/**
 * @param {bigint} n 
 * @param {bigint[]} factors 
*/
function eularPhi(n, factors) {
  let out = n;
  for (const factor of [...new Set(factors)]) {
    out -= out / factor;
  }
  return out;
}

/**
 * @param {bigint} x 
 * @param {bigint} n 
 * @param {bigint[]} phiNFactorization 
 */
function calcOrder(x, n, phiNFactorization) {
  if (gcd(x, n) !== 1n) return -1n;
  
  let order = phiNFactorization.reduce((a, b) => a * b, 1n);

  for (const p of phiNFactorization) {
    if (divAndPow(x, order / p, n) !== 1n) continue;
    order /= p;
  }

  return order;
}

/**
 * @param {bigint} n 
 * @param {bigint} phiN 
 */
function findPrimitiveRoot(n, phiN) {
  const phiNFactorization = primeFactorization(phiN);
  let g = 2n;
  while (true) {
    const result = calcOrder(g, n, phiNFactorization);
    if (result === phiN) return g;
    g++;

    if (g === n) break;
  }
  return -1n;
}

/**
 * @param {bigint} n 
 */
function genLogSolver(n) {
  if (!isPrime(n)) throw "TBA: CRT";

  const phiN = eularPhi(n, primeFactorization(n));
  const g = findPrimitiveRoot(n, phiN);

  const sqrtPhiN = BigInt(200_0000);

  /** @type {bigint[]} */
  const pow1Map = new Map();
  let pow1CurVal = 1n;
  for (let i = 0n; i < sqrtPhiN; i++) {
    pow1Map.set(pow1CurVal, i);
    pow1CurVal = pow1CurVal * g % n;
  }
  /** @type {bigint[]} */
  const pow2 = Array(Math.ceil(Number(phiN) / Number(sqrtPhiN)));
  pow2[0] = 1n;
  pow2[1] = divAndPow(g, sqrtPhiN, n) % n;
  for (let i = 2; i < pow2.length; i++) {
    pow2[i] = pow2[i - 1] * pow2[1] % n;
  }
  
  /** @type {Map<bigint, bigint>} */
  const logCache = new Map();
  /**
   * Solves "g^? = x"
   * @param {bigint} x 
   */
  function log(x) {
    if (logCache.has(x)) return logCache.get(x);

    const inv = divAndPow(x, n - 2n, n);

    t = -1n;
    for (let i = 0; i < pow2.length; i++) {
      t++;

      const l = inv * pow2[i] % n;
      if (!pow1Map.has(l)) continue;

      const result = t * sqrtPhiN - pow1Map.get(l);
      logCache.set(x, result);
      return result;
    }

    return -1n;
  }

  /** @type {Map<bigint, bigint>} */
  const sqrtCache = new Map();
  /**
   * Solves "?^r = x"
   * @param {bigint} x 
   * @param {bigint} r root
   */
  function sqrt(x, r = 2n) {
    const key = `${x},${r}`;
    if (sqrtCache.has(key)) sqrtCache.get(key);
    x %= n;

    if (x === 0n) return [0n];

    // "?^r = x (mod n)" -> "g^(ur) = g^v (mod n)" -> "g^(ur - v) = 1 (mod n)" -> "ur = v (mod phi(n))" -> "ru + phi(n)t = v"
    const v = log(x);
    const exGcdVal = exGcd(r, phiN, v);
    if (exGcdVal === null) return -1n;
    let [u, , uShift] = exGcdVal;
    /** @type {Set<bigint>} */
    const ansSet = new Set();
    while (true) {
      const ans = divAndPow(g, u, n);
      if (ansSet.has(ans)) break;
      ansSet.add(ans);
      u = (u + uShift) % phiN;
    }
    
    const result = [...ansSet].sort((a, b) => Number(a - b));
    sqrtCache.set(key, result);
    return result;
  }

  return { g, log, sqrt };
}



/**
 * @typedef {"number" | "bracket" | "sqrt" | "operation" | "fraction"} ExprType 
 */
const p = 1_000_000_007n;
const nums = "0123456789";

/**
 * @param {number} xs 
 * @param {number} ys 
 * @param {number} w 
 * @param {number} h 
 * @returns {ExprType} 
 */
function checkType(xs, ys, w, h) {
  if (w === 0 || h === 0) throw "??";

  const xe = xs + w - 1;
  const ye = ys + h - 1;

  checkSqrt: if (
    w >= 2 &&
    expr[ye][xs] === "/" &&
    expr[ye][xs + 1] === "\\"
  ) {
    for (let x = xs + 3; x <= xe; x++) {
      if (expr[ys][x] !== "-") break checkSqrt;
    }
    return "sqrt";
  }

  let bracketLevel = 0;
  for (let x = xs; x <= xe; x++) {
    const c = expr[ys][x];
    const c2 = h !== 1 ? expr[ys + 1][x] : null;
    if (
      (h === 1 && c === "(") ||
      (h !== 1 && c === "/" && (c2 === "|" || c2 === "\\"))
    ) bracketLevel++;
    if (
      (h === 1 && c === ")") ||
      (h !== 1 && c === "\\")
    ) bracketLevel--;
    if (
      x === xe &&
      bracketLevel === 0 &&
      x !== xs
    ) return "bracket";
    if (bracketLevel === 0) break;
  }

  loop: for (let y = ys; y <= ye; y++) {
    let isFrac = true;
    let isNum = true;
    for (let x = xs; x <= xe; x++) {
      const c = expr[y][x];
      if (isFrac && c !== "-") isFrac = false;
      if (isNum && !nums.includes(c)) isNum = false;

      if (!isFrac && !isNum) continue loop;
    }

    if (isFrac) return "fraction";
    if (isNum) return "number";
  }

  return "operation";
}

const { sqrt } = genLogSolver(p);

/**
 * @param {ExprType} type 
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {"+" | "-" | "*" | "/"} op 
 */
function evaluate(type, a, b = -1n, op = "+") {
  let result = -1n;
  if (type === "number" || type === "bracket") result = a;
  else if (type === "sqrt") {
    const sqrtResult = sqrt(a * a % p, 4n);
    if (typeof sqrtResult === "bigint") throw "??";
    else result = sqrtResult[0];
  }
  else if (type === "operation") {
    if (op === "+") result = a + b;
    if (op === "-") result = a - b;
    if (op === "*") result = a * b;
    if (op === "/") {
      if (b === 0n) result = 19981204n;
      else result = a * divAndPow(b, p - 2n, p);
    }
  }
  else if (type === "fraction") {
    if (b === 0n) result = 19981204n;
    else result = a * divAndPow(b, p - 2n, p);
  }

  result = ((result % p) + p) % p;
  return result;
}

/**
 * @param {bigint} xs 
 * @param {bigint} ys 
 * @param {bigint} w 
 * @param {bigint} h 
 * @returns {bigint} 
 */
function parse(xs, ys, w, h) {
  if (w === 0 || h === 0) throw "??";

  const xe = xs + w - 1;
  const ye = ys + h - 1;

  const type = checkType(xs, ys, w, h);
  let result = -1n;

  // console.log(type, xs, ys, w, h);
  // console.log(Array.from({ length: h }, (_, i) => expr[ys + i].slice(xs, xs + w).join("")).join("\n"));

  if (type === "number") {
    loop: for (let y = ys; y <= ye; y++) {
      for (let x = xs; x <= xe; x++) {
        const c = expr[y][x];
        if (!nums.includes(c)) continue loop;
      }

      result = evaluate("number", BigInt(expr[y].slice(xs, xs + w).join("")));
      break;
    }
  } else if (type === "bracket") {
    result = evaluate("bracket", parse(xs + 1, ys, w - 2, h));
  } else if (type === "sqrt") {
    result = evaluate("sqrt", parse(xs + 3, ys + 1, w - 3, h - 1));
  } else if (type === "operation") {
    const xsp = xs + 1;
    const xep = xs + w - 2;
    const ysp = ys;
    const yep = ys + h - 1;

    const firstChar = expr[ys][xs];
    let bracketLevel = firstChar === "(" || firstChar === "/" ? 1 : 0;

    loop: for (let x = xsp; x <= xep; x++) {
      const c = expr[ys][x];
      if (
        (h === 1 && c === "(") ||
        (
          h >= 2 &&
          c === "/" &&
          (
            expr[ys + 1][x] === "|" ||
            expr[ys + 1][x] === "\\"
          )
        )
      ) bracketLevel++;
      if (
        (h === 1 && c === ")") ||
        (h >= 2 && c === "\\")
      ) bracketLevel--;
      if (bracketLevel !== 0) continue;

      for (let y = ysp; y <= yep; y++) {
        if (
          expr[y][x - 1] !== " " ||
          expr[y][x + 1] !== " "
        ) continue loop;
      }

      const op = expr[ys + Math.floor(h / 2)][x];
      const lWidth = x - xs - 1;
      const rWidth = w - lWidth - 3;
      result = evaluate("operation", parse(xs, ys, lWidth, h), parse(x + 2, ys, rWidth, h), op);
      break;
    }
  } else if (type === "fraction") {
    for (let y = ys + h - 1; y >= ys; y--) {
      if (!expr[y].slice(xs, xs + w).every(c => c === "-")) continue;

      const uHeight = y - ys;
      const dHeight = h - uHeight - 1;
      result = evaluate("fraction", parse(xs + 1, ys, w - 2, uHeight), parse(xs + 1, y + 1, w - 2, dHeight));
      break;
    }
  }

  // console.log(type, xs, ys, w, h);
  // console.log(Array.from({ length: h }, (_, i) => expr[ys + i].slice(xs, xs + w).join("")).join("\n"));
  // console.log(result);

  return result;
}

const result = parse(0, 0, C, R);

// output
return result.toString();
}
