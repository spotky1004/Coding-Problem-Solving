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
check(`88172645463325252 8748534153485358512`,
`2`);
check(`88172645463325252 716875980015554409`,
`18446744073709551614`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const SIZE = 64;
const MAX_VAL = 2**SIZE - 1;
const twoPows = [];
for (let i = 0; i < SIZE; i++) {
  twoPows.push(2**i);
}
function genMat() {
  return Array.from({ length: SIZE }, _ => Array(SIZE).fill(0));
}

function genIdentityMat() {
  const table = genMat();
  for (let i = 0; i < SIZE; i++) {
    table[i][i] = 1;
  }
  return table;
}

function matShift(orig, count) {
  const out = [];
  for (let i = 0; i < SIZE; i++) {
    out.push(orig[i - count] ?? Array(SIZE).fill(0));
  }
  return out;
}

function matAdd(a, b) {
  const out = [];
  for (let i = 0; i < SIZE; i++) {
    const row = [];
    out.push(row);
    for (let j = 0; j < SIZE; j++) {
      row.push(a[i][j] ^ b[i][j]);
    }
  }
  return out;
}

function matMul(a, b) {
  const out = [];
  for (let i = 0; i < SIZE; i++) {
    const row = [];
    out.push(row);
    for (let j = 0; j < SIZE; j++) {
      let val = 0;
      for (let k = 0; k < SIZE; k++) {
        val ^= a[i][k] * b[k][j];
      }
      row.push(val);
    }
  }
  return out;
}

function numToVec(num) {
  const vec = [];
  for (let i = 0; i < SIZE; i++) {
    vec.push(Math.sign(num & 1));
    num = Math.floor(num / 2);
  }
  return vec;
}

function vecToNum(vec) {
  let num = 0;
  for (let i = 0; i < SIZE; i++) {
    const mask = twoPows[i];
    num += mask * vec[i];
  }
  return num;
}

function applyMat(vec, mat) {
  const out = [];
  for (let i = 0; i < SIZE; i++) {
    let val = 0;
    for (let j = 0; j < SIZE; j++) {
      val ^= vec[j] * mat[i][j];
    }
    out.push(val);
  }
  return out;
}

let A = genIdentityMat();
A = matAdd(A, matShift(A, 13));
A = matAdd(A, matShift(A, -17));
A = matAdd(A, matShift(A, 5));

// output
return "answer";
}
