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
check(`5 2 131`, `93`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K, P]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mul = (x, y, m) => {
  const xl = x >> 1, xr = x - xl, yl = y >> 1, yr = y - yl;
  let out = xl * yl + xl * yr + xr * yl;
  out -= m * Math.floor(out / m);
  out += xr * yr;
  out -= m * Math.floor(out / m);
  console.log(x, y, m, out);
  return out;
}

/**
 * @param {number} n 
 * @param {number} m 
 */
function prodMod(a, b, m) {
  let out = a % 2 === 1 ? a : 1;
  for (let i = 2 * Math.ceil(a / 2); i <= b; i += 2) out = mul(out, mul(i, i - 1, m), m);
  for (let i = Math.floor(b / 2) * 2 + 1; i <= b; i++) out = mul(out, i, m);
  return out % m;
}

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} p
*/
function powMod(a, b, p) {
  let out = 1;
  let curMul = a;
  let bin = 1;
  while (bin <= b) {
    if (b & bin) out = mul(out, curMul, p);
    bin *= 2;
    curMul = mul(curMul, curMul, p);
  }
  return out;
}



console.log(prodMod(1, 5, 499999993));
// if (N === 2) return N % P;
// if (K >= 3) return 0;
// const factVal = K === 1 ? N : factMod(N, 5e8);
// if (factVal >= K) return 0;
// if (factVal < N / 2) return factMod(factVal, P);
// else return mul(P - 1, powMod(factMod))

// output
return ":eyes:";
}
