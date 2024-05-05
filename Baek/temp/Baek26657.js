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
// check(`3
// 1 7 2 2
// 8 12 3 1
// 7 17 4 2`,
// `3
// 1
// 8`);
check(`1
1 7 2 2`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
const comb = [];
for (let n = 0n; n <= 65n; n++) {
  let cur = 1n;
  const row = [1n];
  comb.push(row);
  for (let r = 1n; r <= 65n; r++) {
    cur = cur * (n - r + 1n) / r;
    row.push(cur);
  }
}

/**
 * @param {string[]} digits 
 * @param {bigint} n 
 * @param {bigint} m 
 */
function S(digits, n, m) {
  if (digits.length === 1) {
    if (n >= 2n) return 0n;
    if (n === 0n) return 1n;
    return BigInt(digits[0]);
  }

  let out = 0n;
  let firstDigit = BigInt(digits.pop());
  out += firstDigit * S(digits, n - 1n, m);
  out += S(digits, n, m);
  digits.push(firstDigit.toString());
  firstDigit--;

  const freeDigitCount = BigInt(digits.length - 1);
  if (n !== 0n) out += (m - 1n) ** (n - 1n) * firstDigit * comb[freeDigitCount][n - 1n];
  out += (m - 1n) ** n * comb[freeDigitCount][n];

  console.log(digits, n, m, out);
  return out;
}

const out = [];
for (const [a, b, m, n] of cases) {
  out.push(
    S(Array.from(b.toString(Number(m))).reverse(), n, m) - 
    S(Array.from((a - 1n).toString(Number(m))).reverse(), n, m)
  );
}

// output
return out.join("\n");
}
