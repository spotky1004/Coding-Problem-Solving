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
check(`7 392`, `+*+`);
check(`7 256`, `/+***`);
check(`4 256`, `**`);
check(`7 7`, `0`);
check(`7 9`, `-1`);
check(`10 1`, `/`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[s, t]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (s === t) return 0;
/** @type {Map<number, number>} */
const prevs = new Map();
const queue = [s];
loop: for (const v of queue) {
  const nexts = [v * v, v + v, 0];
  if (v !== 0) nexts.push(1);

  for (const next of nexts) {
    if (prevs.has(next)) continue;
    prevs.set(next, v);
    queue.push(next);
    if (next === t) break loop;
  }
}

if (!prevs.has(t)) return -1;
const ops = [];
for (let v = t; v !== s; v = prevs.get(v)) {
  const prev = prevs.get(v);
       if (prev * prev === v) ops.push("*");
  else if (prev + prev === v) ops.push("+");
  else if (prev - prev === v) ops.push("-");
  else if (prev / prev === v) ops.push("/");
}

// output
return ops.reverse().join("");
}
