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
check(`3
000
010`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [, cur, goal] = input
  .trim()
  .split("\n")
  .map(line => Array.from(line));
const N = cur.length;

// code
function solveFor(diff) {
  let count = 0;
  for (let i = 1; i < N; i++) {
    if (diff[i - 1] === 1) {
      diff[i - 1] ^= 1;
      diff[i] ^= 1;
      if (i !== N - 1) diff[i + 1] ^= 1;
      count++;
    }
  }

  if (diff.every(v => v === 0)) return count;
  return Infinity;
}

const diff1 = cur.map((v, i) => v ^ goal[i]);
const diff2 = [...diff1];
diff2[0] ^= 1;
diff2[1] ^= 1;
const ans = Math.min(solveFor(diff1), solveFor(diff2) + 1);

// output
return isFinite(ans) ? ans : -1;
}
