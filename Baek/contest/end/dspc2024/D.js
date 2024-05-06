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
check(`2
1 121
3 20`,
`2
0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[t], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const isIncDesc = Array(1e6 + 1).fill(false);
loop: for (let i = 0; i <= 1e6; i++) {
  const digits = Array.from(i.toString()).map(Number);
  if (!(digits[0] < digits[1])) continue;
  if (!(digits[digits.length - 1] < digits[digits.length - 2])) continue;
  let isDesc = false;
  for (let j = 1; j < digits.length; j++) {
    if (digits[j - 1] === digits[j]) continue loop;
    if (!isDesc) {
      if (digits[j - 1] < digits[j]) continue;
      isDesc = true;
    } else {
      if (digits[j - 1] > digits[j]) continue;
      continue loop;
    }
  }
  isIncDesc[i] = true;
}

const S = [0];
for (let i = 1; i < isIncDesc.length; i++) {
  S.push(S[i - 1] + isIncDesc[i]);
}

const out = [];
for (const [a, b] of cases) {
  out.push(S[b] - S[a - 1]);
}

// output
return out.join("\n");
}
