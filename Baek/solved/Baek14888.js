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
5 6
0 0 1 0`,
`30
30`);
check(`3
3 4 5
1 0 1 0`,
`35
17`);
check(`6
1 2 3 4 5 6
2 1 1 1`,
`54
-24`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A, opCounts] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let max = -Infinity
let min = Infinity;
function search(val = A[0], i = 1) {
  if (i === N) {
    max = Math.max(max, val);
    min = Math.min(min, val);
    return;
  }

  if (opCounts[0] > 0) {
    opCounts[0]--;
    search(val + A[i], i + 1);
    opCounts[0]++;
  }

  if (opCounts[1] > 0) {
    opCounts[1]--;
    search(val - A[i], i + 1);
    opCounts[1]++;
  }

  if (opCounts[2] > 0) {
    opCounts[2]--;
    search(val * A[i], i + 1);
    opCounts[2]++;
  }

  if (opCounts[3] > 0) {
    opCounts[3]--;
    search(Number(BigInt(val) / BigInt(A[i])), i + 1);
    opCounts[3]++;
  }
}
search();

// output
return `${max}
${min}`;
}
