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
check(`7 2
9.3
9.5
9.6
9.8
9.1
5.0
9.3`,
`9.37
9.39`);
check(`3 0
9.0
5.0
1.0`,
`5.00
5.00`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], ...scores] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const round = (x) => (Math.round(x * 100) / 100).toFixed(2);
const cut = K !== 0 ? scores.flat().sort((a, b) => a - b).slice(K, -K) : scores.flat().sort((a, b) => a - b);
const uncut = [...cut];
uncut.splice(0, 0, ...Array(K).fill(cut[0]));
uncut.push(...Array(K).fill(cut[cut.length - 1]));

// output
return `${round(cut.reduce((a, b) => a + b) / cut.length)}
${round(uncut.reduce((a, b) => a + b) / uncut.length)}`
}
