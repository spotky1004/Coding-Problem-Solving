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
O IK O IK JUN JUN`,
`2 2
O IK`);
check(`15
A B C B C A B C B C A B C B C`,
`2 2
B C`);
check(`5
A A A A A`,
`1 5
A`);
check(`8
A B C B A B C B`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[rawN], S] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
const N = Number(rawN);

// code
const has = new Set();
const hasIdx = new Map();
let l = 0, r = -1;
let maxRep = 0;
let maxRepL = -1, maxRepR = -1;
while (r < N) {
  r++;
  if (r === N) break;
  while (has.has(S[r])) {
    has.delete(S[l]);
    hasIdx.delete(S[l]);
    l++;
  }
  has.add(S[r]);
  hasIdx.set(S[r], r);

  if (hasIdx.get(S[r + 1])) {
    let tempL = hasIdx.get(S[r + 1]);
    let rep = 1;
    const len = r - tempL + 1;
    let s = r + 1;
    loop: while (true) {
      for (let i = 0; i < len; i++) {
        if (S[s + i] === S[tempL + i]) continue;
        break loop;
      }
      rep++;
      s += len;
    }
    if (rep > maxRep && rep >= 2) {
      maxRep = rep;
      maxRepL = tempL;
      maxRepR = r;
    }
  }
  let tempL = l;
    let rep = 1;
    const len = r - tempL + 1;
    let s = r + 1;
    loop: while (true) {
      for (let i = 0; i < len; i++) {
        if (S[s + i] === S[tempL + i]) continue;
        break loop;
      }
      rep++;
      s += len;
    }
    if (rep > maxRep && rep >= 2) {
      maxRep = rep;
      maxRepL = tempL;
      maxRepR = r;
    }
}

// output
if (maxRep === 0) return -1;
const maxRepSlice = S.slice(maxRepL, maxRepR + 1);
return `${maxRepSlice.length} ${maxRep}\n${maxRepSlice.join(" ")}`;
}
