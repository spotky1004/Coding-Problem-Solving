const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`1 2 3`, `YES`);
check(`3 4 5`, `NO`);
check(`3 4 17`, `YES`);
check(`1234 9999 1234`, `YES`);
check(`999999999999999997 999999999999999999 1000000000000000000`, `NO`);
check(`5 0 6`, `NO`);
check(`5 6 0`, `NO`);
check(`5 0 5`, `YES`);
check(`5 5 5`, `YES`);
check(`1 1 123123`, `YES`);
check(`0 0 5`, `NO`);
check(`5 0 25`, `YES`);
check(`1 0 0`, `YES`);
check(`1 0 0`, `YES`);
check(`0 0 0`, `YES`);
check(`1001 1000 10000`, `NO`);
check(`999999999999999 1 1000000000000000`, `YES`);
check(`268 348 6166788`, `YES`);
check(`81 363 1016541`, `YES`);
check(`863 347 3339269`, `YES`);
check(`100 293 7247192`, `YES`); // babaabbabbaaabaabbbbbaaba
check(`35 809 10792213`, `YES`); // bbababaaabaabbbbabbaabaaa
check(`751 2 8886379`, `YES`); // bbbaaaabbbbaababbaaaabaab
check(`324 326 4350038`, `YES`); // bbaabbbabbababbaabaaaabbb
check(`46072 61074 223417012`, `YES`) // bbbbbbbaaaabbbbbbbababaaa
// for (let i = 0; i < 10000000; i++) {
//   const a = BigInt(Math.floor(10**(10 * Math.random())));
//   const b = BigInt(Math.floor(10**(10 * Math.random())));
//   let aCell = a;
//   let bCell = b;
//   let order = "";
//   for (let i = 0; i < 100; i++) {
//     if (Math.random() > 0.5) continue;
//     if (Math.random() > 0.5) {
//       aCell += bCell;
//       order += "a";
//     } else {
//       bCell += aCell
//       order += "b";
//     };
//   }
//   check(`${a} ${b} ${aCell}`, "YES");
//   check(`${a} ${b} ${bCell}`, "YES");
// }
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[a, b, S]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

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



if (a < b) [a, b] = [b, a];
const gcdABS = gcd(gcd(a, b), S);
if (gcdABS !== 0n) {
  a /= gcdABS;
  b /= gcdABS;
  S /= gcdABS;
}

if (a === S || b === S) return "YES";

const exGcdResult = exGcd(a, b, S);
if (exGcdResult === null) return "NO";

const [x, y] = exGcdResult;
const gcdXY = gcd(x, y);

if (
  (x === 0n && y === 0n) ||
  x < 0n ||
  y < 0n
) return "NO";
if (
  gcdXY === 1n ||
  (gcdXY === x && b === 0n) ||
  (gcdXY === y && a === 0n)
) return "YES";

let [xp, yp] = [x, y];
const gcdAB = gcd(a, b);
const [ap, bp] = [a / gcdAB, b / gcdAB];
while (yp > 0n) {
  if (gcd(xp, yp) === 1n) return "YES";
  xp += bp;
  yp -= ap;
}

// output
return "NO";
}
