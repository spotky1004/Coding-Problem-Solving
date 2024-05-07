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
    ) {
      console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
      return true;
    }
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
    return false;
  }

// cases
check(`10
1 2 3 1 2 3 1 2 3 1
2 5`,
`6`);
check(`10
1 2 3 4 5 1 2 3 4 5
-5 15`,
`60`);
check(`18
1 2 1 2 1 2 3 1 2 1 2 1 2 3 1 2 1 2
1 3`,
`3`);
check(`5
1 1 1 1 1
1 100`,
`99`);
check(`9
1 2 3 4 1 2 3 4 1
1 5`,
`10`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[L], values, [a, b]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number[]} seq 
*/
function makeLps(seq) {
  const lps = Array(seq.length);
  lps[0] = 0;

  let i = 1;
  let j = 0;
  while (i < seq.length) {
    if (seq[i] === seq[j]) {
      lps[i] = ++j;
      i++;
    } else {
      if (j !== 0) j = lps[j - 1];
      else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

/**
 * @param {number[]} seq 
 * @param {number[]} pattern 
*/
function kmp(seq, pattern) {
  const lps = makeLps(pattern);
  const matchIdxes = [];

  let i = 0;
  let j = 0;
  while (i < seq.length) {
    if (seq[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      matchIdxes.push(i - j);
      j = lps[j - 1];
    } else if (i < seq.length && seq[i] !== pattern[j]) {
      if (j === 0) i++;
      j = lps[j - 1] ?? 0;
    }
  }
  return matchIdxes;
}



const p = kmp(values.slice(1), values.slice(0, Math.ceil(L / 2)))[0] + 1;
const loopValues = values.slice(0, p).map(BigInt);
const sum = loopValues.reduce((a, b) => a + b);
let out = 0n;
const aRange = Math.floor(a / p);
const bRange = Math.floor((b - 1) / p);
const aOffset = (a + 2e9 * p) % p;
const bOffset = ((b - 1) + 2e9 * p) % p;
out += sum * BigInt(Math.max(0, bRange - aRange - 1));
if (aRange === bRange) {
  for (let i = aOffset; i <= bOffset; i++) {
    out += loopValues[i];
  }
} else {
  for (let i = aOffset; i < p; i++) {
    out += loopValues[i];
  }
  for (let i = 0; i <= bOffset; i++) {
    out += loopValues[i];
  }
}

// output
return out.toString();
}
