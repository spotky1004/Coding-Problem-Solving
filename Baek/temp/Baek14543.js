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
check(`5
2x + 3 = 4
124x + 20 = 160
123456x + 7 = 2000
0x + 2 = 3
0x + 2 = 2`,
`Equation 1
x = 0.500000

Equation 2
x = 1.129032

Equation 3
x = 0.016143

Equation 4
No solution.

Equation 5
More than one solution.`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...eq] = input
  .trim()
  .split("\n");

// code
const out = [];
for (let i = 0; i < N; i++) {
  out.push("Equation " + (i + 1));
  const [a, , b, , c] = eq[i].split(" ").map(v => parseInt(v)).map(v => isNaN(v) ? 0 : v);
  const r = c - b;
  if (a === 0 && r === 0) {
    out.push("More than one solution.");
  } else if (a === 0) {
    out.push("No solution.");
  } else {
    const x = r / a;
    out.push(`x = ${x.toFixed(20).match(/\-?\d+\.\d{6}/)}`);
  }
  out.push("");
}

// output
return out.join("\n");
}
