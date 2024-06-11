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
check(`3 2 1
3 5 7
5 6 7`,
`YES
2 1 0
2 1 0`);
check(`3 2 1
3 5 7
6 5 4`,
`NO`);
check(`3 4 8
1 8 32
9 4 8`,
`YES
4 1 0
1 1 3`);
check(`5 1 1
1 0 0 0 2
1 0 0 0 2`,
`YES
0 0 0 0 0
0 0 0 0 0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, P, Q], A, B] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * Solves "ax + by = n"
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} n 
 * @returns {[x: bigint, y: bigint, xShift: bigint, yShift: bigint]?} 
*/
function egcd(a, b, c) {
  const aSign = a >= 0 ? 1 : -1;
  const bSign = b >= 0 ? 1 : -1;
  if (a < 0) a *= -1;
  if (b < 0) b *= -1;

  if (a === 0 && b === 0) {
    if (c === 0) return [0, 0, 1, 1];
    return null;
  }
  if (a === 0) {
    if (c % b !== 0) return null;
    return [0, Math.floor(c / b) * bSign, 0, Math.floor(c / b) * bSign];
  }
  if (b === 0) {
    if (c % a !== 0) return null;
    return [Math.floor(c / a) * aSign, 0, Math.floor(c / a) * aSign, 0];
  }
  
  let r0 = a, r1 = b;
  let x0 = 1, x1 = 0, y0 = 0, y1 = 1;
  let q = 0, tmp;
  while (r1 > 0) {
    q = Math.floor(r0 / r1);
    tmp = r0;
    r0 = r1, r1 = tmp - r1 * q;
    tmp = x0;
    x0 = x1, x1 = tmp - x1 * q;
    tmp = y0;
    y0 = y1, y1 = tmp - y1 * q;
  }

  const gcd = r0;
  if (c % gcd !== 0) return null;
  const mul = Math.floor(c / gcd);
  let x = x0 * mul, y = y0 * mul;
  let xp = Math.floor(b / gcd), yp = Math.floor(-a / gcd);
  if (xp !== 0) {
    let offset = Math.floor(x / xp);
    if (x - xp * offset < 0) offset--;
    x -= xp * offset;
    y -= yp * offset;
  }

  return [x * aSign, y * bSign, xp * aSign, yp * bSign];
}



const t = Array(N).fill(0);
const u = Array(N).fill(0);
for (let i = 0; i < N; i++) {
  const sol = egcd(P, -Q, B[i] - A[i]);
  if (sol === null) return "NO";
  let [ti, ui, dti, dui] = sol;
  if (ui < 0) {
    let addCount = Math.floor((-ui + dui - 1) / dui);
    ti += dti * addCount;
    ui += dui * addCount;
  }
  t[i] = ti;
  u[i] = ui;
}

const tSum = t.reduce((a, b) => a + b);
const uSum = u.reduce((a, b) => a + b);
if (tSum !== uSum) {
  const [, , dti, dui] = egcd(P, -Q, 0);
  const addCount = Math.floor((tSum - uSum) / (dui - dti));
  if (addCount < 0 || !isFinite(addCount)) return "NO";
  t[0] += dti * addCount;
  u[0] += dui * addCount;
}
if (t.some(v => v > 2e12) || u.some(v => v > 2e12)) throw "!";

// output
return `YES\n${t.join(" ")}\n${u.join(" ")}`;
}
