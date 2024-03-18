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
check(`7`,
`1 2`);
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
const out = Array(N).fill(-1);
out[N - 1] = N;
let l = 0, r = N - 2;
let cur = N - 1;
let tmp = 1;
let dir = 0;
while (l <= r) {
  if (dir === 1) {
    out[r] = cur;
    r--;
    cur--;
    if (tmp === 0) {
      dir = 0;
      tmp = 1;
      continue;
    }
    tmp--;
  } else {
    out[l] = cur;
    l++;
    cur--;
    if (tmp === 0) {
      dir = 1;
      tmp = 1;
      continue;
    }
    tmp--;
  }
}

// output
return out.join(" ");
}

function calcB(seq) {
  let B = 0;
  loop: for (let i = 0; i < seq.length; i++) {
    const clone = [...seq];
    let h = seq[i];
    let dir = 1;
    let pos = i;
    while (true) {
      if (dir === 1) {
        pos++;
        if (pos >= seq.length) continue loop;
        if (clone[pos] > h) {
          clone[pos]--;
          B++;
          dir = 0;
        }
      } else {
        pos--;
        if (pos < 0) continue loop;
        if (clone[pos] > h) {
          clone[pos]--;
          B++;
          dir = 1;
        }
      }
    }
  }
  return B;
}
