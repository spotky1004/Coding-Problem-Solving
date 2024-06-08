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
check(`ABCBA`, `7`);
check(`AAAA`, `10`);
check(`A`, `1`);
check(`A`.repeat(2000000), `?`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const S = input
  .trim();

// code
/**
 * @param {string | any[]} str 
 */
function manacher(str) {
  const A = [];
  let r = 0, p = 0;
  for (let i = 0; i < str.length; i++) {
    if (i >= r) A[i] = 0;
    else A[i] = Math.min(r - i - 1, A[2 * p - i]);
    while (
      typeof str[i - A[i] - 1] !== "undefined" &&
      str[i - A[i] - 1] === str[i + A[i] + 1]
    ) A[i]++;
    const newR = i + A[i] + 1;
    if (r >= newR) continue;
    r = newR, p = i;
  }
  return A;
}

return manacher(S).reduce((a, b) => a + b + 1, 0) +
  manacher(Array.from(S).map(s => s + ".").join("")).reduce((a, b, i) => a + (i % 2 === 1 ? Math.floor((b + 1) / 2) : 0), 0);
}
